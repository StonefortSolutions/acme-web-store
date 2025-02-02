import React, { useState, useEffect, Suspense } from "react"
import { deleteReview, fetchReviews } from "../../store"
import { useSelector, useDispatch } from "react-redux"
import ReactPaginate from "react-paginate"
import { ArrowBigLeftDashIcon, ArrowBigRightDashIcon } from "lucide-react"
import Rating from "../ui/Rating"
import { Link } from "react-router-dom"
import Spinner from "../Spinner"

function AdminReviewsPage() {
    const dispatch = useDispatch()
    const { reviews } = useSelector((state) => state.reviews)
    const [itemsPerPage, setItemsPerPage] = useState(24)
    const [selectedReview, setSelectedReview] = useState(null)
  const [selectedFilter, setSelectedFilter] = useState(null)
    const [itemOffset, setItemOffset] = useState(0)


  const endOffset = itemOffset + itemsPerPage

    useEffect(() => {
        dispatch(fetchReviews())
    }, [])
    const handlePageClick = (event) => {
      const newOffset = (event.selected * itemsPerPage) % reviews.length
        setItemOffset(newOffset)
        window.scrollTo(0, 0)
    }
    const handleDeleteClick = (review) => {
      dispatch(deleteReview(review.id));
  }
  const handleRatingFilterChange = (event) => {
    if (event.target.value === "All") {
      setSelectedFilter(null)
    }
    if (event.target.value === "☆") {
      setSelectedFilter(1);
    }
    if (event.target.value === "☆☆") {
      setSelectedFilter(2);
    }
    if (event.target.value === "☆☆☆") {
      setSelectedFilter(3);
    }
    if (event.target.value === "☆☆☆☆") {
      setSelectedFilter(4);
    }
    if (event.target.value === "☆☆☆☆☆") {
      setSelectedFilter(5);
    }
  }

  const filteredReviers = selectedFilter ? reviews.filter((review) => review.rating === selectedFilter) : reviews

  const currentReviews = filteredReviers.length > 0 ? filteredReviers.slice(itemOffset, endOffset) : []
  const pageCount = Math.ceil(filteredReviers.length / itemsPerPage)


    return (
      <div className="p-2">
        <h1>Reviews</h1>
        <div className="flex flex-row justify-evenly">
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Rating</span>
            </label>
            <select
              className="select-bordered select w-full max-w-xs"
              onChange={handleRatingFilterChange}
              defaultValue="All"
            >
              <option>All</option>
              <option>☆</option>
              <option>☆☆</option>
              <option>☆☆☆</option>
              <option>☆☆☆☆</option>
              <option>☆☆☆☆☆</option>
            </select>
          </div>
          <div className="form-control w-full"></div>
        </div>

        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>User</th>
                <th>Product</th>
                <th>Rating</th>
                <th>Review</th>
              </tr>
            </thead>
            <tbody>
              {currentReviews.length > 0 ? (
                currentReviews.map((review) => {
                  return (
                    <tr
                      key={review.id}
                      className={`${
                        selectedReview &&
                        selectedReview.id === review.id &&
                        "bg-base-200"
                      }`}
                    >
                      <td>
                        <div className="flex items-center space-x-3">
                          <div className="avatar">
                            <div className="mask mask-squircle h-12 w-12">
                              <img
                                loading="lazy"
                                src={review.user.avatar}
                                alt={review.user.username}
                              />
                            </div>
                          </div>
                          <div>
                            <div className="font-bold">
                              {review.user.username}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <Link
                          className="link-primary link"
                          to={`/products/${review.productId}`}
                        >
                          {review.product.name}
                        </Link>
                      </td>
                      <td>
                        <Suspense fallback={<Spinner />}>
                          <Rating rating={review.rating} />
                        </Suspense>
                      </td>
                      <td>
                        <span className="w-4 text-ellipsis">
                          {review.description}
                        </span>
                      </td>
                      <th>
                        <div className="flex flex-row justify-evenly">
                          <button
                            className="btn-error btn-xs btn mx-1 px-1"
                            onClick={() => handleDeleteClick(review)}
                          >
                            delete
                          </button>
                        </div>
                      </th>
                    </tr>
                  )
                })
              ) : (
                <Spinner />
              )}
            </tbody>
          </table>
          <ReactPaginate
            breakLabel="..."
            nextLabel={<ArrowBigRightDashIcon size={24} alt="Next" />}
            onPageChange={handlePageClick}
            pageRangeDisplayed={5}
            pageCount={pageCount}
            previousLabel={<ArrowBigLeftDashIcon size={24} alt="Previous" />}
            renderOnZeroPageCount={null}
            className="join flex justify-center"
            activeClassName="join-item bg-base-200"
            pageClassName="btn-sm join-item text-lg"
            previousClassName="btn-sm join-item bg-base-300 hover:bg-base-200 flex items-center"
            nextClassName="btn-sm join-item bg-base-300 hover:bg-base-200 flex items-center"
          />
        </div>
      </div>
    )
}

export default AdminReviewsPage
