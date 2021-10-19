import { appAxios } from "./axios.config"

export const deleteCommentReq = async (id:any) => {
  try {
    const res: any = await appAxios({
      method: 'delete',
      url: '/delete-comment',
      data: {
        id: id
      }
    })
    console.log(res)
    return res
  }
  catch (error: any) {
    console.log(error.response.data.message)
  }
}