import axios from "axios"
export const appAxios = axios.create({
  baseURL: 'http://localhost:3000',
})

// export const baseUrl = 'http://localhost:3000'