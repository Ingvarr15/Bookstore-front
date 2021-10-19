import React from 'react'
import { useAppSelector, useAppDispatch } from './redux/hooks'
import { useEffect, useState } from 'react'
import { changeOrder, changeSort, fetchBooks, setBookSearch, setChapter, setPage } from './redux/booksSlice'

import {
  Switch,
  Route,
  Link,
  generatePath,
  Redirect,
  useHistory,
  withRouter,
  useLocation
} from 'react-router-dom';

import MainPage from './components/MainPage'
import UserCard from './components/UserCard'
import SignIn from './components/SignIn'
import SignUp from './components/SignUp'
import BookCard from './components/BookCard'
import NotMatch from './components/NotMatch'
import { checkReplies, fetchReplies, fetchToken, fetchUser, sendSocket, setSocket } from './redux/userSlice'
import { fetchComments } from './redux/commentSlice'
import socket from './socket'
import { createUnparsedSourceFile } from 'typescript';
import { getOneBookReq } from './api/getOneBookReq';
import OneBookCard from './components/OneBookCard';
import { 
  Button, 
  NavBar, 
  NavUL, 
  NavLink, 
  MainContainer,
  NavListItem,
  Replies,
  ReplyItem,
  ReplyUL,
  ReplyLogo,
  Logo,
  ReplyInner,
  Container
} from './style';


