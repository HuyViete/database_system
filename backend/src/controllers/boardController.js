import mssql from 'mssql';
import { pool } from '../libs/db.js';
import * as BoardModel from '../models/Board.js';
import * as WorkspaceModel from '../models/Workspace.js';
import * as ListModel from '../models/List.js';
import * as LabelModel from '../models/Label.js';
import * as CardModel from '../models/Card.js';

export const getBoards = async (req, res) => {
    const userId = req.user.user_id;
    
    try {
        const boards = await BoardModel.getBoardsByUserId(userId);
        res.json(boards);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching boards' });
    }
};

export const createBoard = async (req, res) => {
    const userId = req.user.user_id;
    const { name, background_color, background_img, workspace_id } = req.body;
    
    const transaction = new mssql.Transaction(pool);
    
    try {
        await transaction.begin();
        
        let targetWorkspaceId = workspace_id;
        
        // If no workspace provided, find or create a default one
        if (!targetWorkspaceId) {
            // Check if user has any workspace
            const existingWorkspace = await WorkspaceModel.getWorkspaceByMemberId(userId);
                
            if (existingWorkspace) {
                targetWorkspaceId = existingWorkspace.workspace_id;
            } else {
                // Create a new default workspace
                targetWorkspaceId = await WorkspaceModel.createWorkspace(transaction, 'Trello Workspace', 'private');
                
                // Add user to workspace
                await WorkspaceModel.addWorkspaceMember(transaction, targetWorkspaceId, userId, 'Admin');
            }
        }
        
        // Create Board
        const boardId = await BoardModel.createBoard(transaction, targetWorkspaceId, name, 'private', background_color || '#0079bf', background_img || null);
        
        // Add user to Board
        await BoardModel.addBoardMember(transaction, boardId, userId, 'Admin');
            
        // Create default lists (To Do, Doing, Done)
        await ListModel.createDefaultLists(transaction, boardId);

        // Create default labels
        await LabelModel.createDefaultLabels(transaction, boardId);

        await transaction.commit();
        
        const newBoard = {
            board_id: boardId,
            workspace_id: targetWorkspaceId,
            name: name,
            visibility: 'private',
            background_color: background_color || '#0079bf',
            background_img: background_img || null
        };
        
        res.status(201).json(newBoard);
        
    } catch (error) {
        if (transaction._aborted === false) await transaction.rollback();
        console.error(error);
        res.status(500).json({ message: 'Error creating board', error: error.message });
    }
};

export const getBoard = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.user_id;
    
    try {
        const board = await BoardModel.getBoardById(id, userId);
        
        if (!board) {
            return res.status(403).json({ message: 'Access denied or board not found' });
        }
        
        const lists = await ListModel.getListsByBoardId(id);
        const cards = await CardModel.getCardsByBoardId(id);
        
        const listsWithCards = lists.map(list => ({
            ...list,
            cards: cards.filter(card => card.list_id === list.list_id)
        }));
        
        res.json({ ...board, lists: listsWithCards });
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching board details' });
    }
};

export const updateBoard = async (req, res) => {
    const { id } = req.params;
    const { name, visibility, background_color, background_img } = req.body;
    
    try {
        const updatedBoard = await BoardModel.updateBoard(id, name, visibility, background_color, background_img);
        
        if (!updatedBoard) {
            return res.status(404).json({ message: 'Board not found' });
        }
        
        res.json(updatedBoard);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating board' });
    }
};

export const getWorkspace = async (req, res) => {
    const userId = req.user.user_id;
    
    try {
        let workspace = await WorkspaceModel.getWorkspaceByMemberId(userId);
        
        if (workspace) {
            res.json(workspace);
        } else {
             // If no workspace found, create a default one "Trello Workspace"
             const transaction = new mssql.Transaction(pool);
             await transaction.begin();
             
             try {
                const workspaceId = await WorkspaceModel.createWorkspace(transaction, 'Trello Workspace', 'private');
                await WorkspaceModel.addWorkspaceMember(transaction, workspaceId, userId, 'Admin');
                
                await transaction.commit();
                
                // Fetch the newly created workspace to return it
                workspace = await WorkspaceModel.getWorkspaceById(workspaceId);
                res.json(workspace);
             } catch (err) {
                 await transaction.rollback();
                 console.error(`[getWorkspace] Failed to create default workspace:`, err);
                 throw err;
             }
        }
    } catch (error) {
        console.error('[getWorkspace] Error:', error);
        res.status(500).json({ message: 'Error fetching workspace' });
    }
};

export const updateWorkspace = async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    const userId = req.user.user_id;

    try {
        // Verify user is a member of the workspace
        const isMember = await WorkspaceModel.isWorkspaceMember(id, userId);

        if (!isMember) {
            return res.status(403).json({ message: 'Not authorized to update this workspace' });
        }

        const updatedWorkspace = await WorkspaceModel.updateWorkspace(id, name);

        if (!updatedWorkspace) {
            return res.status(404).json({ message: 'Workspace not found' });
        }

        res.json(updatedWorkspace);
    } catch (error) {
        console.error('[updateWorkspace] Error:', error);
        res.status(500).json({ message: 'Error updating workspace' });
    }
};
