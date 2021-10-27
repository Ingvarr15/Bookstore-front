import { appAxios } from "../axios.config"

export const signInReq = async (email: string, password: string) => {
  try {
    const res: any = await appAxios({
      method: 'post',
      url: '/api/auth/signin',
      data: {
        email: email,
        password: password,
      }
    })
    return res
  }
  catch (error: any) {
    return error.response.data.message
  }
}