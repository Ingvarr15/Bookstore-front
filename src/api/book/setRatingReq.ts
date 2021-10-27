import { appAxios } from "../axios.config"

export const setRatingReq = async (bookId: any, rating: any) => {
  try {
    const res: any = await appAxios({
      method: 'patch',
          url: '/set-rating',
          data: {
            bookId: bookId,
            rating: rating
          },
    })
    return res
  }
  catch (error: any) {
    return error.response.data.message
  }
}