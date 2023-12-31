import React, { useEffect } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { FormCheck } from 'react-bootstrap'
import Product from '../components/Product'
import Message from '../components/Message'
import Loader from '../components/Loader'
import Paginate from '../components/Paginate'

import Meta from '../components/Meta'
import { listProducts } from '../actions/productActions'
import { useState } from 'react'

function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window
  return {
    width,
    height,
  }
}

const HomeScreen = ({ match }) => {
  const [verticalView, setVerticalView] = useState(true)
  const keyword = match.params.keyword

  const pageNumber = match.params.pageNumber || 1

  const dispatch = useDispatch()

  const history = useHistory()

  const productList = useSelector((state) => state.productList)
  const { loading, error, products, page, pages } = productList

  const [windowDimensions, setWindowDimensions] = useState(
    getWindowDimensions()
  )

  if (windowDimensions.width < 768 && !verticalView) {
    setVerticalView(true)
  }

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions())
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    dispatch(listProducts(keyword, pageNumber))
    if (userInfo && userInfo.isAdmin) {
      history.push('/admin/productlist')
    }
  }, [dispatch, keyword, pageNumber])

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  return (
    <>
      <Meta />
      {keyword && (
        <Link to='/' className='btn btn-light'>
          Go Back
        </Link>
      )}

      <div className='d-none d-lg-block d-xl-block'>
        <FormCheck
          type='switch'
          id='custom-switch'
          label='List View'
          onClick={(e) => setVerticalView(!e.target.checked)}
          checked={!verticalView}
        />
      </div>
      <hr />
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error}</Message>
      ) : (
        <>
          <div
            className={`d-flex flex-wrap ${
              !verticalView && 'align-items-center'
            }`}
            style={{ flexDirection: verticalView ? 'row' : 'column' }}
          >
            {products.map((product) => (
              <Product product={product} view={verticalView} />
            ))}
          </div>
          <Paginate
            pages={pages}
            page={page}
            keyword={keyword ? keyword : ''}
          />
        </>
      )}
    </>
  )
}

export default HomeScreen
