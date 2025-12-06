import api from '../libs/axios'

const boardService = {
  getWorkspace: async () => {
    const response = await api.get('/boards/workspace')
    return response.data
  },
  updateWorkspace: async (id, name) => {
    const response = await api.put(`/boards/workspace/${id}`, { name })
    return response.data
  },
  getBoards: async () => {
    const response = await api.get('/boards')
    return response.data
  },
  createBoard: async (boardData) => {
    const response = await api.post('/boards', boardData)
    return response.data
  },
  getBoard: async (id) => {
    const response = await api.get(`/boards/${id}`)
    return response.data
  },
  createCard: async (cardData) => {
    const response = await api.post('/cards', cardData)
    return response.data
  },
  createList: async (listData) => {
    const response = await api.post('/lists', listData)
    return response.data
  },
  updateBoard: async (id, boardData) => {
    const response = await api.put(`/boards/${id}`, boardData)
    return response.data
  },
  updateList: async (id, listData) => {
    const response = await api.put(`/lists/${id}`, listData)
    return response.data
  },
  updateCard: async (id, cardData) => {
    const response = await api.put(`/cards/${id}`, cardData)
    return response.data
  },
  updateListOrder: async (id, position) => {
    const response = await api.put(`/lists/${id}/reorder`, { position })
    return response.data
  },
  updateCardOrder: async (id, listId, position) => {
    const response = await api.put(`/cards/${id}/reorder`, { listId, position })
    return response.data
  },
  deleteList: async (id) => {
    const response = await api.delete(`/lists/${id}`)
    return response.data
  },
  deleteCard: async (id) => {
    const response = await api.delete(`/cards/${id}`)
    return response.data
  }
}

export default boardService
