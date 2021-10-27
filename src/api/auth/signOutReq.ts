import { appAxios } from "../axios.config"

export const signOutReq = async () => {
  try {
    const res: any = await appAxios({
      method: 'post',
      url: '/signout',
    })
    return res
  }
  catch (error: any) {
  }
}