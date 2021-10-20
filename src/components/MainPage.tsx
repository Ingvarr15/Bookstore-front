import { useAppDispatch, useAppSelector } from "../redux/hooks"
import { fetchBooks, changeOrder, changeSort, setBookSearch, setChapter, setPage } from '../redux/booksSlice'
import React, { useEffect, useState } from "react"
import Pagination from './Pagination'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  generatePath,
  Redirect,
  useHistory,
  useLocation
} from 'react-router-dom';
import { resetComments, setBookId } from "../redux/commentSlice";
import {
  SearchContainer, 
  SearchElem,
  SearchSelect,
  SearchForm,
  SearchInput,
  Button,
  BookUL,
  BookLink,
  BookLI,
  BookInner,
  BookPropName,
  BookDescription,
  UpperSection,
  LowerSection,
  BookCardImage,
  FromToContainer,
  SearchButtons,
  CurrentHeading,
  HeadingContainer,
  Container
} from '../style'

const MainPage = () => {
  const dispatch = useAppDispatch()
  const history = useHistory()
  const location = useLocation()
  const booksList = useAppSelector(state => state.books.items)
  const authorsList = useAppSelector(state => state.books.authors)
  const isBooksLoading = useAppSelector(state => state.books.isLoading)
  const orderState = useAppSelector(state => state.books.order)
  const sortState = useAppSelector(state => state.books.sortBy)
  const filterByState = useAppSelector(state => state.books.filterBy)
  const fromState = useAppSelector(state => state.books.from)
  const toState = useAppSelector(state => state.books.to)
  const filterValueState = useAppSelector(state => state.books.filterValue)
  const [order, setOrder] = useState(orderState)
  const [sort, setSort] = useState(sortState)
  const [search, setSearch] = useState(filterByState)
  const [priceFrom, setPriceFrom] = useState(filterByState === 'price' ? fromState : '')
  const [priceTo, setPriceTo] = useState(filterByState === 'price' ? toState : '')
  const [ratingFrom, setRatingFrom] = useState(filterByState === 'rating' ? fromState : '')
  const [ratingTo, setRatingTo] = useState(filterByState === 'rating' ? toState : '')
  const [genre, setGenre] = useState('')
  const [author, setAuthor] = useState('')

  useEffect(() => {
    dispatch(setChapter(location.pathname))
    dispatch(resetComments())
  }, [])

  useEffect(() => {
    setSort(sortState)
    setOrder(orderState)
    setSearch(filterByState)
    setPriceFrom(filterByState === 'price' ? fromState : '')
    setPriceTo(filterByState === 'price' ? toState : '')
    setRatingFrom(filterByState === 'rating' ? fromState : '')
    setRatingTo(filterByState === 'rating' ? toState : '')
    setAuthor(filterByState === 'author' ? filterValueState : '')
    setGenre(filterByState === 'genre' ? filterValueState : '')
  }, [filterByState, fromState, toState, filterValueState, sortState, orderState])

  useEffect(() => {
    dispatch(changeOrder(order))
  }, [order])

  useEffect(() => {
    dispatch(changeSort(sort))
  }, [sort])

  const handleChangeOrder = () => {
    setOrder(order === 'asc' ? 'desc' : 'asc')
  }

  const handleChangeSort = (e: any) => {
      switch (e.currentTarget.value) {
        case 'createdAt':
          setSort('createdAt')
          break
        case 'genre':
          setSort('genre')
          break
        case 'author':
          setSort('author')
          break
        case 'price':
          setSort('price')
          break
        case 'rating':
          setSort('rating')
          break
      }
    }

  const handleChangeSearchType = (e: any) => {
    setPriceFrom('')
    setPriceTo('')
    setRatingFrom('')
    setRatingTo('')
    setGenre('')
    setAuthor('')
    setSearch(e.currentTarget.value)
    if (!e.currentTarget.value) {
      dispatch(setBookSearch({
        filterBy: '',
        filterValue: '',
        from: '',
        to: ''
      }))
    }
  }

  const handleChangeSearchValue = (e: any) => {
    switch (e.currentTarget.id) {
      case 'priceFrom':
        setPriceFrom(e.currentTarget.value)
        break
      case 'priceTo':
        setPriceTo(e.currentTarget.value)
        break
      case 'ratingFrom':
        setRatingFrom(e.currentTarget.value)
        break
      case 'ratingTo':
        setRatingTo(e.currentTarget.value)
        break
      case 'genreSelect':
        setGenre(e.currentTarget.value)
        break
      case 'authorSelect':
        setAuthor(e.target.value)
        break
    }
  }

  const handleSubmitSearch = (e: any) => {
    e.preventDefault()
    dispatch(setPage(1))
    switch (e.target.id) {
      case 'priceSearch':
        if (priceFrom || priceTo) {
          dispatch(setBookSearch({
            filterBy: 'price',
            filterValue: '',
            from: priceFrom,
            to: priceTo
          }))
        } else {
          return
        }
        break
      case 'genreSearch':
        if (genre) {
          dispatch(setBookSearch({
            filterBy: 'genre',
            filterValue: genre,
            from: '',
            to: ''
          }))
        } else {
          return
        }
        break
      case 'authorSearch':
        if (author) {
          dispatch(setBookSearch({
            filterBy: 'author',
            filterValue: author,
            from: '',
            to: ''
          }))
        } else {
          return
        }
        break
      case 'ratingSearch':
        if (ratingFrom || ratingTo) {
          dispatch(setBookSearch({
            filterBy: 'rating',
            filterValue: '',
            from: ratingFrom,
            to: ratingTo
          }))
        } else {
          return
        }
        break
    }
  }

  const handleResetForm = () => {
    dispatch(setBookSearch({
      filterBy: '',
      filterValue: '',
      from: '',
      to: ''
    }))
    setSearch('')
  }
  
  return (
    <Container books>
      <HeadingContainer>
        <CurrentHeading>Main Page</CurrentHeading>
      </HeadingContainer>
      <SearchContainer>
        <SearchElem>
          <span>Order: </span>
          <Button
            primary
            formButton
            onClick={handleChangeOrder}
          >{order === 'asc' ? 'Descending' : 'Ascending'}</Button>
        </SearchElem>
        <SearchElem>
        <span>Sort by: </span>
          <SearchSelect onChange={handleChangeSort} value={sort}>
            <option value="createdAt">Added time</option>
            <option value="genre">Genre</option>
            <option value="author">Author</option>
            <option value="price">Price</option>
            <option value="rating">Rating</option>
          </SearchSelect>
        </SearchElem>
        <SearchElem>
          <span>Search: </span>
            <SearchSelect
              value={search}
              onChange={handleChangeSearchType}>
              <option value=""></option>
              <option
                value="price"
              >price</option>
              <option
                value="genre"
              >genre</option>
              <option
                value="author"
              >author</option>
              <option
                value="rating"
              >rating</option>
            </SearchSelect>
            { search === 'price' ?
              <SearchForm>
                <FromToContainer>
                  <SearchInput 
                    id="priceFrom"
                    type="number"
                    min="0"
                    value={priceFrom}
                    onChange={handleChangeSearchValue}
                  />
                  <span> - </span>
                  <SearchInput
                    id="priceTo"
                    type="number"
                    min="0"
                    value={priceTo}
                    onChange={handleChangeSearchValue}
                  />
                </FromToContainer>
                <SearchButtons>
                  <Button
                    id="priceSearch"
                    type="submit"
                    formButton
                    onClick={handleSubmitSearch}
                  >Search</Button>
                  <Button
                    primary
                    resetForm
                    formButton
                    onClick={handleResetForm}
                  >Reset form</Button>
                </SearchButtons>
              </SearchForm> :
              search === 'genre' ?
              <SearchForm>
                <SearchSelect genre id="genreSelect" onChange={handleChangeSearchValue} value={genre}>
                  <option value=""></option>
                  <option value="Classics">Classics</option>
                  <option value="Detective">Detective</option>
                  <option value="Fantasy">Fantasy</option>
                  <option value="Horror">Horror</option>
                  <option value="Science">Science</option>
                </SearchSelect>
                <SearchButtons>
                  <Button
                    id="genreSearch"
                    type="submit"
                    formButton
                    onClick={handleSubmitSearch}
                  >Search</Button>
                  <Button
                    primary
                    resetForm
                    formButton
                    onClick={handleResetForm}
                  >Reset form</Button>
                </SearchButtons>
              </SearchForm> :
              search === 'author' ?
              <SearchForm>
                <SearchInput author type="text" id="authorSelect" 
                  onChange={handleChangeSearchValue}
                  value={author}
                />
                <SearchButtons>
                  <Button
                    id="authorSearch"
                    type="submit"
                    formButton
                    onClick={handleSubmitSearch}
                  >Search</Button>
                  <Button
                    primary
                    resetForm
                    formButton
                    onClick={handleResetForm}
                  >Reset form</Button>
                </SearchButtons>
              </SearchForm> :
              search === 'rating' ?
              <SearchForm>
                <FromToContainer>
                  <SearchInput 
                    id="ratingFrom"
                    type="number"
                    min="0"
                    value={ratingFrom}
                    onChange={handleChangeSearchValue}
                  />
                  <span> - </span>
                  <SearchInput
                    id="ratingTo"
                    type="number"
                    min="0"
                    value={ratingTo}
                    onChange={handleChangeSearchValue}
                  />
                </FromToContainer>
                <SearchButtons>
                  <Button
                    id="ratingSearch"
                    type="submit"
                    formButton
                    onClick={handleSubmitSearch}
                  >Search</Button>
                  <Button
                    primary
                    resetForm
                    formButton
                    onClick={handleResetForm}
                  >Reset form</Button>
                </SearchButtons>
              </SearchForm> : ''
            }
          </SearchElem>
      </SearchContainer>
        <BookUL>
          {isBooksLoading ? <h1>Loading...</h1> :
            booksList.length === 0 ? <h2>Nothing found</h2> :
            booksList.map(item =>
              <BookLI key={item.id}>
                <BookLink to={`/book/${item.id}`}>
                  <BookCardImage src={item.img} />
                  <BookDescription>
                    <UpperSection>
                      <h3>{item.name}</h3>
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
                    </UpperSection>
                    <LowerSection>
                      <BookInner price>
                        €{item.price}
                      </BookInner>
                    </LowerSection>
                  </BookDescription>
                </BookLink>
              </BookLI>
            )
          }
        </BookUL>
        {!isBooksLoading ?
          <Pagination /> : ''
        }
    </Container>
  )
}

export default MainPage