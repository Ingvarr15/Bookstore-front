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
  ErrorAlert,
  UserHelper
} from '../style'

const UserCard = () => {
  const [isAdminShown, setIsAdminShown] = useState(false)
  const [targetField, setTargetField] = useState('')
  const [updatedField, setUpdatedField] = useState('')
  const [inputValue, setInputValue] = useState('')
  const [secondInputValue, setSecondInputValue] = useState('')
  const [isHelperShown, setIsHelperShown] = useState(false);
  const [error, setError] = useState('')
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
    if (e.currentTarget.id === 'secondInp') {
      setSecondInputValue(e.currentTarget.value)
    } else {
      setInputValue(e.currentTarget.value)
    }
  }

  const handleChangeUserData = (e:any) => {
    setInputValue('')
    setSecondInputValue('')
    setIsAdminShown(false)
    setError('')
    switch (e.target.name) {
      case 'username':
        setTargetField('Username')
        break
      case 'email':
        setTargetField('Email')
        break
      case 'password':
        setTargetField('Password')
        break
      case 'dob':
        setTargetField('Date of birth')
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
        if (inputValue === secondInputValue) {
          res = await editUserReq('password', inputValue)
        } else {
          setError('Passwords are not equal')
          setInputValue('')
          setSecondInputValue('')
          return
        }
      }
      else if (e.target.id === 'dob-button') {
        res = await editUserReq('dob', inputValue)
      }
      setInputValue('')
      if (res && res.status === 200) {
        setUpdatedField(targetField)
        handleShowHelper()
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

  const handleShowHelper = () => {
    setIsHelperShown(true)
    setTimeout(() => {
      setIsHelperShown(false)
    }, 3000);
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
        (targetField === 'Username' ?
        <UserChangeForm>
          <p>New username:</p>
          <InputChange
            value={inputValue}
            onChange={handleChange}
            type="text" 
            placeholder="New username"
            name="username-input"
            required 
          />
          <ChangeButtons>
            <Button type="submit" id="username-button" primary onClick={handleSubmit}>Submit</Button>
            <Button user onClick={handleCancel}>Cancel</Button>
          </ChangeButtons>
          <ErrorAlert>{error}</ErrorAlert>
        </UserChangeForm> :
        targetField === 'Email' ?
        <UserChangeForm>
          <p>New email:</p>
          <InputChange 
            value={inputValue}
            onChange={handleChange}
            type="email" 
            placeholder="New email"
            name="email-input"
            required 
          />
          <ChangeButtons>
            <Button type="submit" id="email-button" primary onClick={handleSubmit}>Submit</Button>
            <Button user onClick={handleCancel}>Cancel</Button>
          </ChangeButtons>
          <ErrorAlert>{error}</ErrorAlert>
        </UserChangeForm> :
        targetField === 'Password' ?
        <UserChangeForm>
          <p>New password:</p>
          <InputChange
            value={inputValue}
            onChange={handleChange}
            type="password" 
            placeholder="New password"
            name="password-input"
            required
          />
          <InputChange
            id="secondInp"
            value={secondInputValue}
            onChange={handleChange}
            type="password" 
            placeholder="Repeat password"
            required
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
          name="dob-input"
          required 
        />
        <ChangeButtons>
          <Button type="submit" id="dob-button" primary onClick={handleSubmit}>Submit</Button>
          <Button user onClick={handleCancel}>Cancel</Button>
        </ChangeButtons>
        <ErrorAlert>{error}</ErrorAlert>
        </UserChangeForm>) : ''
      }
        {isAdminShown ? <AdminForm /> : ''}
        <UserHelper shown={isHelperShown ? true : false}>{updatedField} has been updated</UserHelper>
    </Container>
  )
}

export default UserCard