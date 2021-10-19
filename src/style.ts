import styled, { createGlobalStyle } from 'styled-components'
import { Link } from 'react-router-dom'

export const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap');
  body {
    box-sizing: border-box;
    font-family: 'Roboto', sans-serif;
  }
  ul {
    padding: 0;
  }
` 

export const Logo = styled.span<any>`
  color: #ffffff;
  font-size: 24px;
  font-weight: 700;
  text-transform: uppercase;
  user-select: none;
`

export const MainContainer = styled.div<any>`
  margin-top: 80px;
`

export const Container = styled.div<any>`
  max-width: 1600px;
  padding: 0 20px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  ${props => props.user && `
    position: relative;
    align-items: flex-start;
    flex-direction: row;
    justify-content: start;
  `}
`

export const UserHelper = styled.div<any>`
  display: none;
  position: absolute;
  bottom: 50px;
  right: 50px;
  z-index: 1000;
  padding: 10px;
  border: 2px solid #3f8f38;
  border-radius: 3px;
  background: #e7ffe6;
  color: #3f8f38;
  font-weight: 700;
  ${props => props.shown && `
    display: block;
  `}
`

export const UserChangeForm = styled.form<any>`
  margin-top: 75px;
  margin-left: 50px;
  border: 2px solid #cc4147;
  border-radius: 3px;
  padding: 10px;
`

export const InputChange = styled.input<any>`
  font-size: 16px;
  padding: 5px 5px;
  border: 2px solid #cc4147;
  border-radius: 3px;
  outline: none;
`

export const ErrorAlert = styled.div<any>`
  max-width: 200px;
  min-height: 20px;
  margin: 10px 0;
  color: #cc4147;
  font-size: 12px;
  font-weight: 700;
  word-break: break-all;
`

export const ChangeButtons = styled.div<any>`
  padding: 5px;
`

export const NavBar = styled.nav<any>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: linear-gradient(0deg, rgba(139,45,45,1) 0%, rgba(204,65,71,1) 100%);
  box-shadow: 0 0 10px rgba(0,0,0,0.5);
  user-select: none;
`

export const NavUL = styled.ul<any>`
  position: relative;
  display: flex;
  justify-content: flex-end;
  padding: 10px 5px;
  list-style: none;
  color: #ffffff
`

export const NavLink = styled(Link)<any>`
  text-decoration: none;
  color: #ffffff;
  padding: 27px 15px;
  font-weight: 700;
  cursor: pointer;
  &:hover {
    background: #742525;
  }
  transition: all 0.2s linear;
  ${props => props.reply && `
    &:hover {
      background: 0;
    }
  `}
`

export const NavListItem = styled.li<any>`
  padding: 0 0;
`

export const Replies = styled.div<any>`
  position: absolute;
  top: 54px;
  right: 145px;
  background: linear-gradient(0deg, rgba(139,45,45,1) 0%, rgba(204,65,71,1) 100%);
  border-radius: 3px;
`

export const ReplyLogo = styled.span<any>`
  padding: 27px 15px;
  margin: 0;
  cursor: pointer;
  font-weight: 700;
  transition: all 0.2s linear;
  &:hover {
    background: #742525;
  }
`

export const ReplyUL = styled.ul<any>`
  padding-left: 0;
  list-style: none;
  cursor: pointer;
`

export const ReplyItem = styled.li<any>`
  min-width: 280px;
  padding: 5px 8px;
  text-align: center;
  transition: all 0.2s linear;
`
export const ReplyInner = styled.span<any>`
  padding: 23px 11px;
  transition: all 0.2s linear;
  &:hover {
    background: #742525;
  }
`

