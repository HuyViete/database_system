import mssql from 'mssql';
import { pool } from '../libs/db.js';

export const getBoards = async (req, res) => {
    const userId = req.user.user_id;
    
    try {
        const result = await pool.request()
            .input('userId', mssql.UniqueIdentifier, userId)
            .query(`
                SELECT DISTINCT b.* 
                FROM Board b
                LEFT JOIN Board_Member bm ON b.board_id = bm.board_id
                LEFT JOIN Workspace_Member wm ON b.workspace_id = wm.workspace_id
                WHERE 
                    bm.member_id = @userId 
                    OR (wm.member_id = @userId AND b.visibility = 'workspace')
                ORDER BY b.time_updated DESC
            `);
            
        res.json(result.recordset);
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
            const wsCheck = await pool.request()
                .input('userId', mssql.UniqueIdentifier, userId)
                .query(`
                    SELECT TOP 1 w.workspace_id 
                    FROM Workspace w
                    JOIN Workspace_Member wm ON w.workspace_id = wm.workspace_id
                    WHERE wm.member_id = @userId
                `);
                
            if (wsCheck.recordset.length > 0) {
                targetWorkspaceId = wsCheck.recordset[0].workspace_id;
            } else {
                // Create a new default workspace
                const wsRequest = new mssql.Request(transaction);
                const wsResult = await wsRequest
                    .input('name', mssql.NVarChar, 'My Workspace')
                    .input('visibility', mssql.VarChar, 'private')
                    .query(`
                        INSERT INTO Workspace (name, visibility)
                        OUTPUT INSERTED.workspace_id
                        VALUES (@name, @visibility)
                    `);
                targetWorkspaceId = wsResult.recordset[0].workspace_id;
                
                // Add user to workspace
                const wmRequest = new mssql.Request(transaction);
                await wmRequest
                    .input('workspaceId', mssql.UniqueIdentifier, targetWorkspaceId)
                    .input('memberId', mssql.UniqueIdentifier, userId)
                    .input('role', mssql.VarChar, 'Admin')
                    .query(`
                        INSERT INTO Workspace_Member (workspace_id, member_id, role)
                        VALUES (@workspaceId, @memberId, @role)
                    `);
            }
        }
        
        // Create Board
        const boardRequest = new mssql.Request(transaction);
        const boardResult = await boardRequest
            .input('workspaceId', mssql.UniqueIdentifier, targetWorkspaceId)
            .input('name', mssql.NVarChar, name)
            .input('visibility', mssql.VarChar, 'private')
            .input('backgroundColor', mssql.VarChar, background_color || '#0079bf')
            .input('backgroundImg', mssql.VarChar, background_img || null)
            .query(`
                INSERT INTO Board (workspace_id, name, visibility, background_color, background_img)
                OUTPUT INSERTED.board_id
                VALUES (@workspaceId, @name, @visibility, @backgroundColor, @backgroundImg)
            `);
            
        const boardId = boardResult.recordset[0].board_id;
        
        // Add user to Board
        const bmRequest = new mssql.Request(transaction);
        await bmRequest
            .input('boardId', mssql.UniqueIdentifier, boardId)
            .input('memberId', mssql.UniqueIdentifier, userId)
            .input('role', mssql.VarChar, 'Admin')
            .query(`
                INSERT INTO Board_Member (board_id, member_id, role)
                VALUES (@boardId, @memberId, @role)
            `);
            
        // Create default lists (To Do, Doing, Done)
        const listRequest = new mssql.Request(transaction);
        await listRequest
            .input('boardId', mssql.UniqueIdentifier, boardId)
            .query(`
                INSERT INTO List (board_id, name, position) VALUES 
                (@boardId, 'To Do', 0),
                (@boardId, 'Doing', 1),
                (@boardId, 'Done', 2)
            `);

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
        // Check access
        const accessCheck = await pool.request()
            .input('boardId', mssql.UniqueIdentifier, id)
            .input('userId', mssql.UniqueIdentifier, userId)
            .query(`
                SELECT 1 FROM Board_Member WHERE board_id = @boardId AND member_id = @userId
                UNION
                SELECT 1 FROM Board b 
                JOIN Workspace_Member wm ON b.workspace_id = wm.workspace_id
                WHERE b.board_id = @boardId AND wm.member_id = @userId AND b.visibility = 'workspace'
                UNION
                SELECT 1 FROM Board WHERE board_id = @boardId AND visibility = 'public'
            `);
            
        if (accessCheck.recordset.length === 0) {
            return res.status(403).json({ message: 'Access denied' });
        }
        
        // Get Board Details
        const boardResult = await pool.request()
            .input('boardId', mssql.UniqueIdentifier, id)
            .query(`SELECT * FROM Board WHERE board_id = @boardId`);
            
        const board = boardResult.recordset[0];
        
        // Get Lists
        const listsResult = await pool.request()
            .input('boardId', mssql.UniqueIdentifier, id)
            .query(`SELECT * FROM List WHERE board_id = @boardId ORDER BY position ASC`);
            
        const lists = listsResult.recordset;
        
        // Get Cards for all lists
        // We can do this in one query or loop. One query is better.
        const cardsResult = await pool.request()
            .input('boardId', mssql.UniqueIdentifier, id)
            .query(`
                SELECT c.* 
                FROM Card c
                JOIN List l ON c.list_id = l.list_id
                WHERE l.board_id = @boardId
                ORDER BY c.position ASC
            `);
            
        const cards = cardsResult.recordset;
        
        // Assemble the data
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
    const { name } = req.body;
    
    try {
        const result = await pool.request()
            .input('boardId', mssql.UniqueIdentifier, id)
            .input('name', mssql.NVarChar, name)
            .query(`
                UPDATE Board
                SET name = @name, time_updated = GETDATE()
                OUTPUT INSERTED.*
                WHERE board_id = @boardId
            `);
            
        if (result.recordset.length === 0) {
            return res.status(404).json({ message: 'Board not found' });
        }
        
        res.json(result.recordset[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating board' });
    }
};
