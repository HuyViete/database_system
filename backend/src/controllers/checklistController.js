import * as ChecklistModel from '../models/Checklist.js';

export const getChecklists = async (req, res) => {
    const { cardId } = req.params;
    try {
        const checklists = await ChecklistModel.getChecklistsByCardId(cardId);
        res.json(checklists);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching checklists' });
    }
};

export const createChecklist = async (req, res) => {
    const { cardId } = req.params;
    const { name } = req.body;
    try {
        const checklist = await ChecklistModel.createChecklist(cardId, name);
        res.status(201).json(checklist);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating checklist' });
    }
};

export const deleteChecklist = async (req, res) => {
    const { checklistId } = req.params;
    try {
        await ChecklistModel.deleteChecklist(checklistId);
        res.json({ message: 'Checklist deleted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting checklist' });
    }
};

export const createChecklistItem = async (req, res) => {
    const { checklistId } = req.params;
    const { description } = req.body;
    try {
        const item = await ChecklistModel.createChecklistItem(checklistId, description);
        res.status(201).json(item);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating checklist item' });
    }
};

export const updateChecklistItem = async (req, res) => {
    const { itemId } = req.params;
    const { description, is_completed } = req.body;
    try {
        const item = await ChecklistModel.updateChecklistItem(itemId, description, is_completed);
        res.json(item);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating checklist item' });
    }
};

export const deleteChecklistItem = async (req, res) => {
    const { itemId } = req.params;
    try {
        await ChecklistModel.deleteChecklistItem(itemId);
        res.json({ message: 'Checklist item deleted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting checklist item' });
    }
};
