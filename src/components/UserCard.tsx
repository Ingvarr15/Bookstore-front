import { useAppSelector, useAppDispatch } from '../redux/hooks'
import { fetchUser, setIsAuthorized } from '../redux/userSlice'
import { useHistory, useLocation } from 'react-router-dom'
import { signOutReq } from '../api/signOutReq'
import { editUserReq } from '../api/editUserReq'
import { useEffect, useState } from 'react'
import AdminForm from './AdminForm'
import { setChapter } from '../redux/booksSlice'
import { 
  Button,
  Container,
  UserProp,
  UserChangeForm,
  InputChange,
  ChangeButtons,
  ErrorAlert
} from '../style'

const UserCard = () => {
  const [isAdminShown, setIsAdminShown] = useState(false)
  const [targetField, setTargetField] = useState('')
  const [inputValue, setInputValue] = useState('')
  const [error, setError] = useState('');
  const dispatch = useAppDispatch()
  const location = useLocation()
  const username = useAppSelector(state => state.user.username)
  const email = useAppSelector(state => state.user.email)
  const dob = useAppSelector(state => state.user.dob)
  const role = useAppSelector(state => state.user.role)
  const isExists = useAppSelector(state => state.user.isExists)

  useEffect(() => {
    dispatch(fetchUser())
    dispatch(setChapter(location.pathname))
  }, [])

  useEffect(() => {
    if (isExists === false) {
      dispatch(
        setIsAuthorized(false)
      )
    }
  }, [isExists])

  const handleChange = (e:any) => {
    setInputValue(e.currentTarget.value)
  }

  const handleChangeUserData = (e:any) => {
    setIsAdminShown(false)
    setError('')
    switch (e.target.name) {
      case 'username':
        setTargetField('username')
        break
      case 'email':
        setTargetField('email')
        break
      case 'password':
        setTargetField('password')
        break
      case 'dob':
        setTargetField('dob')
        break
    }
  }

  const handleSubmit = async (e:any) => {
    e.preventDefault()
    console.log(e)
    let res
      if (e.target.id === 'username-button') {
        res = await editUserReq('username', inputValue)
      }
      else if (e.target.id === 'email-button') {
        res = await editUserReq('email', inputValue)
      }
      else if (e.target.id === 'password-button') {
        res = await editUserReq('password', inputValue)
      }
      else if (e.target.id === 'dob-button') {
        res = await editUserReq('dob', inputValue)
      }
      setInputValue('')
      if (res && res.status === 200) {
        setTargetField('')
        setError('')
        dispatch(fetchUser())
      } else if (res) {
        setError(res)
      }
  }

  const handleCancel = () => {
    setInputValue('')
    setTargetField('')
  }

  const handleSignOut = async () => {
    await signOutReq()
    dispatch(
      setIsAuthorized(false)
    )
  }

  const handleAdmin = () => {
    handleCancel()
    isAdminShown ? setIsAdminShown(false) : setIsAdminShown(true)
  }


  return (
    <Container user>
      <div>
      <h1>User Page</h1>
      <UserProp>Your username:</UserProp>
      <p>{username}</p>
      <Button
        name="username"
        onClick={handleChangeUserData}
      >Change username</Button>
      <Button
        user
        name="password"
        onClick={handleChangeUserData}
      >Change password</Button>
      <UserProp>Your email:</UserProp>
      <p>{email}</p>
      <Button
        name="email"
        onClick={handleChangeUserData}
      >Change email</Button>
      <UserProp>Date of birth:</UserProp>
      <p>{dob}</p>
      <Button
        name="dob"
        onClick={handleChangeUserData}
      >Change date of birth</Button>
      <UserProp>Your role:</UserProp>
      <p>{role}</p>
      { role === 'Admin' ? 
        <Button
          onClick={handleAdmin}
        >Admin Card</Button> :
        ''
      }
      <Button
        onClick={handleSignOut}
        user
      >Sign out</Button>  
      </div>
      {targetField ?
        (targetField === 'username' ?
        <UserChangeForm>
          <p>New username:</p>
          <InputChange
            value={inputValue}
            onChange={handleChange}
            type="text" 
            placeholder="username"
            name="username-input"
            autoFocus 
          />
          <ChangeButtons>
            <Button type="submit" id="username-button" primary onClick={handleSubmit}>Submit</Button>
            <Button user onClick={handleCancel}>Cancel</Button>
          </ChangeButtons>
          <ErrorAlert>{error}</ErrorAlert>
        </UserChangeForm> :
        targetField === 'email' ?
        <UserChangeForm>
          <p>New email:</p>
          <InputChange 
            value={inputValue}
            onChange={handleChange}
            type="text" 
            placeholder="email"
            name="email-input"
            autoFocus 
          />
          <ChangeButtons>
            <Button type="submit" id="email-button" primary onClick={handleSubmit}>Submit</Button>
            <Button user onClick={handleCancel}>Cancel</Button>
          </ChangeButtons>
          <ErrorAlert>{error}</ErrorAlert>
        </UserChangeForm> :
        targetField === 'password' ?
        <UserChangeForm>
          <p>New password:</p>
          <InputChange
            value={inputValue}
            onChange={handleChange}
            type="text" 
            placeholder="password"
            name="password-input"
            autoFocus
          />
          <ChangeButtons>
            <Button type="submit" id="password-button" primary onClick={handleSubmit}>Submit</Button>
            <Button user onClick={handleCancel}>Cancel</Button>
          </ChangeButtons>
          <ErrorAlert>{error}</ErrorAlert>
        </UserChangeForm> :
        <UserChangeForm>
        <p>New Date of birth:</p>
        <InputChange 
          value={inputValue}
          onChange={handleChange}
          type="date" 
          date
          placeholder="dob"
          name="dob-input"
          autoFocus 
        />
        <ChangeButtons>
          <Button type="submit" id="dob-button" primary onClick={handleSubmit}>Submit</Button>
          <Button user onClick={handleCancel}>Cancel</Button>
        </ChangeButtons>
        <ErrorAlert>{error}</ErrorAlert>
        </UserChangeForm>) : ''
      }
        {isAdminShown ? <AdminForm /> : ''}
    </Container>
  )
}

export default UserCard