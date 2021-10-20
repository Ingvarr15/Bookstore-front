import { appAxios } from "./axios.config"

export const uploadAvatarReq = async (id: any, uint8Array: any) => {
  try {
    const res: any = await appAxios({
      method: 'post',
          url: '/avatar',
          data: {
            id: id,
            avatar: [...uint8Array],
          },
    })
    console.log([...uint8Array])
    return res
  }
  catch (error: any) {
    console.log(error.response.data.message)
  }
}