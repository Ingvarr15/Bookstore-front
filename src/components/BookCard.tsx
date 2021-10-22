import { useEffect, useState } from "react"
import { useHistory, useLocation } from "react-router-dom"
import { deleteBookReq } from "../api/deleteBookReq"
import { deleteCommentReq } from "../api/deleteCommentReq"
import { getOneBookReq } from "../api/getOneBookReq"
import { postCommentReq } from "../api/postCommentReq"
import { setRatingReq } from "../api/setRatingReq"
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


const BookCard = ({item}: any) => {
  const dispatch = useAppDispatch()
  const booksList = useAppSelector(state => state.books.items)
  const commentsList = useAppSelector(state => state.comments.items)
  const commentTextState = useAppSelector(state => state.comments.text)
  const bookId = useAppSelector(state => state.comments.bookId)
  const isCommentsLoading = useAppSelector(state => state.comments.isCommentsLoading)
  const lastSendingRes = useAppSelector(state => state.comments.lastSendingRes)
  const idState = useAppSelector(state => state.user.id)
  const isAuthorized = useAppSelector(state => state.user.isAuthorized)
  const isTokenChecking = useAppSelector(state => state.user.isTokenChecking)
  const userRatingsState = useAppSelector(state => state.user.ratings)
  const location = useLocation()
  const history = useHistory()
  const [comment, setComment] = useState('')
  const [reply, setReply] = useState(false)
  const [replyTarget, setReplyTarget] = useState('')
  const [targetId, setTargetId] = useState('')
  const [photo, setPhoto] = useState(1)
  const [rating, setRating] = useState(0)
  const [radio, setRadio] = useState(0)
  const [goldStars, setGoldStars] = useState(0)
  const [userRating, setUserRating] = useState(0)
  const [isMainTab, setIsMainTab] = useState(true);

  useEffect(() => {
    if (item === undefined) {
      item = getItem()
    }
  }, [])

  useEffect(() => {
    setGoldStars(item.rating / 0.05)
    setUserRating(calculateUserRating())
  }, [booksList, userRatingsState])

  const calculateUserRating = () => {
    const userRating = userRatingsState.find((rating: any) => rating.book === item.id)
    if (userRating !== undefined) {
      return userRating.rating / 0.05
    } else {
      return 0
    }
  }

  const getItem = async () => {
    const res = await getOneBookReq(location.pathname.split('/book/')[1])
    return res
  }

  useEffect(() => {
    dispatch(setBookId(item.id))
  }, [])

  useEffect(() => {
    if (commentTextState !== '') {
      dispatch(postComment())
    } else if (commentTextState === '') {
      handleReplyOff()
    }
  }, [commentTextState])

  useEffect(() => {
    socket.on('newComment', () => {
      dispatch(fetchComments())
    })
  }, [socket])

  useEffect(() => {
    dispatch(fetchComments())
    dispatch(setText(''))
  }, [bookId])
  
  useEffect(() => {
    dispatch(setChapter(location.pathname))
    dispatch(fetchUser())
  }, [])
  
  const role = useAppSelector(state => state.user.role)

  const handleDelete = async () => {
    const res = await deleteBookReq(item.id)
    if (res.status === 204) {
      history.push('/')
    }
  }

  const handleChangeComment = (e: any) => {
    setComment(e.currentTarget.value)
  }

  const handleSubmitComment = (e: any) => {
    e.preventDefault()
    dispatch(setText(comment))
    socket.emit('comment', comment)
    setComment('')
  }

  const handleReplyOn = (ownerId: any, owner: any) => {
    if (!reply) {
      setReply(true)
      setReplyTarget(owner)
      setTargetId(ownerId)
      dispatch(setReplyTo(ownerId))
    } else if (reply) {
      setReply(false)
      setReplyTarget('')
      setTargetId('')
      dispatch(setReplyTo(''))
    }
  }

  const handleReplyOff = () => {
    if (reply) {
      setReply(false)
      setReplyTarget('')
      setTargetId('')
      dispatch(setReplyTo(''))
    }
  }

  const handleChangePhoto = (img: number) => {
    setPhoto(img)
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
    setUserRating(e.currentTarget.dataset.percent)
  }

  const handleLeaveMouse = () => {
    setUserRating(calculateUserRating())
  }

  const handleChangeTab = (bool: boolean) => {
    setIsMainTab(bool)
  }
 
  return (
    <div>
      <BookContainer>
        <BookImages>
          <MainImg>
            { photo === 1 ? <BookImg src={item.img}/> :
              photo === 2 && item.img !== null ? <BookImg src={item.img2}/>
              : ''
            }
          </MainImg>
          <PreviewContainer>
            <Preview
              src={item.img} 
              active={photo === 1 ? true : false}
              onClick={() => handleChangePhoto(1)}
            />
            { item.img2 !== null ? 
            <Preview 
              src={item.img2} 
              active={photo === 2 ? true : false}
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
                current={isMainTab ? true : false}
                onClick={() => handleChangeTab(true)}
              >Main</Tab>
              <Tab 
                current={!isMainTab ? true : false}
                onClick={() => handleChangeTab(false)}
              >About book</Tab>
            </BookTabs>
            { isMainTab ? 
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
                        style={{width: `${goldStars}%`}} 
                        id="rating-active"
                      ></RatingActive>
                      <RatingOfUser
                        style={{width: `${userRating}%`}}            
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
        {reply ? 
          <ReplyAlert>
            <ReplyAlertInner>Replying to {replyTarget}</ReplyAlertInner>
            <Button user onClick={handleReplyOff}>Cancel</Button>
          </ReplyAlert> :
          <ReplyAlert></ReplyAlert>
        }
        {!isTokenChecking && isAuthorized ?
          <CommentsForm onSubmit={handleSubmitComment}>
            <CommentTextArea placeholder="Your comment..." type="text" onChange={handleChangeComment} value={comment}/>
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