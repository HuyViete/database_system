import axios from '../libs/axios';

export const getWorkspaceMembers = async (workspaceId) => {
    const response = await axios.get(`/workspaces/${workspaceId}/members`);
    return response.data;
};