export const Button = styled.button<any>`
  
  font-size: 16px;
  background: transparent;
  font-family: 'Roboto', sans-serif;
  color: #af2f35;
  cursor: pointer;
  border: 2px solid #cc4147;
  border-radius: 3px;
  transition: all 0.2s linear;
  &:hover {
    color: #ffffff;
    background: #cc4147;
  }
  ${props => props.primary && `
    background: #cc4147;
    color: #ffffff;
    &:hover {
      background: #ffffff;
      color: #af2f35;
    }
  `}
  ${props => props.search && `
    margin-left: 5px;
  `}
  ${props => props.user && `
    margin-left: 5px;
  `}
  ${props => props.sign && `
    margin-top: 30px;
  `}
  ${props => props.deleteComment && `
    padding: 5px 5px;
    font-size: 12px;
    border-width: 1px;
  `}
`

export const BooksContainer = styled.div<any>`
    max-width: 1600px;
    margin: 0 auto;
`

export const SearchContainer = styled.div<any>`
  padding: 0 20px;
  display: flex;
  position: relative;
  &:after {
    content: "";
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 98vw;
    height: 1px;
    background: #cc4147;
    opacity: 0.4;
  }
`

export const SearchElem = styled.div<any>`
  min-width: 150px;
  padding: 0 30px;
  border-right: 1px solid #cc4147;
  &:first-child {
    padding-left: 0;
  }
  &:last-child {
    padding-right: 0;
    border: 0;
  }
`

export const SearchSelect = styled.select<any>`
  padding: 5px 5px;
  margin-right: 5px;
  overflow: hidden;
  cursor: pointer;
  width: 120px;
  font-family: 'Roboto', sans-serif;
  outline: none;
	border: 2px solid #cc4147;
  border-radius: 3px;
  text-transform: uppercase;
  background: #ffffff;
  ${props => props.genre && `
    margin-left: 60px
  `}
`

export const SearchForm = styled.form<any>`
  margin-top: 10px;
`

export const SearchInput = styled.input<any>`
  width: 40px;
  font-size: 16px;
  padding: 5px 5px;
  border: 2px solid #cc4147;
  border-radius: 3px;
  ${props => props.author && `
    width: 194px;
  `}
`

export const BookUL = styled.ul<any>`
  margin-top: 40px;
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
`

export const BookLink = styled(Link)<any>`
  display: flex;
  padding-right: 15px;
  justify-content: space-between;
  align-items: center;
  text-decoration: none;
  color: #000000
`

export const BookLI = styled.li<any>`
  margin-right: 20px;
  margin-top: 20px;
  flex-basis: 30%;
  width: 30%;
  border: 1px solid rgba(204, 65, 71, 0.4);;
  border-radius: 3px;
  transition: box-shadow 0.15s linear;
  &:nth-child(3n) {
    margin-right: 0;
  }
  &:hover {
    box-shadow: 0px 0px 20px 2px rgba(34, 60, 80, 0.22);
  }
`

export const BookInner = styled.div<any>`
  ${props => props.price && `
    font-size: 32px;
  `}
`

export const BookPropName = styled.span<any>`
  font-weight: 700;
`

export const BookDescription = styled.div<any>`
  width: 200px;
  padding-left: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`
export const UpperSection = styled.div<any>`

`
export const LowerSection = styled.div<any>`
  margin-bottom: 10px;
  display: flex;
  justify-content: flex-end;
`

export const Footer = styled.footer<any>`
  margin-top: 50px;
`

export const PagesUL = styled.ul<any>`
  display: flex;
  justify-content: center;
  list-style: none;
`

export const PagesLI = styled.li<any>`
  padding: 5px;
  border: 1px solid rgba(204, 65, 71, 0.4);
  border-radius: 3px;
  cursor: pointer;
  &:not(:last-child) {
    margin-right: 5px;
  }
  ${props => props.active && `
    background: rgba(204, 65, 71, 0.4);
  `}
`

export const Preview = styled.img<any>`
  max-width: 50px;
  cursor: pointer;
  &:first-child {
    margin-right: 5px;
  }
  ${props => props.active && `
    border: 2px solid #cc4147;
    border-radius: 3px;
  `}
`

export const PreviewContainer = styled.div<any>`
  min-height: 60px;
`

