import { appAxios } from "../axios.config"

export const getRepliesReq = async (userId: any) => {
  try {
    const res: any = await appAxios({
      method: 'get',
      url: '/get-replies',
      params: {
        userId: userId
      }
    })
    return res
  }
  catch (error: any) {
  }
}