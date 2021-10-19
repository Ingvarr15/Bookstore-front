import { appAxios } from "./axios.config"

export const postCommentReq = async (bookId: any, text: any, replyTo: any) => {
  try {
      console.log(bookId, text)
    const res: any = await appAxios({
      method: 'post',
          url: '/post-comment',
          data: {
            bookId: bookId,
            text: text,
            replyTo: replyTo
          },
    })
    return res
  }
  catch (error: any) {
    console.log(error.response.data.message)
  }
}