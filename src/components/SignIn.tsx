import { useEffect, useState } from 'react'
import { useAppDispatch } from '../redux/hooks'
import { fetchToken, fetchUser } from '../redux/userSlice'
import { useHistory, useLocation } from 'react-router-dom'
import { signInReq } from '../api/auth/signInReq'
import { setChapter } from '../redux/booksSlice'
import {
  SignForm,
  Button,
  InputSign,
  SignHeading,
  SignError
} from '../style'
const SignIn = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const dispatch = useAppDispatch()
  const history = useHistory()
  const location = useLocation()
  
  useEffect(() => {
    dispatch(setChapter(location.pathname))
  }, [dispatch, location.pathname])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.currentTarget.type === 'email') {
      setEmail(e.currentTarget.value)
    }
    if (e.currentTarget.type === 'password') {
      setPassword(e.currentTarget.value)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      const res: any = await signInReq(email, password)
      if (res && res.status === 200) {
        history.push('/')
        setError('')
        dispatch(
          fetchToken()
        )
        dispatch(
          fetchUser()
        )
      } else {
        setError(res)
      }
    } catch(error) {
    }
  }

  return (
    <SignForm
      onSubmit={handleSubmit}
    >
      <SignHeading>Sign In</SignHeading>
      <InputSign 
        type="email" 
        onChange={handleChange}
        value={email}
        required/>
      <InputSign 
        type="password"
        onChange={handleChange}
        value={password}
        required/>
      <Button primary sign type="submit">Sign In</Button>
      <SignError>{error}</SignError>
    </SignForm>
  )
}

export default SignIn