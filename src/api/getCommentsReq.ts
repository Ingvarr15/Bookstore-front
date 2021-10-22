import { appAxios } from "./axios.config"

export const getCommentsReq = async (bookId: any) => {
  try {
    const res: any = await appAxios({
      method: 'get',
      url: '/get-comments',
      params: {
        bookId: bookId
      }
    })
    return res
  }
  catch (error: any) {
  }
}