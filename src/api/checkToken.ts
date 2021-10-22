import { appAxios } from "./axios.config"

export const checkToken = async () => {
  try {
    const res: any = await appAxios({
      method: 'get',
      url: '/check'
    })
    return res
  } catch (error: any) {
  }
}