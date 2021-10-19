import { appAxios } from "./axios.config"

export const setSocketReq = async (email: any, socket: any) => {
  try {
    const res: any = await appAxios({
      method: 'patch',
          url: '/set-socket',
          data: {
            email: email,
            socket: socket
          },
    })
    return res
  }
  catch (error: any) {
    console.log(error.response.data.message)
    return error.response.data.message
  }
}