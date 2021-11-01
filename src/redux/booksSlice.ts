import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { getBooksReq } from "../api/user/getBooksReq"
import { getOneBookReq } from "../api/user/getOneBookReq"

export interface Books {
  items: Array<any>,
  totalItems: number,
  isLoading: boolean,
  order: string,
  sortBy: string,
  filterBy: string,
  from: number | string,
  to: number | string,
  filterValue: any,
  page: number,
  currChapter: string,
  oneBook: any,
  isBookFound: boolean
}

const initialState: Books = {
  items: [],
  totalItems: 0,
  isLoading: false,
  order: 'asc',
  sortBy: 'createdAt',
  filterBy: '',
  from: '',
  to: '',
  filterValue: '',
  page: 1,
  currChapter: '',
  oneBook: '',
  isBookFound: true
}

export const fetchBooks = createAsyncThunk(
  'books/fetchStatus',
  async (_, api) => {
    try {
      let state: any = api.getState()
      const res = await getBooksReq(state.books.sortBy, state.books.order, state.books.filterBy, state.books.from, state.books.to, state.books.filterValue, state.books.page)
      return res.data
    } catch (error) {
    }
  }
)

export const fetchOneBook = createAsyncThunk(
  'books/fetchOneStatus',
  async (_, api) => {
    try {
      let state: any = api.getState()
      const res = await getOneBookReq(state.comments.bookId)
      return res
    } catch(error) {
    }
  }
)

export const bookSlice = createSlice({
  name: 'books',
  initialState,
  reducers: {
    changeOrder: (state, action) => {
      state.order = action.payload
    },
    changeSort: (state, action) => {
      state.sortBy = action.payload
    },
    setBookSearch: (state, action: any) => {
      state.filterBy = action.payload.filterBy
      state.filterValue = action.payload.filterValue
      state.from = action.payload.from
      state.to = action.payload.to
    },
    prevPage: (state) => {
      state.page = state.page - 1
    },
    nextPage: (state) => {
      state.page = state.page + 1
    },
    setPage: (state, action) => {
      state.page = action.payload
    },
    setChapter: (state, action) => {
      state.currChapter = action.payload
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchBooks.pending, (state, action) => {
      state.isLoading = true
    })
    builder.addCase(fetchOneBook.fulfilled, (state, action) => {
      if (action.payload !== undefined) {
        state.oneBook = action.payload
        state.isBookFound = true
      } else {
        state.isBookFound = false
      }
    })

    builder.addCase(fetchOneBook.rejected, (state, action) => {
      console.log('ERROR')
    })
    
    builder.addCase(fetchBooks.fulfilled, (state, action) => {
      state.items = action.payload.books
      state.isLoading = false
      state.totalItems = action.payload.count
    })
  }
})

export const { changeOrder, changeSort, setBookSearch, prevPage, nextPage, setPage, setChapter } = bookSlice.actions
export default bookSlice.reducer