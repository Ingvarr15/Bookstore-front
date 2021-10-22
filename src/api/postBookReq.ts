import { appAxios } from "./axios.config"

export const postBookReq = async (uint8Array: any, uint8Array2: any, name: string, description: string, genre: string, author: string, price: number) => {
  try {
    const res: any = await appAxios({
      method: 'post',
          url: '/upload',
          data: {
            img: [...uint8Array],
            img2: [...uint8Array2],
            name: name,
            description: description,
            genre: genre,
            author: author,
            price: price
          },
    })
    return res

    // const res: any = await axios.post(`${baseUrl}/api/auth/signin`, {
    //   email: email,
    //   password: password,
    // })
    // return res
  }
  catch (error: any) {
  }
}