import api from '../libs/axios'

const authService = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password })
    return response.data
  },
  signup: async (userData) => {
    const response = await api.post('/auth/signup', userData)
    return response.data
  },
  monitorLogin: async (token) => {
    const payload = token ? { token } : {}
    const response = await api.post('/auth/monitor-login', payload)
    return response.data
  }
}

export default authService