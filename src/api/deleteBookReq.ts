import { appAxios } from "./axios.config"

export const deleteBookReq = async (id:any) => {
  try {
    const res: any = await appAxios({
      method: 'delete',
      url: '/delete-book',
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