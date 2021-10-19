import { prevPage, nextPage, setPage } from "../redux/booksSlice"
import { useAppDispatch, useAppSelector } from "../redux/hooks"
import {
	Footer,
	PagesUL,
	PagesLI
} from '../style'

const Pagination = () => {
  const totalItems = useAppSelector(state => state.books.totalItems)
  const page = useAppSelector(state => state.books.page)
  const dispatch = useAppDispatch()

  const pageNumber = []

  for (let i = 1; i <= Math.ceil(totalItems / 9); i++) {
		pageNumber.push(i);
	}

  let showStart
	let showEnd

  if (pageNumber.length > 9) {
		if (pageNumber.indexOf(page) > 2) {
			showStart = page - 3;
			showEnd = page + 2;
		} else {
			showStart = 0;
			showEnd = 9;
		}
	
		if (pageNumber.lastIndexOf(page) > pageNumber.length - 4) {
			showStart = pageNumber.length - 9;
			showEnd = pageNumber.length;
		}
	}

  return(
    <Footer>
				<PagesUL>
					{
						(page > 1) &&
						<PagesLI onClick={() => dispatch(prevPage())}>
							<span>{'<'}</span>
						</PagesLI>
					}
					{
						pageNumber.slice(showStart, showEnd).map(number => (
							<PagesLI active={number === +page ? true : false} key={number} onClick={() => dispatch(setPage(number))}>
								<span className={`${number === page ? 'page-link-active' : ''}`}
								>
									{number}
								</span>
							</PagesLI>
						))
					}
					{
						(page < pageNumber.length) &&
						<PagesLI onClick={() => dispatch(nextPage())}>
							<span>{'>'}</span>
						</PagesLI>
					}
				</PagesUL>
			</Footer>
  )

}

export default Pagination