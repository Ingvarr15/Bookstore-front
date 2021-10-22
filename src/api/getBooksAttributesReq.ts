import { appAxios } from "./axios.config"

export const getBooksAttributesReq = async () => {
  try {
    const res: any = await appAxios({
      method: 'get',
      url: '/get-books-attrs',
    })
    return res

    // const res: any = await axios.get(`${baseUrl}/user`)
    // console.log(res)
    // return res
  }
  catch (error: any) {
  }
}