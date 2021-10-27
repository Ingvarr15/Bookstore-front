import { appAxios } from "../axios.config"

export const getUserReq = async () => {
  try {
    const res: any = await appAxios({
      method: 'get',
      url: '/user'
    })
    return res
  }
  catch (error: any) {
  }
}