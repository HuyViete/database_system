import * as WorkspaceModel from '../models/Workspace.js';

export const getWorkspaceMembers = async (req, res) => {
    const { workspaceId } = req.params;
    
    try {
        const members = await WorkspaceModel.getWorkspaceMembers(workspaceId);
        res.json(members);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching workspace members' });
    }
};
