import api from '../libs/axios'

const boardService = {
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
  }
}

export default boardService
