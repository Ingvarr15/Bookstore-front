import { appAxios } from "./axios.config"

export const getCommentsReq = async (bookId: any) => {
  console.log('-----', bookId)
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
    console.log(error.response.data.message)
  }
}