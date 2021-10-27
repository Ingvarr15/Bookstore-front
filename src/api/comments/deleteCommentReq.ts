import { appAxios } from "../axios.config"

export const deleteCommentReq = async (id:any) => {
  try {
    const res: any = await appAxios({
      method: 'delete',
      url: '/delete-comment',
      data: {
        id: id
      }
    })
    return res
  }
  catch (error: any) {
  }
}