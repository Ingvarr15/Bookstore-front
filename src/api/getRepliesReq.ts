import { appAxios } from "./axios.config"

export const getRepliesReq = async (userId: any) => {
  try {
      console.log(userId)
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
    console.log(error.response.data.message)
  }
}