export const BookImg = styled.img<any>`
  max-height: 450px;
  max-width: 570px;
`

export const MainImg = styled.div<any>`
  height: 500px;
`

export const BookImages = styled.div<any>`
  margin-right: 50px;
`

export const BookCardImage = styled.img<any>`
  max-width: 40%;
  height: 40%;
`

export const BookInfo = styled.div<any>`
  min-width: 400px;
`

export const BookContainer = styled.div<any>`
  display: flex;
  justify-content: center;
`

export const CommentTextArea = styled.textarea<any>`
  width: 375px;
  height: 50px;
  margin-right: 3px;
  font-size: 16px;
  padding: 5px 5px;
  border: 2px solid #cc4147;
  border-radius: 3px;
  resize: none;
`

export const CommentLI = styled.li<any>`
  width: 500px;
  min-height: 20px;
  padding: 5px 5px;
  border: 1px solid rgba(204, 65, 71, 0.4);
  border-radius: 3px;
  word-break: break-all;
  &:not(:last-child) {
    margin-bottom: 5px;
  }
`

export const CommentsUL = styled.ul<any>`
  list-style: none;
`

export const CommentsContainer = styled.div<any>`
  margin-bottom: 150px;
  display: flex;
  flex-direction: column;
  align-items: center;
`

export const CommentOwner = styled.div<any>`
  display: flex;
  justify-content: space-between;
  padding-bottom: 10px;
  position: relative;
  font-weight: 700;
  color: rgb(139 45 45);
  &:after {
    content: "";
    position: absolute;
    bottom: 5px;
    left: 0;
    width: 95%;
    height: 1px;
    background: #cc4147;
    opacity: 0.4;
  }
`

export const SignForm = styled.form<any>`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translateY(-50%) translateX(-50%);
  padding: 60px 80px 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 2px solid #cc4147;
`

export const CommentText = styled.div<any>`
  min-height: 50px;
  margin-bottom: 10px;
`

export const CommentsForm = styled.form<any>`
  display: flex;
  margin-bottom: 40px;
`

export const ReplyAlert = styled.div<any>`
  align-self: ;
  min-height: 33px
`

export const UserProp = styled.p<any>`
  font-weight: 700;
`

export const InputSign = styled.input<any>`
  width: 300px;
  height: 30px;
  margin-bottom: 10px;
  border: 2px solid #cc4147;
  border-radius: 3px;
  font-size: 16px;
  ${props => props.date && `
    width: 150px;
  `}
`

export const SignHeading = styled.h2<any>`

`

export const SignError = styled.div<any>`
  margin-top: 30px;
  min-height: 20px;
  color: #cc4147;
  font-weight: 700;
`

export const AdminFormContainer = styled.form<any>`
  display: flex;
  flex-direction: column;
  padding: 10px;
  margin-top: 75px;
  margin-left: 50px;
  border: 2px solid #cc4147;
  border-radius: 3px;
`

export const AdminInput = styled.input<any>`
  font-size: 16px;
  margin-bottom: 10px;
  padding: 5px 5px;
  border: 2px solid #cc4147;
  border-radius: 3px;
  outline: none;
`

export const AdminCardHeading = styled.h2<any>`
  margin: 5px auto 20px;
`

export const AdminCardDescription = styled.textarea<any>`
  height: 100px;
  resize: none;
  font-size: 12px;
  margin-bottom: 10px;
  padding: 5px 5px;
  border: 2px solid #cc4147;
  border-radius: 3px;
  outline: none;
`

export const BookProp = styled.p<any>`
  margin-top: 0;
  margin-bottom: 5px;
`

export const AdminCardSelect = styled.select<any>`
  font-size: 16px;
  margin-bottom: 10px;
  padding: 5px 5px;
  border: 2px solid #cc4147;
  border-radius: 3px;
  outline: none;
  background: transparent;
`

export const ReplyAlertInner = styled.span<any>`
  font-weight: 700;
  color: rgb(139 45 45);
`