function App() {
  const isAuthorized = useAppSelector(state => state.user.isAuthorized)
  const isTokenChecking = useAppSelector(state => state.user.isTokenChecking)
  const booksList = useAppSelector(state => state.books.items)
  const dispatch = useAppDispatch()
  const location = useLocation()
  const orderState = useAppSelector(state => state.books.order)
  const sortState = useAppSelector(state => state.books.sortBy)
  const filterByState = useAppSelector(state => state.books.filterBy)
  const filterValueState = useAppSelector(state => state.books.filterValue)
  const fromState = useAppSelector(state => state.books.from)
  const toState = useAppSelector(state => state.books.to)
  const page = useAppSelector(state => state.books.page)
  const chapter = useAppSelector(state => state.books.currChapter)
  const emailState = useAppSelector(state => state.user.email)
  const socketState = useAppSelector(state => state.user.socket)
  const idState = useAppSelector(state => state.user.id)
  const isRepliesLoading = useAppSelector(state => state.user.isRepliesLoading)
  const repliesState = useAppSelector(state => state.user.replies)
  const repliesCountState = useAppSelector(state => state.user.reliesCount)
  const isUserInfoLoading = useAppSelector(state => state.user.isUserInfoLoading)
  const [isRepliesShown, setIsRepliesShown] = useState(false);
  const history = useHistory()
    
  const params = {
    page: `page=${page}`,
    order: `order=${orderState}`,
    sortBy: `sortBy=${sortState}`,
    filterByState: `filterBy=${filterByState}`,
    filterValueState: `value=${filterValueState}`,
    fromState: `from=${fromState}`,
    toState: `to=${toState}`
  }

  useEffect(() => {
    let query = new URLSearchParams(location.search)
    if (query.get('page') &&
        query.get('order') &&
        query.get('sortBy')
    ) {
      dispatch(setPage(query.get('page')))
      dispatch(changeOrder(query.get('order')))
      dispatch(changeSort(query.get('sortBy')))
      dispatch(setBookSearch({
        filterBy: query.get('filterBy') ? query.get('filterBy') : '',
        filterValue: query.get('value') ? query.get('value') : '',
        from: query.get('from') ? query.get('from') : '',
        to: query.get('to') ? query.get('to') : ''
      }))
    }
  }, [])

  useEffect(() => {
    dispatch(fetchUser())
    dispatch(setChapter(location.pathname))
    console.log(location.pathname.split('/')[1])
  }, [])

  useEffect(() => {
    socket.on('newReply', () => {
      if (idState !== '') {
        dispatch(fetchReplies())
      }
    })
  }, [idState])

  useEffect(() => {
    if (socketState !== '' && emailState !== '' && emailState !== '...') {
      dispatch(sendSocket())
      dispatch(fetchReplies())
    }
  }, [socketState, emailState])

  useEffect(() => {
    setIsRepliesShown(false)
  }, [location])

  useEffect(() => {
    socket.on('newConnection', () => {
      dispatch(setSocket(socket.id))
      console.log(socket.id)
    })
    socket.on('newReply', (asd) => {
      console.log(asd)
    })
  }, [socket])

  useEffect(() => {
    if (chapter === '/') {
      setURL()
      dispatch(fetchBooks())
    } else if (chapter !== '/') {
      dispatch(fetchBooks())
    }
  }, [page, orderState, sortState, filterByState, filterValueState, fromState, toState, chapter])

  function setURL() {
      history.push({
        pathname: '/',
        search: '?' + params.page + '&' + params.order + '&' + params.sortBy +
        (filterByState ? '&' + params.filterByState : '') + 
        (filterValueState ? '&' + params.filterValueState : '') + 
        (fromState ? '&' + params.fromState : '') + 
        (toState ? '&' + params.toState : '')
      })
  }

  useEffect(() => {
    checkTokenFunc()
    console.log(isAuthorized)
  }, [])

  async function checkTokenFunc() {
    dispatch(
      fetchToken()
    )
  }

  const changeChapter = (path: string) => {
    dispatch(setChapter(path))
  }

  const checkRepliesFunc = async () => {
    const res = await dispatch(checkReplies())
  }

  const handleRepliesToggle = () => {
    if (isRepliesShown) {
      setIsRepliesShown(false)
      checkRepliesFunc()
    } else if (!isRepliesShown) {
      setIsRepliesShown(true)
      checkRepliesFunc()
    }
  }

  return (
      <MainContainer>
        <NavBar>
          <Container>
          <Logo>Book Store</Logo>
          <NavUL>
          {!isRepliesLoading && !isUserInfoLoading && isAuthorized ? 
            <NavListItem onClick={handleRepliesToggle}>
              <ReplyLogo>Replies: {repliesCountState}</ReplyLogo>
              {isRepliesShown ? 
                <Replies>
                  <ReplyUL>
                  {repliesState.length > 0 ?
                    repliesState.map((item: any) => 
                    <NavLink reply to={`/book/${item.book}`} key={`rl${item.id}`} onClick={() => changeChapter(`/book/${item.id}`)}>
                      <ReplyItem key={`r${item.id}`} onClick={() => dispatch(fetchReplies())}>
                        <ReplyInner>
                          User {item.owner} replied to you: "{item.text}"
                        </ReplyInner>
                      </ReplyItem>
                    </NavLink>
                    )
                    : <ReplyItem>No replies...</ReplyItem>
                  }
                  </ReplyUL>
                </Replies> : ''
              }
            </NavListItem> : ''
          }
            {!isTokenChecking && isAuthorized ?
              <NavListItem>
                <NavLink to="/user" onClick={() => changeChapter('/user')}>User</NavLink>
              </NavListItem> :
                !isTokenChecking && !isAuthorized ?
              <NavListItem>
                <NavLink to="/signin" onClick={() => changeChapter('/signin')}>Sign in</NavLink>
              </NavListItem> : ''
            }
            {!isTokenChecking && !isAuthorized ?
              <NavListItem>
                <NavLink to="/signup" onClick={() => changeChapter('/signup')}>Sign Up</NavLink>
              </NavListItem>
                : ''
            }
            <NavListItem onClick={setURL}>
              <NavLink to="/" onClick={() => changeChapter('/')}>Home</NavLink>
            </NavListItem>
          </NavUL>
          </Container>
        </NavBar>
        <Switch>
          <Route path="/user">
            {!isAuthorized ? <Redirect to="/signin"/> : <UserCard />}
          </Route>
          <Route path="/signin">
            {isAuthorized ? <Redirect to="/user"/> : <SignIn />}
          </Route>
          <Route path="/signup">
            <SignUp />
          </Route>
          <Route exact path="/">
            <MainPage/>
          </Route>
          { 
            booksList.map(item =>
              <Route key={item.id} path={generatePath(`/book/${item.id}`, { id: item.id })}>
                <BookCard
                  item={item}
                />
              </Route>
            )
          }
          { chapter.includes('book') && ((booksList.find(item => item.id === location.pathname.split('/book/')[1]) === undefined)) ?
            <Route path={generatePath(`/book/${location.pathname.split("/book/")[1]}`, { id: location.pathname.split('/book/')[1] })}>
              <OneBookCard />
            </Route> : ''
          }
        </Switch>
      </MainContainer>
  );
}

export default withRouter(App)