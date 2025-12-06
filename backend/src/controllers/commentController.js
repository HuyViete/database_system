import * as CommentModel from '../models/Comment.js';

export const getComments = async (req, res) => {
    const { cardId } = req.params;

    try {
        const comments = await CommentModel.getCommentsByCardId(cardId);
        res.json(comments);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching comments' });
    }
};

export const createComment = async (req, res) => {
    const { cardId } = req.params;
    const { text } = req.body;
    const memberId = req.user.user_id;

    try {
        const newCommentId = await CommentModel.createComment(cardId, memberId, text);
        const newComment = await CommentModel.getCommentById(newCommentId);

        res.status(201).json(newComment);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating comment' });
    }
};

export const updateComment = async (req, res) => {
    const { commentId } = req.params;
    const { text } = req.body;
    const memberId = req.user.user_id;

    try {
        const ownerId = await CommentModel.getCommentOwner(commentId);

        if (!ownerId) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        if (ownerId !== memberId) {
            return res.status(403).json({ message: 'Not authorized to update this comment' });
        }

        const updatedComment = await CommentModel.updateComment(commentId, text);
        
        // Fetch full details again to return consistent format
        const fullUpdatedComment = await CommentModel.getCommentById(commentId);

        res.json(fullUpdatedComment);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating comment' });
    }
};

export const deleteComment = async (req, res) => {
    const { commentId } = req.params;
    const memberId = req.user.user_id;

    try {
        const ownerId = await CommentModel.getCommentOwner(commentId);

        if (!ownerId) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        if (ownerId !== memberId) {
            return res.status(403).json({ message: 'Not authorized to delete this comment' });
        }

        await CommentModel.deleteComment(commentId);

        res.json({ message: 'Comment deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting comment' });
    }
};
