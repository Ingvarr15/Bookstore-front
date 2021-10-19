import { useEffect, useState } from "react"
import { Redirect, useHistory, useLocation } from "react-router-dom"
import { deleteBookReq } from "../api/deleteBookReq"
import { getOneBookReq } from "../api/getOneBookReq"
import { postCommentReq } from "../api/postCommentReq"
import { fetchOneBook, setChapter } from "../redux/booksSlice"
import { fetchComments, setBookId, setText, postComment, setReplyTo } from "../redux/commentSlice"
import { useAppSelector, useAppDispatch } from "../redux/hooks"
import { fetchUser } from "../redux/userSlice"
import socket from "../socket"
import NotMatch from "./NotMatch"

const OneBookCard = () => {
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
  const isBookFound = useAppSelector(state => state.books.isBookFound)
  const location = useLocation()
  const history = useHistory()
  const [comment, setComment] = useState('')
  const [reply, setReply] = useState(false)
  const [replyTarget, setReplyTarget] = useState('')
  const [targetId, setTargetId] = useState('')

  let item = useAppSelector(state => state.books.oneBook)

  useEffect(() => {
    dispatch(fetchOneBook())
  }, [bookId])

  const getItem = async () => {
    const res = await dispatch(fetchOneBook())
    return res
  }

  useEffect(() => {
    dispatch(setBookId(+location.pathname.split('/book/')[1]))
  }, [])

  useEffect(() => {
    if (commentTextState !== '') {
      dispatch(postComment())
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
    if (reply) {

    }
  }

  const handleReplyOn = (ownerId: any, owner: any) => {
    if (!reply) {
      setReply(true)
      setReplyTarget(owner)
      setTargetId(ownerId)
      dispatch(setReplyTo(ownerId))
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
 
  return (
    <div>
      {isBookFound ? 
        <div>
          <img src={item ? item.img : ''}/>
      { item.img2 !== null ? 
        <img src={item.img2}/> :
        ''
      }      
      <h2>{item.name}</h2>
      <p>{item.description}</p>
      {role === 'Admin' ? 
        <button
          onClick={handleDelete}
        >Delete this book</button> :
        ''
      }
      Comments:
      <ul>
        {
          commentsList.map(item =>
            <li key={item.id}>
              {item.owner}: {item.text}
            {idState !== item.ownerId && item.ownerId !== null ?
              <button onClick={() => handleReplyOn(item.ownerId, item.owner)}>Reply</button> : ''
            }
            </li>
          )
        }
      </ul>
      {!isTokenChecking && isAuthorized ? 
            <form onSubmit={handleSubmitComment}>
              {reply ? `Replying to ${replyTarget}` : ''}
              {reply ? <button onClick={handleReplyOff}>[X]</button> : ''}
              <input type="text" onChange={handleChangeComment} value={comment}/>
              <button type="submit">Send comment</button>
            </form> : ''
            }
        </div> : <NotMatch/>
      }
      
    </div>
  )
}

export default OneBookCard