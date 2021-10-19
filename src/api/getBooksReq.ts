import { appAxios } from "./axios.config"

export const getBooksReq = async (sortBy: any, order: any, filterBy: any, from:any, to: any, filterValue: any, page: any) => {
  console.log(sortBy, order)
  try {
    const res: any = await appAxios({
      method: 'get',
      url: '/get-books',
      params: {
        order: order,
        sortBy: sortBy,
        filterBy: filterBy,
        from: from,
        to: to,
        filterValue: filterValue,
        page: page
      }
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