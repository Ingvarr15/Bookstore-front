import { appAxios } from "../axios.config"
import { signInReq } from "./signInReq"

export const signUpReq = async (username: string, email: string, password: string, dob: any) => {
  try {
    const res: any = await appAxios({
      method: 'post',
      url: '/api/auth/signup',
      data: {
        username: username,
        email: email,
        password: password,
        dob: dob
      }
    })
    if (res.status === 200) {
      const signInRes = await signInReq(email, password)
      return signInRes
    }
  }
  catch (error: any) {
    return error.response.data.message
  }
}