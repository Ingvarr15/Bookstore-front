import { useCallback, useEffect, useReducer, useRef } from "react"
import { useHistory, useLocation } from "react-router-dom"
import { deleteBookReq } from "../api/book/deleteBookReq"
import { deleteCommentReq } from "../api/comments/deleteCommentReq"
import { setRatingReq } from "../api/book/setRatingReq"
import { fetchBooks, setChapter } from "../redux/booksSlice"
import { fetchComments, setBookId, setText, postComment, setReplyTo } from "../redux/commentSlice"
import { useAppSelector, useAppDispatch } from "../redux/hooks"
import { fetchUser } from "../redux/userSlice"
import socket from "../socket"
import {
  Preview,
  BookImg,
  BookImages,
  BookInfo,
  BookContainer,
  MainImg,
  PreviewContainer,
  BookInner,
  BookPropName,
  Button,
  CommentTextArea,
  CommentsUL,
  CommentLI,
  CommentsContainer,
  CommentOwner,
  CommentText,
  CommentsForm,
  ReplyAlert,
  ReplyAlertInner,
  RatingBody,
  RatingActive,
  RatingItems,
  RatingItem,
  RatingContainer,
  RatingOfUser,
  BookTabs,
  Tab,
  CurrentTab
} from "../style"

function resetState() {
  return {...initialState}
}

function reducer(state: any, action: any) {
  switch (action.type) {
    case 'reset':
      return resetState()
    case 'goldStars':
      return {
        ...state,
        goldStars: action.payload
      }
    case 'userRating':
      return {
        ...state,
        userRating: action.payload
      }
    case 'comment':
      return {
        ...state,
        comment: action.payload
      }
    case 'setReply':
      return {
        ...state,
        reply: !state.reply
      }
    case 'replyTarget':
      return {
        ...state,
        replyTarget: action.payload
      }
    case 'photo':
      return {
        ...state,
        photo: action.payload
      }
    case 'isMainTab':
      return {
        ...state,
        isMainTab: !state.isMainTab
      }
  } 
}

const initialState = {
  comment: '',
  reply: false,
  replyTarget: '',
  photo: 1,
  goldStars: 0,
  userRating: 0,
  isMainTab: true,
}

