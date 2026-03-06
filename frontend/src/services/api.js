import axios from 'axios'

const API_URL = "https://games-store-5.onrender.com/games";  // Change only if your backend port is different

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
})

export const getAllGames = () => api.get('/')
export const createGame = (data) => api.post('/', data)
export const updateGame = (id, data) => api.put(`/${id}`, data)
export const deleteGame = (id) => api.delete(`/${id}`)

export default api