import { useState, useRef, useReducer } from "react"
import { postBookReq } from "../api/book/postBookReq"
import {
  AdminFormContainer, 
  AdminInput,
  Button,
  AdminCardHeading,
  AdminCardDescription,
  BookProp,
  AdminCardSelect
} from '../style'

function resetState() {
  return {...initialState}
}

function reducer(state: any, action: any) {
  switch (action.type) {
    case 'reset':
      return resetState()
    case 'name':
      return {
        ...state,
        name: action.payload
      }
    case 'description':
      return {
        ...state,
        description: action.payload
      }
    case 'genre':
      return {
        ...state,
        genre: action.payload
      }
    case 'author':
      return {
        ...state,
        author: action.payload
      }
    case 'price':
      return {
        ...state,
        price: action.payload
      }
  } 
}

const initialState = {
  name: '',
  description: '',
  genre: '',
  author: '',
  price: 0
}

const AdminForm = () => {
  const fileRef = useRef<any>(null)
  const fileRef2 = useRef<any>(null)
  const inpRef = useRef<any>(null)
  const inpRef2 = useRef<any>(null)
  const [loading, setLoading] = useState(false)

  const [data, localDispatch] = useReducer(reducer, initialState, resetState)

  const handleSubmit = (e: any) => {
    e.preventDefault()

    const fetchData = async (uint8Array: any, uint8Array2: any) => {
      try {
        const res = await postBookReq(uint8Array, uint8Array2, data.name, data.description, data.genre, data.author, data.price)
        setLoading(false)
        if (res && res.status === 200) {
          localDispatch({ type: 'reset' })
          inpRef.current.value = null
          inpRef2.current.value = null
        }
      } catch (error) {
      }
    }

    if (!fileRef.current) return void null

    const reader = new FileReader()
    reader.onloadend = () => {
      const uint8Array = new Uint8Array(reader.result as any)
      setLoading(true)
      if (fileRef2.current) {
        nextImage(uint8Array)
      } else if (!fileRef2.current) {
        fetchData(uint8Array, '')
      }
    }
    reader.readAsArrayBuffer(fileRef.current[0])
    const nextImage = (uint8Array: any) => {
      const reader2 = new FileReader()
      reader2.onloadend = () => {
        const uint8Array2 = new Uint8Array(reader2.result as any)
        fetchData(uint8Array, uint8Array2)
      }
      reader2.readAsArrayBuffer(fileRef2.current[0])
    }
  }

  const handleChange = (e: any) => {
    if (e.currentTarget.name === 'name') {
      localDispatch({ type: 'name', payload: e.currentTarget.value})
    }
    if (e.currentTarget.name === 'description') {
      localDispatch({ type: 'description', payload: e.currentTarget.value})
    }
    if (e.currentTarget.name === 'genre') {
      localDispatch({ type: 'genre', payload: e.currentTarget.value})
    }
    if (e.currentTarget.name === 'author') {
      localDispatch({ type: 'author', payload: e.currentTarget.value})
    }
    if (e.currentTarget.name === 'price') {
      localDispatch({ type: 'price', payload: e.currentTarget.value})
    }
  }

  return(
    <AdminFormContainer onSubmit={handleSubmit}>
      <AdminCardHeading>New book</AdminCardHeading>
      <AdminInput 
        type="text" 
        name="name"
        placeholder="Name"
        onChange={handleChange} 
        value={data.name}
        required
      />
      <AdminCardDescription 
        type="text" 
        name="description"
        placeholder="Description"
        onChange={handleChange} 
        value={data.description}
        required
      />
      <BookProp>Genre:</BookProp>
      <AdminCardSelect name="genre" required onChange={handleChange} value={data.genre}>
        <option value=""></option>
        <option value="Classics">Classics</option>
        <option value="Detective">Detective</option>
        <option value="Fantasy">Fantasy</option>
        <option value="Horror">Horror</option>
        <option value="Science">Science</option>
      </AdminCardSelect>
      <AdminInput
        placeholder="Author"
        type="text" 
        name="author" 
        onChange={handleChange} 
        value={data.author}
        required
      />
      <BookProp>Price:</BookProp>
      <AdminInput 
        type="number" 
        name="price"
        min="1"
        step="0.01"
        onChange={handleChange} 
        value={data.price}
        required
      />
      <BookProp>Cover:</BookProp>
      <AdminInput
        ref={inpRef}
        onChange={(e: any) => fileRef.current = e.target.files}
        accept="image/*"
        type="file"
        id="button-file"
        required
      />
      <BookProp>Text sample (optional):</BookProp>
      <AdminInput
        ref={inpRef2}
        onChange={(e: any) => fileRef2.current = e.target.files}
        accept="image/*"
        type="file"
        id="button-file2"
      />
      <Button type="submit">{loading ? 'Saving...' : 'Save'}</Button>
    </AdminFormContainer>
  )
}

export default AdminForm