import { useAppDispatch, useAppSelector } from "../redux/hooks"
import { changeOrder, changeSort, setBookSearch, setChapter, setPage } from '../redux/booksSlice'
import { useEffect, useState } from "react"
import Pagination from './Pagination'
import { useLocation } from 'react-router-dom';
import { resetComments } from "../redux/commentSlice";
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
  Container,
  RatingActive,
  RatingBody,
  GenresContainer
} from '../style'

const MainPage = () => {
  const dispatch = useAppDispatch()
  const location = useLocation()
  const booksList = useAppSelector(state => state.books.items)
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
  const [author, setAuthor] = useState('')
  const [genreArray, setGenreArray]: any[] = useState([]);

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
    setGenreArray(filterByState === 'genre' ? filterValueState : [])
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
          handleResetForm()
        }
        break
      case 'genreSearch':
        if (genreArray.length !== 0) {
          dispatch(setBookSearch({
            filterBy: 'genre',
            filterValue: genreArray,
            from: '',
            to: ''
          }))
        } else {
          handleResetForm()
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
          handleResetForm()
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
          handleResetForm()
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

  const handleChangeGenreArray = (e:any) => {
    const value = e.target.value
    const rawGenreArray: any[] = [...genreArray]

    if (!e.target.hasAttribute('checked')) {
      rawGenreArray.push(value)
    } else {
      rawGenreArray.splice((rawGenreArray.findIndex(item => item === value)), 1)
    }
    setGenreArray([...rawGenreArray])
  }

  useEffect(() => {
  }, [genreArray])
  
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
                <GenresContainer>
                  <span>
                    Classics
                    <input 
                      defaultChecked={genreArray.includes('Classics')} 
                      type="checkbox" 
                      value="Classics" 
                      onChange={handleChangeGenreArray}
                    />
                  </span>
                  <span>
                    Detective
                    <input 
                      defaultChecked={genreArray.includes('Detective')} 
                      type="checkbox" 
                      value="Detective" 
                      onChange={handleChangeGenreArray}
                    />
                  </span>
                  <span>
                    Fantasy
                    <input 
                      defaultChecked={genreArray.includes('Fantasy')} 
                      type="checkbox" 
                      value="Fantasy" 
                      onChange={handleChangeGenreArray}
                    />
                  </span>
                  <span>
                    Horror
                    <input 
                      defaultChecked={genreArray.includes('Horror')} 
                      type="checkbox" 
                      value="Horror" 
                      onChange={handleChangeGenreArray}
                    />
                  </span>
                  <span>
                    Science
                    <input 
                      defaultChecked={genreArray.includes('Science')} 
                      type="checkbox" 
                      value="Science" 
                      onChange={handleChangeGenreArray}
                    />
                  </span>
                </GenresContainer>
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
                        <BookPropName>Rating:
                          <RatingBody mainPage>
                            <RatingActive
                              mainPage
                              style={{width: `${item.rating / 0.05}%`}} 
                              id="rating-active"
                            ></RatingActive>
                          </RatingBody>
                          </BookPropName> {item.rating === null ? '-' : item.rating.toString().substring(0, 3)}
                      </BookInner>
                    </UpperSection>
                    <LowerSection>
                      <BookInner price>
                        ???{item.price}
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