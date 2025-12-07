import * as InvitationModel from '../models/Invitation.js';
import * as UserModel from '../models/User.js';
import * as NotificationModel from '../models/Notification.js';
import crypto from 'crypto';

export const createInvitation = async (req, res) => {
    const { workspaceId } = req.params;
    const { email } = req.body;
    const inviterId = req.user.user_id;

    if (!email) {
        return res.status(400).json({ message: 'Email is required' });
    }

    try {
        // Generate a random token
        const token = crypto.randomBytes(32).toString('hex');
        
        const invitation = await InvitationModel.createInvitation(inviterId, email, workspaceId, token);

        // Check if user exists and create notification
        const user = await UserModel.getUserByEmail(email);
        if (user) {
            await NotificationModel.createNotification(
                user.user_id,
                'New Workspace Invitation',
                `You have been invited to join a workspace.`
            );
        }

        res.status(201).json(invitation);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating invitation' });
    }
};

export const getInvitations = async (req, res) => {
    const { workspaceId } = req.params;
    try {
        const invitations = await InvitationModel.getInvitationsByWorkspaceId(workspaceId);
        res.json(invitations);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching invitations' });
    }
};
