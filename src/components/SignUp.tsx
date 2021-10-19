import { useState } from 'react'
import { useAppSelector, useAppDispatch } from '../redux/hooks'
import { setIsAuthorized } from '../redux/userSlice'
import { useHistory, useLocation } from 'react-router-dom'
import { signUpReq } from '../api/signUpReq'
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
  const isAuthorized = useAppSelector(state => state.user.isAuthorized)

  useEffect(() => {
    dispatch(setChapter(location.pathname))
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.currentTarget.type === 'text') {
      setUsername(e.currentTarget.value)
    }
    if (e.currentTarget.type === 'email') {
      setEmail(e.currentTarget.value)
    }
    if (e.currentTarget.type === 'password') {
      setPassword(e.currentTarget.value)
    }
    if (e.currentTarget.type === 'date') {
      setDate(e.currentTarget.value)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
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
    console.log(res)
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