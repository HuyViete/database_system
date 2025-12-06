import axios from '../libs/axios';

export const getComments = async (cardId) => {
    const response = await axios.get(`/comments/${cardId}`);
    return response.data;
};

export const createComment = async (cardId, text) => {
    const response = await axios.post(`/comments/${cardId}`, { text });
    return response.data;
};

export const updateComment = async (commentId, text) => {
    const response = await axios.put(`/comments/${commentId}`, { text });
    return response.data;
};

export const deleteComment = async (commentId) => {
    const response = await axios.delete(`/comments/${commentId}`);
    return response.data;
};
