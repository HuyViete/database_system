import * as LabelModel from '../models/Label.js';

export const getBoardLabels = async (req, res) => {
    const { boardId } = req.params;
    try {
        const labels = await LabelModel.getLabelsByBoardId(boardId);
        res.json(labels);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching labels' });
    }
};

export const createLabel = async (req, res) => {
    const { boardId } = req.params;
    const { name, color } = req.body;
    try {
        const newLabel = await LabelModel.createLabel(boardId, name, color);
        res.status(201).json(newLabel);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating label' });
    }
};

export const updateLabel = async (req, res) => {
    const { labelId } = req.params;
    const { name, color } = req.body;
    try {
        const updatedLabel = await LabelModel.updateLabel(labelId, name, color);
        if (!updatedLabel) {
            return res.status(404).json({ message: 'Label not found' });
        }
        res.json(updatedLabel);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating label' });
    }
};

export const deleteLabel = async (req, res) => {
    const { labelId } = req.params;
    try {
        const success = await LabelModel.deleteLabel(labelId);
        if (!success) {
            return res.status(404).json({ message: 'Label not found' });
        }
        res.json({ message: 'Label deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting label' });
    }
};

export const getCardLabels = async (req, res) => {
    const { cardId } = req.params;
    try {
        const labels = await LabelModel.getLabelsByCardId(cardId);
        res.json(labels);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching card labels' });
    }
};

export const addLabelToCard = async (req, res) => {
    const { cardId, labelId } = req.params;
    try {
        const exists = await LabelModel.checkLabelOnCard(cardId, labelId);
        if (exists) {
            return res.status(400).json({ message: 'Label already added to card' });
        }

        await LabelModel.addLabelToCard(cardId, labelId);
        res.status(201).json({ message: 'Label added to card' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error adding label to card' });
    }
};

export const removeLabelFromCard = async (req, res) => {
    const { cardId, labelId } = req.params;
    try {
        const success = await LabelModel.removeLabelFromCard(cardId, labelId);
        if (!success) {
            return res.status(404).json({ message: 'Label not found on card' });
        }
        res.json({ message: 'Label removed from card' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error removing label from card' });
    }
};
