import { useState, useRef } from "react"
import { postBookReq } from "../api/postBookReq"
import {
  AdminFormContainer, 
  AdminInput,
  Button,
  AdminCardHeading,
  AdminCardDescription,
  BookProp,
  AdminCardSelect
} from '../style'

const AdminForm = () => {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [genre, setGenre] = useState('')
  const [author, setAuthor] = useState('')
  const [price, setPrice] = useState(0)
  const [rating, setRating] = useState(0)

  const fileRef = useRef<any>(null)
  const fileRef2 = useRef<any>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e: any) => {
    e.preventDefault()

    const fetchData = async (uint8Array: any, uint8Array2: any) => {
      try {
        const res = await postBookReq(uint8Array, uint8Array2, name, description, genre, author, rating, price)
        console.log(name, description, genre, author)
        setLoading(false)
      } catch (error) {
        console.error(error)
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
      setName(e.currentTarget.value)
    }
    if (e.currentTarget.name === 'description') {
      setDescription(e.currentTarget.value)
    }
    if (e.currentTarget.name === 'genre') {
      setGenre(e.currentTarget.value)
    }
    if (e.currentTarget.name === 'author') {
      setAuthor(e.currentTarget.value)
    }
    if (e.currentTarget.name === 'rating') {
      setRating(e.currentTarget.value)
    }
    if (e.currentTarget.name === 'price') {
      setPrice(e.currentTarget.value)
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
        value={name}
        required
      />
      <AdminCardDescription 
        type="text" 
        name="description"
        placeholder="Description"
        onChange={handleChange} 
        value={description}
        required
      />
      <BookProp>Genre:</BookProp>
      <AdminCardSelect name="genre" required onChange={handleChange} value={genre}>
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
        value={author}
        required
      />
      <AdminInput 
        type="number"
        name="rating"
        min="0.1"
        step="0.01"
        onChange={handleChange} 
        value={rating}
        required
      />
      <BookProp>Price:</BookProp>
      <AdminInput 
        type="number" 
        name="price"
        min="1"
        step="0.01"
        onChange={handleChange} 
        value={price}
        required
      />
      <BookProp>Cover:</BookProp>
      <AdminInput
        onChange={(e: any) => fileRef.current = e.target.files}
        accept="image/*"
        type="file"
        id="button-file"
        required
      />
      <BookProp>Text sample (optional):</BookProp>
      <AdminInput
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