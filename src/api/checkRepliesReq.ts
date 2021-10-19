import { appAxios } from "./axios.config"

export const checkRepliesReq = async (userId: any) => {
  try {
    const res: any = await appAxios({
      method: 'patch',
      url: '/check-replies',
      data: {
        userId: userId
      } 
    })
    return res
  }
  catch (error: any) {
    console.log(error.response.data.message)
  }
}