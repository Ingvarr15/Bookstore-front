import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { getCommentsReq } from "../api/getCommentsReq"
import { postCommentReq } from "../api/postCommentReq"
import { useAppDispatch } from "./hooks"

export interface Comments {
	bookId: any,
	text: any,
	replyTo: any,
  items: Array<any>,
	isCommentsLoading: boolean,
	lastSendingRes: any
}

const initialState: Comments = {
	bookId: '',
	text: '',
	replyTo: '',
	items: [],
	isCommentsLoading: false,
	lastSendingRes: ''
}

export const fetchComments = createAsyncThunk(
	'comments/fetchStatus',
	async (_, api) => {
		let state: any = await api.getState()
		console.log('----', state.comments.bookId)
		const res = await getCommentsReq(state.comments.bookId)
		return res.data
	}
)

export const postComment = createAsyncThunk(
	'comments/postStatus',
	async (_, api) => {
		let state: any = api.getState()
		const res = await postCommentReq(state.comments.bookId, state.comments.text, state.comments.replyTo)
		return res.data
	}
)

export const commentSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {
		setText: (state, action) => {
			state.text = action.payload
		},
		setBookId: (state, action) => {
			state.bookId = action.payload
		},
		resetComments: state => initialState,
		setReplyTo: (state, action) => {
			state.replyTo = action.payload
		}
	},
  
  extraReducers: (builder) => {
    builder.addCase(fetchComments.pending, (state, action) => {
			state.isCommentsLoading = true
    })
    builder.addCase(fetchComments.fulfilled, (state, action) => {
			state.isCommentsLoading = false
     		state.items = action.payload
    })
		builder.addCase(fetchComments.rejected, (state, action) => {
			state.isCommentsLoading = false
    })
		builder.addCase(postComment.pending, (state, action) => {
			state.lastSendingRes = ''
    })
		builder.addCase(postComment.fulfilled, (state, action) => {
			state.lastSendingRes = action.payload
    })
  }
})

export const { setText, setBookId, resetComments, setReplyTo } = commentSlice.actions
export default commentSlice.reducer