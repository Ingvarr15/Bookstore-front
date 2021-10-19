import { appAxios } from "./axios.config"

export const signOutReq = async () => {
  try {
    const res: any = await appAxios({
      method: 'post',
      url: '/signout',
    })
    return res

    // const res = await axios.post(`${baseUrl}/signout`)
    // return res
  }
  catch (error: any) {
    console.log(error.response.data.message)
  }
}