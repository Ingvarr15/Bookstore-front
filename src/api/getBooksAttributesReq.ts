import { appAxios } from "./axios.config"

export const getBooksAttributesReq = async () => {
  try {
    const res: any = await appAxios({
      method: 'get',
      url: '/get-books-attrs',
    })
    console.log(res)
    return res

    // const res: any = await axios.get(`${baseUrl}/user`)
    // console.log(res)
    // return res
  }
  catch (error: any) {
    console.log(error.response.data.message)
  }
}