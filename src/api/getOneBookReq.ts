import { appAxios } from "./axios.config"

export const getOneBookReq = async (id: any) => {
  console.log(id, '-----=========')
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
    console.log(error.response.data.message)
  }
}