import { appAxios } from "./axios.config"

export const editUserReq = async (targetField: any, value: any) => {
  console.log(targetField, value)
  switch(targetField) {
    case 'username':
      try {
        const res: any = await appAxios({
          method: 'patch',
          url: '/user-change',
          data: {
            username: value
          }
        })
        return res
      }
      catch (error: any) {
        return error.response.data.message
      }
    case 'email':
      try {
        const res: any = await appAxios({
          method: 'patch',
          url: '/user-change',
          data: {
            email: value
          }
        })
        return res
      }
      catch (error: any) {
        return error.response.data.message
      }
    case 'password':
      try {
        const res: any = await appAxios({
          method: 'patch',
          url: '/user-change',
          data: {
            password: value
          }
        })
        return res
      }
      catch (error: any) {
        return error.response.data.message
      }
    case 'dob':
      try {
        const res: any = await appAxios({
          method: 'patch',
          url: '/user-change',
          data: {
            dob: value
          }
        })
        return res
      }
      catch (error: any) {
        return error.response.data.message
      }
  }
}