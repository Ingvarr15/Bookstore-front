import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { getBooksAttributesReq } from "../api/getBooksAttributesReq"
import { getBooksReq } from "../api/getBooksReq"
import { getOneBookReq } from "../api/getOneBookReq"

export interface Books {
  items: Array<any>,
  authors: any,
  totalItems: number,
  isLoading: boolean,
  order: string,
  sortBy: string,
  filterBy: string,
  from: number | string,
  to: number | string,
  filterValue: string,
  page: number,
  currChapter: string,
  oneBook: any,
  isBookFound: boolean
}

const initialState: Books = {
  items: [],
  authors: [],
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
    let state: any = api.getState()
    const res = await getBooksReq(state.books.sortBy, state.books.order, state.books.filterBy, state.books.from, state.books.to, state.books.filterValue, state.books.page)
    console.log(res)
    return res.data
  }
)

export const fetchOneBook = createAsyncThunk(
  'books/fetchOneStatus',
  async (_, api) => {
    let state: any = api.getState()
    const res = await getOneBookReq(state.comments.bookId)
    console.log(res)
    return res
  }
)

export const fetchBooksAttributesReq = createAsyncThunk(
  'books/fetchAttrStatus',
  async () => {
    const res = await getBooksAttributesReq()
    return res.data
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
        let tempObj = action.payload
        const b64toBlob = (b64Data: any, contentType='', sliceSize=512) => {
          const byteCharacters = atob(b64Data)
          const byteArrays = []
        
          for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            const slice = byteCharacters.slice(offset, offset + sliceSize);
        
            const byteNumbers = new Array(slice.length)
            for (let i = 0; i < slice.length; i++) {
              byteNumbers[i] = slice.charCodeAt(i)
            }
        
            const byteArray = new Uint8Array(byteNumbers)
            byteArrays.push(byteArray)
          }
        
          const blob = new Blob(byteArrays, {type: contentType})
          return blob
        }
        const blob = b64toBlob(tempObj.img, 'image/png')
        const blob2 = b64toBlob(tempObj.img2, 'image/png')
        const blobUrl = URL.createObjectURL(blob)
        tempObj.img = URL.createObjectURL(blob)
        tempObj.img2 = tempObj.img2 === null ? null : URL.createObjectURL(blob2)
        state.oneBook = tempObj
        console.log(tempObj)
        state.isBookFound = true
      } else {
        state.isBookFound = false
      }
    })

    builder.addCase(fetchOneBook.rejected, (state, action) => {
      console.log('ERROR')
    })
    
    builder.addCase(fetchBooks.fulfilled, (state, action) => {
      const tempArr:any = action.payload.books
      tempArr.forEach((item: any) => {
        const b64toBlob = (b64Data: any, contentType='', sliceSize=512) => {
          const byteCharacters = atob(b64Data)
          const byteArrays = []
        
          for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            const slice = byteCharacters.slice(offset, offset + sliceSize);
        
            const byteNumbers = new Array(slice.length)
            for (let i = 0; i < slice.length; i++) {
              byteNumbers[i] = slice.charCodeAt(i)
            }
        
            const byteArray = new Uint8Array(byteNumbers)
            byteArrays.push(byteArray)
          }
        
          const blob = new Blob(byteArrays, {type: contentType})
          return blob
        }
        const blob = b64toBlob(item.img, 'image/png')
        const blob2 = b64toBlob(item.img2, 'image/png')
        const blobUrl = URL.createObjectURL(blob)
        item.img = URL.createObjectURL(blob)
        item.img2 = item.img2 === null ? null : URL.createObjectURL(blob2)
      })
      let rawAuthorsArr = action.payload.books.map((item: any) => item.author)
      state.authors = Array.from(new Set(rawAuthorsArr)).sort()
      state.items = tempArr
      state.isLoading = false
      state.totalItems = action.payload.count
    })
  }
})

export const { changeOrder, changeSort, setBookSearch, prevPage, nextPage, setPage, setChapter } = bookSlice.actions
export default bookSlice.reducer