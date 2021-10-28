import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit"
import { getUserReq } from '../api/user/getUserReq'
import { checkToken } from "../api/auth/checkToken"
import { setSocketReq } from "../api/auth/setSocketReq"
import { getRepliesReq } from "../api/comments/getRepliesReq"
import { checkRepliesReq } from "../api/comments/checkRepliesReq"

export interface UserType {
  isAuthorized: boolean,
  isUserInfoLoading: boolean,
  socket: string,
  id: string,
  avatar: string | null,
  username: string,
  email: string,
  dob: string,
  password: string,
  role: string,
  replies: any,
  repliesCount: any,
  ratings: any,
  isTokenChecking: boolean,
  isExists: boolean,
  isRepliesLoading: boolean
}

const initialState: UserType = {
  isAuthorized: true,
  isUserInfoLoading: false,
  socket: '',
  avatar: null,
  id: '',
  username: '',
  email: '',
  dob: '',
  password: '',
  role: '',
  replies: [],
  repliesCount: '',
  ratings: [],
  isTokenChecking: false,
  isExists: true,
  isRepliesLoading: false
}

export const fetchUser = createAsyncThunk(
  'user/fetchUserStatus',
  async () => {
    const res = await getUserReq()
    return res.data
  }
)

export const fetchToken = createAsyncThunk(
  'user/fetchTokenStatus',
  async () => {
    const res = await checkToken()
    return res.data
  }
)

export const fetchReplies = createAsyncThunk(
  'user/fetchRepliesStatus',
  async (_, api) => {
    let state: any = api.getState()
    const res = await getRepliesReq(state.user.id)
    return res.data
  }
)

export const checkReplies = createAsyncThunk(
  'user/checkRepliesStatus',
  async (_, api) => {
    let state: any = api.getState()
    const res = await checkRepliesReq(state.user.id)
    return res.data
  }
)

export const sendSocket = createAsyncThunk(
	'user/sendSocketStatus',
	async (_, api) => {
		let state: any = api.getState()
		const res = await setSocketReq(state.user.email, state.user.socket)
		return res.data
	}
)

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUsername: (state, action: PayloadAction<string>) => {
      state.username = action.payload
    },
    reset: state => initialState,
    setIsAuthorized: (state, action: PayloadAction<boolean>) => {
      state.isAuthorized = action.payload
      if (action.payload === false) {
        state.avatar = null
        state.username = ''
        state.email = ''
        state.id = ''
        state.dob = ''
        state.role = ''
        state.replies = []
        state.repliesCount = ''
      }
    },
    getRole: (state): any => {
      return state.role
    },
    setSocket: (state, action): any => {
      state.socket = action.payload
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchUser.fulfilled, (state, action) => {
      if (action.payload.avatar !== null) {
        state.avatar = action.payload.avatar
      }
      state.username = action.payload.username
      state.email = action.payload.email
      state.dob = action.payload.dob
      state.role = action.payload.role === 1 ? 'User' : 'Admin'
      state.id = action.payload.id
      state.isUserInfoLoading = false
      state.ratings = action.payload.ratings
    })
    builder.addCase(fetchUser.pending, (state, action) => {
      state.username = '...'
      state.email = '...'
      state.dob = '...'
      state.isUserInfoLoading = true
    })
    builder.addCase(fetchUser.rejected, (state, action) => {
      state.isExists = false
      state.isUserInfoLoading = false
    })

    builder.addCase(fetchReplies.fulfilled, (state, action) => {
      state.replies = action.payload.repliesItems
      state.repliesCount = action.payload.count
    })

    builder.addCase(sendSocket.pending, (state, action) => {
      state.isRepliesLoading = true
    })
    builder.addCase(sendSocket.fulfilled, (state, action) => {
      state.isRepliesLoading = false
    })
    
    builder.addCase(fetchToken.pending, (state, action) => {
      state.isTokenChecking = true
    })
    builder.addCase(fetchToken.fulfilled, (state, action) => {
      state.isAuthorized = true
      state.isTokenChecking = false
      state.isExists = true
    })
    builder.addCase(fetchToken.rejected, (state, action: any) => {
      state.isAuthorized = false
      state.isTokenChecking = false
    })
  }
})

export const { setUsername, setIsAuthorized, getRole, setSocket, reset } = userSlice.actions
export default userSlice.reducer