const BookCard = ({item}: any) => {
  const dispatch = useAppDispatch()
  const booksList = useAppSelector(state => state.books.items)
  const commentsList = useAppSelector(state => state.comments.items)
  const commentTextState = useAppSelector(state => state.comments.text)
  const bookId = useAppSelector(state => state.comments.bookId)
  const idState = useAppSelector(state => state.user.id)
  const isAuthorized = useAppSelector(state => state.user.isAuthorized)
  const isTokenChecking = useAppSelector(state => state.user.isTokenChecking)
  const userRatingsState = useAppSelector(state => state.user.ratings)
  const location = useLocation()
  const history = useHistory()
  const [data, localDispatch] = useReducer(reducer, initialState, resetState)
  const myRef: any = useRef()

  const calculateUserRating = useCallback(() => {
    const userRating = userRatingsState.find((rating: any) => rating.book === item.id)
    if (userRating !== undefined) {
      return userRating.rating / 0.05
    } else {
      return 0
    }
  }, [item.id, userRatingsState])

  useEffect(() => {
    localDispatch({ type: 'goldStars', payload: item.rating / 0.05 })
    localDispatch({ type: 'userRating', payload: calculateUserRating() })
  }, [booksList, userRatingsState, item.rating, calculateUserRating])

  useEffect(() => {
    dispatch(setBookId(item.id))
  }, [dispatch, item.id])

  useEffect(() => {
    if (commentTextState !== '') {
      dispatch(postComment())
    } else if (commentTextState === '') {
      handleReplyOff()
    }
  }, [dispatch, commentTextState])

  useEffect(() => {
    socket.on('newComment', () => {
      dispatch(fetchComments())
    })
  }, [dispatch])

  useEffect(() => {
    dispatch(fetchComments())
    dispatch(setText(''))
  }, [dispatch, bookId])
  
  useEffect(() => {
    dispatch(setChapter(location.pathname))
    dispatch(fetchUser())
  }, [dispatch, location.pathname])
  
  const role = useAppSelector(state => state.user.role)

  const handleDelete = async () => {
    const res = await deleteBookReq(item.id)
    if (res.status === 204) {
      history.push('/')
    }
  }

  const handleChangeComment = (e: any) => {
    localDispatch({ type: 'comment', payload: e.currentTarget.value })
  }

  const handleSubmitComment = (e: any) => {
    e.preventDefault()
    dispatch(setText(data!.comment))
    socket.emit('comment', data!.comment)
    localDispatch({ type: 'comment', payload: '' })
  }

  const handleReplyOn = (ownerId: any, owner: any) => {
    if (!data.reply) {
      myRef.current.scrollIntoView() 
      myRef.current.select()
      localDispatch({ type: 'setReply' })
      localDispatch({ type: 'replyTarget', payload: owner })
      dispatch(setReplyTo(ownerId))
    } else if (data.reply) {
      localDispatch({ type: 'setReply' })
      localDispatch({ type: 'replyTarget', payload: '' })
      dispatch(setReplyTo(''))
    }
  }

  const handleReplyOff = () => {
    if (data.reply) {
      localDispatch({ type: 'setReply' })
      localDispatch({ type: 'replyTarget', payload: '' })
      dispatch(setReplyTo(''))
    }
  }

  const handleChangePhoto = (img: number) => {
    localDispatch({ type: 'photo', payload: img })
  }

  const handleDeleteComment = async (id: number) => {
    const res: any = await deleteCommentReq(id)
    if (res.status === 201) {
      dispatch(fetchComments())
    }
  }

  const handleChangeRadio = async (e: any) => {
    const res: any = await setRatingReq(item.id, e.target.id)
    if (res && res.status === 200) {
      dispatch(fetchBooks())
      dispatch(fetchUser())
    }
  }

  const handleEnterMouse = (e: any) => {
    localDispatch({ type: 'userRating', payload: e.currentTarget.dataset.percent })
  }

  const handleLeaveMouse = () => {
    localDispatch({ type: 'userRating', payload: calculateUserRating() })
  }

  const handleChangeTab = () => {
    localDispatch({ type: 'isMainTab' })
  }
 
  return (
    <div>
      <BookContainer>
        <BookImages>
          <MainImg>
            { data!.photo === 1 ? <BookImg src={`http://localhost:8080/${item.img}`}/> :
              data!.photo === 2 && item.img2 !== null ? <BookImg src={`http://localhost:8080/${item.img2}`}/>
              : ''
            }
          </MainImg>
          <PreviewContainer>
            <Preview
              src={`http://localhost:8080/${item.img}`}
              active={data!.photo === 1 ? true : false}
              onClick={() => handleChangePhoto(1)}
            />
            { item.img2 !== null ? 
            <Preview 
              src={`http://localhost:8080/${item.img2}`} 
              active={data!.photo === 2 ? true : false}
              onClick={() => handleChangePhoto(2)}
            /> :
            ''
            }
          </PreviewContainer>
        </BookImages>
        <BookInfo>
          <h2>{item.name}</h2>
            <BookTabs>
              <Tab 
                current={data!.isMainTab ? true : false}
                onClick={handleChangeTab}
              >Main</Tab>
              <Tab 
                current={!data!.isMainTab ? true : false}
                onClick={handleChangeTab}
              >About book</Tab>
            </BookTabs>
            { data!.isMainTab ? 
              <CurrentTab>
                <BookInner>
                  <BookPropName>Price: </BookPropName>€{item.price}
                </BookInner>
                <BookInner>
                  <BookPropName>Rating: </BookPropName> {item.rating === null ? '-' : item.rating.toString().substring(0, 3)}
                  <RatingContainer>
                    <RatingBody
                      onMouseLeave={handleLeaveMouse}
                    >
                      <RatingActive 
                        style={{width: `${data!.goldStars}%`}} 
                        id="rating-active"
                      ></RatingActive>
                      <RatingOfUser
                        style={{width: `${data!.userRating}%`}}            
                      ></RatingOfUser>
                      <RatingItems>
                        <RatingItem name="rating" onMouseEnter={handleEnterMouse} onChange={handleChangeRadio} type="radio" id="1" data-percent="20"/>
                        <RatingItem name="rating" onMouseEnter={handleEnterMouse} onChange={handleChangeRadio} type="radio" id="2" data-percent="40"/>
                        <RatingItem name="rating" onMouseEnter={handleEnterMouse} onChange={handleChangeRadio} type="radio" id="3" data-percent="60"/>
                        <RatingItem name="rating" onMouseEnter={handleEnterMouse} onChange={handleChangeRadio} type="radio" id="4" data-percent="80"/>
                        <RatingItem name="rating" onMouseEnter={handleEnterMouse} onChange={handleChangeRadio} type="radio" id="5" data-percent="100"/>
                      </RatingItems>
                    </RatingBody>
                  </RatingContainer>
                </BookInner>
              </CurrentTab> :
               <CurrentTab description>
                <BookInner>
                  <BookPropName>Genre: </BookPropName> {item.genre}
                </BookInner>
                <BookInner>
                  <BookPropName>Author: </BookPropName> {item.author}
                </BookInner>
                <BookInner>
                  <BookPropName>Description: </BookPropName> {item.description}
                </BookInner>
              </CurrentTab>
            }
        </BookInfo>
      </BookContainer>
      <CommentsContainer>
        Comments:
        <CommentsUL>
          {
            commentsList.map(item =>
              <CommentLI key={item.id}>
                <CommentOwner>
                  {
                    item.replyToUsername === null ? 
                    `User ${item.owner} commented:` : 
                    `User ${item.owner} replied to ${item.replyToUsername}`
                  }
                  {
                    idState === item.ownerId ?
                    <Button 
                      deleteComment
                      onClick={() => handleDeleteComment(item.id)}
                    >Delete</Button> :
                    ''
                  }
                </CommentOwner>
                <CommentText>
                  {item.text}
                </CommentText>
                  {idState !== item.ownerId && item.ownerId !== null && !isTokenChecking && isAuthorized ?
                <Button onClick={() => handleReplyOn(item.ownerId, item.owner)}>Reply</Button> : ''
              }
              </CommentLI>
            )
          }
        </CommentsUL>
        <div>
        {data!.reply ? 
          <ReplyAlert>
            <ReplyAlertInner>Replying to {data!.replyTarget}</ReplyAlertInner>
            <Button user onClick={handleReplyOff}>Cancel</Button>
          </ReplyAlert> :
          <ReplyAlert></ReplyAlert>
        }
        {!isTokenChecking && isAuthorized ?
          <CommentsForm onSubmit={handleSubmitComment}>
            <CommentTextArea ref={myRef} placeholder="Your comment..." type="text" onChange={handleChangeComment} value={data!.comment}/>
            <Button primary type="submit">Send comment</Button>
          </CommentsForm> : ''
        }
        </div>
        {role === 'Admin' ?
          <Button
            onClick={handleDelete}
          >Delete this book</Button> :
          ''
        }
      </CommentsContainer>
    </div>
  )
}

export default BookCard