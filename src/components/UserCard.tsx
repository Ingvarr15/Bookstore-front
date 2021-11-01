import { useAppSelector, useAppDispatch } from '../redux/hooks'
import { fetchUser, setIsAuthorized } from '../redux/userSlice'
import { useLocation } from 'react-router-dom'
import { signOutReq } from '../api/auth/signOutReq'
import { editUserReq } from '../api/user/editUserReq'
import { useEffect, useRef, useState } from 'react'
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
  UserHelper,
  CurrentHeading,
  HeadingContainer,
  UserInner,
  Avatar,
  AvatarContainer,
  UserPropContainer,
  UserParagraph,
  UserInfoContainer
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
  const avatar = useAppSelector(state => state.user.avatar)

  useEffect(() => {
    dispatch(fetchUser())
    dispatch(setChapter(location.pathname))
  }, [dispatch, location.pathname])

  useEffect(() => {
    if (isExists === false) {
      dispatch(
        setIsAuthorized(false)
      )
    }
  }, [dispatch, isExists])

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
      case 'avatar':
        setTargetField('Avatar')
        break
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

  const fileRef = useRef<any>(null)

  const handleSubmit = async (e:any) => {
    try {
      e.preventDefault()
      let res
      if (e.target.id === 'avatar-button') {
        const fetchData = async (uint8Array: any) => {
          try {
            const response = await editUserReq('avatar', uint8Array)
            return response
          } catch (error) {
          }
        }
        if (!fileRef.current || !fileRef.current[0].type.includes('image')) {
          setError('You should pick a picture')
          return void null
        }

    
        const reader = new FileReader()
        reader.onloadend = async () => {
          const uint8Array = new Uint8Array(reader.result as any)
          res = await fetchData(uint8Array)
          if (res && res.status === 200) {
            setUpdatedField(targetField)
            handleShowHelper()
            setTargetField('')
            setError('')
            dispatch(fetchUser())
            fileRef.current = null
          } else if (res) {
            setError(res)
          }
        }
        reader.readAsArrayBuffer(fileRef.current[0])
      }

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
        const selectedYear = +inputValue.substring(0, 4)
        const date = new Date().getFullYear()
        if ((date - selectedYear) < 7 || selectedYear < 1900) {
          setError('Select a valid date')
          return
        } else {
          res = await editUserReq('dob', inputValue)
        }
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
    } catch (error) {
    }
  }

  const handleCancel = () => {
    setInputValue('')
    setTargetField('')
  }

  const handleSignOut = async () => {
    try {
      const res: any = await signOutReq()
      if (res && res.status === 200) {
        dispatch(
          setIsAuthorized(false)
        )
      }
    } catch (error) {
    }
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
      <HeadingContainer>
        <CurrentHeading>User Page</CurrentHeading>
      </HeadingContainer>
      <UserInner>
        <AvatarContainer>
          <Avatar src={avatar === null ? './avatar.png' : avatar} alt="" />
          <Button
            avatar
            primary
            name="avatar"
            onClick={handleChangeUserData}
          >Change avatar</Button>
        </AvatarContainer>
        <UserInfoContainer>
          <UserParagraph>
            <UserPropContainer>
              <UserProp>Username: </UserProp>{username}
            </UserPropContainer>
            <Button
              name="username"
              onClick={handleChangeUserData}
            >Change username</Button>
            <Button
              user
              name="password"
              onClick={handleChangeUserData}
            >Change password</Button>
          </UserParagraph>
          <UserParagraph>
            <UserPropContainer>
              <UserProp>Email: </UserProp>{email}
            </UserPropContainer>
            <Button
              name="email"
              onClick={handleChangeUserData}
            >Change email</Button>
          </UserParagraph>
          <UserParagraph>
            <UserPropContainer>
              <UserProp>Date of birth: </UserProp>{dob}
            </UserPropContainer>
            <Button
              name="dob"
              onClick={handleChangeUserData}
            >Change date of birth</Button>
          </UserParagraph>
          <UserParagraph>
            <UserPropContainer>
              <UserProp>Role: </UserProp>{role}
            </UserPropContainer>
            { role === 'Admin' ? 
              <Button
                user
                onClick={handleAdmin}
              >Admin Card</Button> :
              ''
            }
            <Button
              onClick={handleSignOut}
              primary
            >Sign out</Button>
          </UserParagraph>
        </UserInfoContainer>
      </UserInner>
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
        targetField === 'Avatar' ? 
        <UserChangeForm avatar>
          <input
            onChange={(e: any) => fileRef.current = e.target.files}
            accept="image/*"
            type="file"
            id="button-file"
            required
          />
          <ChangeButtons>
            <Button type="submit" id="avatar-button" primary onClick={handleSubmit}>Submit</Button>
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