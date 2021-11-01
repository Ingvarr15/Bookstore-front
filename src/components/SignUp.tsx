import { useState } from 'react'
import { useAppDispatch } from '../redux/hooks'
import { setIsAuthorized } from '../redux/userSlice'
import { useHistory, useLocation } from 'react-router-dom'
import { signUpReq } from '../api/auth/signUpReq'
import { useEffect } from 'react'
import { setChapter } from '../redux/booksSlice'
import {
  SignForm,
  Button,
  InputSign,
  SignHeading,
  SignError
} from '../style'

const SignUp = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [date, setDate] = useState('')
  const [username, setUsername] = useState('')
  const [error, setError] = useState('')
  const dispatch = useAppDispatch()
  const history = useHistory()
  const location = useLocation()

  useEffect(() => {
    dispatch(setChapter(location.pathname))
  }, [dispatch, location.pathname])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    switch(e.currentTarget.type) {
      case 'text':
        setUsername(e.currentTarget.value)
        break
      case 'email':
        setEmail(e.currentTarget.value)
        break
      case 'password':
        setPassword(e.currentTarget.value)
        break
      case 'date':
        setDate(e.currentTarget.value)
        break
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      const selectedYear = +date.substring(0, 4)
      const currentYear = new Date().getFullYear()
      if ((currentYear - selectedYear) < 7 || selectedYear < 1900) {
        setError('Select a valid date')
        return
      }
      const res: any = await signUpReq(username, email, password, date)
      if (res && res.status === 200) {
        setError('')
        dispatch(
          setIsAuthorized(true)
        )
        history.push('/user')
      } else {
        setError(res)
      }
    } catch (error) {
    }
  }

  return (
    <SignForm
      onSubmit={handleSubmit}
    >
      <SignHeading>Sign Up</SignHeading>
      <InputSign 
        type="email" 
        onChange={handleChange}
        value={email}
        required
        placeholder="Email"
      />
      <InputSign 
        type="password"
        onChange={handleChange}
        value={password}
        required
        placeholder="Password"
      />
      <InputSign 
        type="text"
        onChange={handleChange}
        value={username}
        required
        placeholder="Username"
      />
      <InputSign
        date 
        type="date"
        onChange={handleChange}
        value={date}
        required
      />
      <Button primary sign type="submit">Sign Up</Button>
    <SignError>{error}</SignError>
    </SignForm>
  )
}

export default SignUp