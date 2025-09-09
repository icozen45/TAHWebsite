'use client'

import { useEffect, useState } from 'react'
import { Eye, Pencil, Trash } from 'lucide-react'
import { useRouter } from 'next/navigation'
import ValidatedRatingInput from "@/app/components/ui/ValidatedRatingInput";
import Link from 'next/link'

interface Review {
  id: string
  name: string
  content: string
  rating: number
  createdAt: string
}

const REVIEWS_PER_PAGE = 8

export default function AdminReviewsPage() {
  const [allReviews, setAllReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [filterRating, setFilterRating] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const router = useRouter()

  useEffect(() => {
    async function fetchReviews() {
      const res = await fetch('/api/reviews')
      const data = await res.json()
      setAllReviews(data.reviews)
      setLoading(false)
    }
    fetchReviews()
  }, [])

  const handleDelete = async (id: string) => {
    const confirmed = confirm('Are you sure you want to delete this review?')
    if (!confirmed) return

    try {
      const res = await fetch(`/api/reviews/${id}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        setAllReviews(prev => prev.filter(r => r.id !== id))
      } else {
        console.error('Failed to delete review')
      }
    } catch (err) {
      console.error('Error deleting review:', err)
    }
  }

  const filteredReviews = allReviews.filter((review) => {
    if (!filterRating) return true
        const parsed = parseFloat(filterRating)
        const intPart = Math.floor(review.rating) // Get the first digit of rating

        // Match full rating OR integer part
        return !isNaN(parsed) && (
        review.rating === parsed || intPart.toString() === filterRating.trim()
        )
    })

  const totalPages = Math.ceil(filteredReviews.length / REVIEWS_PER_PAGE)
  const paginatedReviews = filteredReviews.slice(
    (currentPage - 1) * REVIEWS_PER_PAGE,
    currentPage * REVIEWS_PER_PAGE
  )

  if (loading) return <p>Loading reviews...</p>

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-4 text-gray-700">Admin: All Reviews</h1>

      <div className="w-full max-w-sm">
        <ValidatedRatingInput
          value={filterRating}
          onChange={(val) => {
            setFilterRating(val)
            setCurrentPage(1) // Reset to first page when filtering
          }}
          placeholder="Filter by rating (e.g. 4.5)"
          rows={1}
        />
      </div>

      {filteredReviews.length === 0 && (
        <p className="text-sm text-gray-500 mt-4">No reviews match this rating.</p>
      )}

      {paginatedReviews.map((review) => (
        <div
          key={review.id}
          className="border border-gray-200 text-gray-700 p-4 rounded-md shadow-sm hover:shadow-md transition-all"
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xl font-semibold">Review By: {review.name}</h3>
              <p className="text-md text-gray-600">{review.content}</p>
              <p className="text-sm text-gray-400 mt-1">Rating: {review.rating} ⭐</p>
              <p className="text-sm text-gray-400">Created: {new Date(review.createdAt).toLocaleDateString()}</p>
            </div>

            <div className="flex gap-3">
              <button onClick={() => router.push(`/admin/admin-reviews/${review.id}`)} title="View">
                <Eye className="w-5 h-5 text-blue-500 hover:text-blue-700" />
              </button>
              <button onClick={() => router.push(`/admin/admin-reviews/${review.id}?edit=true`)} title="Edit">
                <Link href={`/admin/admin-reviews/${review.id}?edit=true`}>
                    <Pencil className="w-5 h-5 text-green-500 hover:text-green-700" />
                </Link>
              </button>
              <button onClick={() => handleDelete(review.id)} title="Delete">
                <Trash className="w-5 h-5 text-red-500 hover:text-red-700" />
              </button>
            </div>
          </div>
        </div>
      ))}

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-8 flex-wrap">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
            <button
              key={pageNum}
              onClick={() => setCurrentPage(pageNum)}
              className={`px-3 py-1 rounded-md border text-sm font-medium transition-all duration-200 ${
                currentPage === pageNum
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-800 border-gray-300 hover:bg-gray-100'
              }`}
            >
              {pageNum}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
