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
import { checkReplies, fetchReplies, fetchToken, fetchUser, sendSocket, setSocket } from './redux/userSlice'
import socket from './socket'
import OneBookCard from './components/OneBookCard';
import {
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
  Container,
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
  const repliesState = useAppSelector(state => state.user.replies)
  const repliesCountState = useAppSelector(state => state.user.reliesCount)
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
      const queryValue = query.get('value')
      const genreValue = (queryValue !== null) ? queryValue.split(",") : ''
      const queryPage = query.get('page')
      const pageValue = (queryPage !== null) ? +queryPage : 1

      dispatch(setPage(pageValue))
      dispatch(changeOrder(query.get('order')))
      dispatch(changeSort(query.get('sortBy')))
      dispatch(setBookSearch({
        filterBy: query.get('filterBy') ? query.get('filterBy') : '',
        filterValue: query.get('value') ? 
          query.get('filterBy') === 'genre' ? genreValue : query.get('value') : '',
        from: query.get('from') ? query.get('from') : '',
        to: query.get('to') ? query.get('to') : ''
      }))
    }
  }, [])

  useEffect(() => {
    dispatch(fetchUser())
    dispatch(setChapter(location.pathname))
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
          {isAuthorized ? 
            <NavListItem onClick={handleRepliesToggle}>
              <ReplyLogo shown={isRepliesShown ? true : false}><i className="fas fa-bell"></i> {repliesCountState}</ReplyLogo>
              {isRepliesShown ? 
                <Replies>
                  <ReplyUL>
                  {repliesState.length > 0 ?
                    repliesState.map((item: any) => 
                    <NavLink reply to={`/book/${item.book}`} key={`rl${item.id}`} onClick={() => changeChapter(`/book/${item.id}`)}>
                      <ReplyItem key={`r${item.id}`} onClick={() => dispatch(fetchReplies())}>
                          User {item.owner} replied to you: "{
                            item.text.length > 4 ?
                            item.text.substring(0, 5) + '...' :
                            item.text
                          }"
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