import { appAxios } from "../axios.config"

export const getOneBookReq = async (id: any) => {
  try {
    const res: any = await appAxios({
      method: 'get',
      url: '/get-one-book',
      params: {
        bookId: id
      }
    })
    return res.data
  }
  catch (error: any) {
  }
}