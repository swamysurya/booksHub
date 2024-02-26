import {Component} from 'react'
import Cookies from 'js-cookie'
import Slider from 'react-slick'
import Loader from 'react-loader-spinner'
import {FaGoogle, FaTwitter, FaYoutube} from 'react-icons/fa'
import {RiInstagramFill} from 'react-icons/ri'
import Header from '../Header'
import './index.css'

const apiUrlConstants = {
  initial: 'INITIAL',
  loading: 'LOADING',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

const topRatedBookApiUrl = 'https://apis.ccbp.in/book-hub/top-rated-books'

const settings = {
  dots: false,
  infinite: false,
  speed: 500,
  slidesToShow: 4,
  slidesToScroll: 1,
  responsive: [
    {
      breakpoint: 2000,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 1,
      },
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1,
      },
    },
  ],
}

class Home extends Component {
  state = {
    apiUrlStatus: apiUrlConstants.initial,
    topRatedBooksObj: {},
  }

  handleFindBooks = () => {
    const {history} = this.props
    history.replace('/bookshelves')
  }

  getTopRatedBooks = async () => {
    this.setState({apiUrlStatus: apiUrlConstants.loading})
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(topRatedBookApiUrl, options)
    if (response.ok) {
      const data = await response.json()
      const updatedData = {
        books: data.books.map(eachBook => ({
          id: eachBook.id,
          authorName: eachBook.author_name,
          coverPic: eachBook.cover_pic,
          title: eachBook.title,
        })),
        total: data.total,
      }
      this.setState({
        topRatedBooksObj: updatedData,
        apiUrlStatus: apiUrlConstants.success,
      })
    } else {
      this.setState({apiUrlStatus: apiUrlConstants.failure})
    }
  }

  componentDidMount() {
    this.getTopRatedBooks()
  }

  handleTryAgain = () => {
    console.log('handle trygain')
    this.getTopRatedBooks()
  }

  renderSlider = () => {
    const {topRatedBooksObj} = this.state
    const {books} = topRatedBooksObj

    return (
      <Slider {...settings}>
        {books.map(eachBook => {
          const {id, authorName, coverPic, title} = eachBook
          return (
            <div className="slick-item" key={id}>
              <img className="logo-image" src={coverPic} alt="company logo" />
              <h1 className="slick-author-name">{title}</h1>
              <p className="slick-title">{authorName}</p>
            </div>
          )
        })}
      </Slider>
    )
  }

  renderLoadingView = () => (
    <div className="loader-container" testid="loader">
      <Loader type="TailSpin" color="#0284C7" height={50} width={50} />
    </div>
  )

  renderSuccessView = () => (
    <>
      <h1 className="home-page-heading">Find Your Next Favorite Books?</h1>
      <p className="home-page-paragraph">
        You are in the right place. Tell us what titles or genres you have
        enjoyed in the past, and we will give you surprisingly insightful
        recommnedations.
      </p>
      <button
        className="find-books-btn find-books-btn1"
        onClick={this.handleFindBooks}
      >
        Find Books
      </button>

      <div className="slick-main-container">
        <div className="top-rated-books-and-btn-container">
          <h1 className="top-rated-books-heading">Top Rated Books</h1>
          <button
            className="find-books-btn find-boksbtn2"
            onClick={this.handleFindBooks}
          >
            Find Books
          </button>
        </div>
        <div className="slick-container">{this.renderSlider()}</div>
      </div>
      <div className="footer-icons">
        <FaGoogle />
        <FaTwitter />
        <RiInstagramFill />
        <FaYoutube />
      </div>
      <p className="contact-para">Contact Us</p>
    </>
  )

  rederFailureView = () => (
    <>
      <h1 className="home-page-heading">Find Your Next Favorite Books?</h1>
      <p className="home-page-paragraph">
        You are in the right place. Tell us what titles or genres you have
        enjoyed in the past, and we will give you surprisingly insightful
        recommnedations.
      </p>
      <button
        className="find-books-btn find-books-btn1"
        onClick={this.handleFindBooks}
      >
        Find Books
      </button>

      <div className="slick-main-container">
        <div className="top-rated-books-and-btn-container">
          <h1 className="top-rated-books-heading">Top Rated Books</h1>
          <button className="find-books-btn find-boksbtn2">Find Books</button>
        </div>
        <div className="failure-section">
          <img
            src="https://res.cloudinary.com/davv8r8v4/image/upload/v1708885227/bookhub%20assets/home/vzcccjrrhwmzoe7yanpg.png"
            alt="failure view"
            className="failure-view-image"
          />
          <p className="failure-message">
            Something went wrong. Please try again
          </p>
          <button className="tryagain-btn" onClick={this.handleTryAgain}>
            Try Again
          </button>
        </div>
      </div>
    </>
  )

  renderView = () => {
    const {apiUrlStatus} = this.state
    // const apiUrlStatus1 = apiUrlConstants.failure
    switch (apiUrlStatus) {
      case apiUrlConstants.loading:
        return this.renderLoadingView()
      case apiUrlConstants.success:
        return this.renderSuccessView()
      case apiUrlConstants.failure:
        return this.rederFailureView()
      default:
        return null
    }
  }

  render() {
    const {topRatedBooksObj, apiUrlStatus} = this.state
    return (
      <div className="home-container">
        <Header />
        {this.renderView()}
      </div>
    )
  }
}

export default Home
