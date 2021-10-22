import { appAxios } from "./axios.config"

export const postCommentReq = async (bookId: any, text: any, replyTo: any) => {
  try {
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
  }
}