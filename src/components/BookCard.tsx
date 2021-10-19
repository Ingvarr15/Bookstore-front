import { useEffect, useState } from "react"
import { useHistory, useLocation } from "react-router-dom"
import { deleteBookReq } from "../api/deleteBookReq"
import { getOneBookReq } from "../api/getOneBookReq"
import { postCommentReq } from "../api/postCommentReq"
import { setChapter } from "../redux/booksSlice"
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
  ReplyAlert
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
  const location = useLocation()
  const history = useHistory()
  const [comment, setComment] = useState('')
  const [reply, setReply] = useState(false)
  const [replyTarget, setReplyTarget] = useState('')
  const [targetId, setTargetId] = useState('')
  const [photo, setPhoto] = useState(1)

  useEffect(() => {
    if (item === undefined) {
      item = getItem()
    }
  }, [])

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
            <BookInner>
              <BookPropName>Genre: </BookPropName> {item.genre}
            </BookInner>
            <BookInner>
              <BookPropName>Author: </BookPropName> {item.author}
            </BookInner>
            <BookInner>
              <BookPropName>Description: </BookPropName> {item.description}
            </BookInner>
            <BookInner>
              <BookPropName>Rating: </BookPropName> {item.rating}
            </BookInner>
        </BookInfo>
      </BookContainer>
      <CommentsContainer>
        Comments:
        <CommentsUL>
          {
            commentsList.map(item =>
              <CommentLI key={item.id}>
                <CommentOwner>
                  User {item.owner} commented:
                </CommentOwner>
                <CommentText>
                  {item.text}
                </CommentText>
                  {idState !== item.ownerId && item.ownerId !== null ?
                <Button onClick={() => handleReplyOn(item.ownerId, item.owner)}>Reply</Button> : ''
              }
              </CommentLI>
            )
          }
        </CommentsUL>
        {reply ? 
          <ReplyAlert>
            Replying to {replyTarget}
            <Button onClick={handleReplyOff}>Cancel</Button>
          </ReplyAlert> :
          <ReplyAlert></ReplyAlert>
        }
        {!isTokenChecking && isAuthorized ?
          <CommentsForm onSubmit={handleSubmitComment}>
            <CommentTextArea placeholder="Your comment..." type="text" onChange={handleChangeComment} value={comment}/>
            <Button primary type="submit">Send comment</Button>
          </CommentsForm> : ''
        }
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