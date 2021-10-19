import { appAxios } from "./axios.config"

export const postBookReq = async (uint8Array: any, uint8Array2: any, name: string, description: string, genre: string, author: string, rating: number, price: number) => {
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
            rating: rating,
            price: price
          },
    })
    console.log([...uint8Array])
    return res

    // const res: any = await axios.post(`${baseUrl}/api/auth/signin`, {
    //   email: email,
    //   password: password,
    // })
    // return res
  }
  catch (error: any) {
    console.log(error.response.data.message)
  }
}