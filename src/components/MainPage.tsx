import { useAppDispatch, useAppSelector } from "../redux/hooks"
import { changeOrder, changeSort, setBookSearch, setChapter, setPage } from '../redux/booksSlice'
import { useEffect, useReducer } from "react"
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

  const initialState = {
    order: orderState,
    sort: sortState,
    search: filterByState,
    priceFrom: filterByState === 'price' ? fromState : '',
    priceTo: filterByState === 'price' ? toState : '',
    ratingFrom: filterByState === 'rating' ? fromState : '',
    ratingTo: filterByState === 'rating' ? toState : '',
    author: '',
    genreArray: []
  }

  function resetState() {
    return {...initialState}
  }
  
  function reducer(state: any, action: any) {
    switch (action.type) {
      case 'reset':
        return resetState()
      case 'sort':
        return {
          ...state,
          sort: action.payload
        }
      case 'order':
        return {
          ...state,
          order: action.payload
        }
      case 'search':
        return {
          ...state,
          search: action.payload
        }
      case 'priceFrom':
        return {
          ...state,
          priceFrom: action.payload
        }
      case 'priceTo':
        return {
          ...state,
          priceTo: action.payload
        }
      case 'ratingFrom':
        return {
          ...state,
          ratingFrom: action.payload
        }
      case 'ratingTo':
        return {
          ...state,
          ratingTo: action.payload
        }
      case 'author':
        return {
          ...state,
          author: action.payload
        }
      case 'genreArray':
        return {
          ...state,
          genreArray: action.payload
        }
    } 
  }

  const [data, localDispatch] = useReducer(reducer, initialState, resetState)

  useEffect(() => {
    dispatch(setChapter(location.pathname))
    dispatch(resetComments())
  }, [dispatch, location.pathname])

  useEffect(() => {
    localDispatch({ type: 'sort', payload: sortState })
    localDispatch({ type: 'order', payload: orderState })
    localDispatch({ type: 'search', payload: filterByState })
    localDispatch({ type: 'priceFrom', payload: filterByState === 'price' ? fromState : '' })
    localDispatch({ type: 'priceTo', payload: filterByState === 'price' ? toState : '' })
    localDispatch({ type: 'ratingFrom', payload: filterByState === 'rating' ? fromState : '' })
    localDispatch({ type: 'ratingTo', payload: filterByState === 'rating' ? toState : '' })
    localDispatch({ type: 'author', payload: filterByState === 'author' ? filterValueState : '' })
    localDispatch({ type: 'genreArray', payload: filterByState === 'genre' ? filterValueState : [] })
  }, [filterByState, fromState, toState, filterValueState, sortState, orderState])

  useEffect(() => {
    dispatch(changeOrder(data.order))
  }, [dispatch, data.order])

  useEffect(() => {
    dispatch(changeSort(data.sort))
  }, [dispatch, data.sort])

  const handleChangeOrder = () => {
    localDispatch({ type: 'order', payload: data.order === 'asc' ? 'desc' : 'asc' })
  }

  const handleChangeSort = (e: any) => {
      switch (e.currentTarget.value) {
        case 'createdAt':
          localDispatch({ type: 'sort', payload: 'createdAt' })
          break
        case 'genre':
          localDispatch({ type: 'sort', payload: 'genre' })
          break
        case 'author':
          localDispatch({ type: 'sort', payload: 'author' })
          break
        case 'price':
          localDispatch({ type: 'sort', payload: 'price' })
          break
        case 'rating':
          localDispatch({ type: 'sort', payload: 'rating' })
          break
      }
    }

  const handleChangeSearchType = (e: any) => {
    localDispatch({ type: 'search', payload: e.currentTarget.value })
    localDispatch({ type: 'priceFrom', payload: '' })
    localDispatch({ type: 'priceTo', payload: '' })
    localDispatch({ type: 'ratingFrom', payload: '' })
    localDispatch({ type: 'ratingTo', payload: '' })
    localDispatch({ type: 'author', payload: '' })
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
        localDispatch({ type: 'priceFrom', payload: e.currentTarget.value })
        break
      case 'priceTo':
        localDispatch({ type: 'priceTo', payload: e.currentTarget.value })
        break
      case 'ratingFrom':
        localDispatch({ type: 'ratingFrom', payload: e.currentTarget.value })
        break
      case 'ratingTo':
        localDispatch({ type: 'ratingTo', payload: e.currentTarget.value })
        break
      case 'authorSelect':
        localDispatch({ type: 'author', payload: e.target.value })
        break
    }
  }

  const handleSubmitSearch = (e: any) => {
    e.preventDefault()
    dispatch(setPage(1))
    switch (e.target.id) {
      case 'priceSearch':
        if (data.priceFrom || data.priceTo) {
          dispatch(setBookSearch({
            filterBy: 'price',
            filterValue: '',
            from: data.priceFrom,
            to: data.priceTo
          }))
        } else {
          handleResetForm()
        }
        break
      case 'genreSearch':
        if (data.genreArray.length !== 0) {
          dispatch(setBookSearch({
            filterBy: 'genre',
            filterValue: data.genreArray,
            from: '',
            to: ''
          }))
        } else {
          handleResetForm()
        }
        break
      case 'authorSearch':
        if (data.author) {
          dispatch(setBookSearch({
            filterBy: 'author',
            filterValue: data.author,
            from: '',
            to: ''
          }))
        } else {
          handleResetForm()
        }
        break
      case 'ratingSearch':
        if (data.ratingFrom || data.ratingTo) {
          dispatch(setBookSearch({
            filterBy: 'rating',
            filterValue: '',
            from: data.ratingFrom,
            to: data.ratingTo
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
    localDispatch({ type: 'search', payload: '' })
  }

  const handleChangeGenreArray = (e:any) => {
    const value = e.target.value
    const rawGenreArray: any[] = [...data.genreArray]

    if (!e.target.hasAttribute('checked')) {
      rawGenreArray.push(value)
    } else {
      rawGenreArray.splice((rawGenreArray.findIndex(item => item === value)), 1)
    }
    localDispatch({ type: 'genreArray', payload: [...rawGenreArray] })
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
          >{data.order === 'asc' ? 'Descending' : 'Ascending'}</Button>
        </SearchElem>
        <SearchElem>
        <span>Sort by: </span>
          <SearchSelect onChange={handleChangeSort} value={data.sort}>
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
              value={data.search}
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
            { data.search === 'price' ?
              <SearchForm>
                <FromToContainer>
                  <SearchInput 
                    id="priceFrom"
                    type="number"
                    min="0"
                    value={data.priceFrom}
                    onChange={handleChangeSearchValue}
                  />
                  <span> - </span>
                  <SearchInput
                    id="priceTo"
                    type="number"
                    min="0"
                    value={data.priceTo}
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
              data.search === 'genre' ?
              <SearchForm>
                <GenresContainer>
                  <span>
                    Classics
                    <input 
                      defaultChecked={data.genreArray.includes('Classics')} 
                      type="checkbox" 
                      value="Classics" 
                      onChange={handleChangeGenreArray}
                    />
                  </span>
                  <span>
                    Detective
                    <input 
                      defaultChecked={data.genreArray.includes('Detective')} 
                      type="checkbox" 
                      value="Detective" 
                      onChange={handleChangeGenreArray}
                    />
                  </span>
                  <span>
                    Fantasy
                    <input 
                      defaultChecked={data.genreArray.includes('Fantasy')} 
                      type="checkbox" 
                      value="Fantasy" 
                      onChange={handleChangeGenreArray}
                    />
                  </span>
                  <span>
                    Horror
                    <input 
                      defaultChecked={data.genreArray.includes('Horror')} 
                      type="checkbox" 
                      value="Horror" 
                      onChange={handleChangeGenreArray}
                    />
                  </span>
                  <span>
                    Science
                    <input 
                      defaultChecked={data.genreArray.includes('Science')} 
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
              data.search === 'author' ?
              <SearchForm>
                <SearchInput author type="text" id="authorSelect" 
                  onChange={handleChangeSearchValue}
                  value={data.author}
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
              data.search === 'rating' ?
              <SearchForm>
                <FromToContainer>
                  <SearchInput 
                    id="ratingFrom"
                    type="number"
                    min="0"
                    value={data.ratingFrom}
                    onChange={handleChangeSearchValue}
                  />
                  <span> - </span>
                  <SearchInput
                    id="ratingTo"
                    type="number"
                    min="0"
                    value={data.ratingTo}
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
                  <BookCardImage src={`http://localhost:8080/${item.img}`} />
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