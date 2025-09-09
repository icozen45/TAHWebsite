'use client'

import { use } from 'react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import CustomTextarea from '@/app/components/ui/customTextArea'
import ValidatedRatingInput from '@/app/components/ui/ValidatedRatingInput'
import { showCustomToast } from '@/app/components/ui/customToast'

interface Review {
  id: string
  title: string
  content: string
  rating: number
  createdAt: string
}

interface Props {
  params: Promise<{ id: string }>
}

export default function ReviewDetailPage({ params }: Props) {
  const { id } = use(params)
  const router = useRouter()

  const [review, setReview] = useState<Review | null>(null)
  const [editMode, setEditMode] = useState(false)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [rating, setRating] = useState('')

  useEffect(() => {
    const fetchReview = async () => {
      try {
        const res = await fetch(`/api/reviews/${id}`)

        if (!res.ok) {
          showCustomToast(`Failed to load review: ${res.status}`, `Please try again.`)
          return
        }

        const text = await res.text()
        const data = text ? JSON.parse(text) : null

        if (!data) {
          showCustomToast('No review data returned')
          return
        }

        setReview(data)
        setTitle(data.title)
        setContent(data.content)
        setRating(data.rating.toString())
      } catch (err) {
        console.error('Fetch error:', err)
        showCustomToast('Unexpected error while loading review')
      }
    }

    fetchReview()
  }, [id])

  const handleSave = async () => {
    const numRating = parseFloat(rating)

    if (isNaN(numRating) || numRating < 0 || numRating > 5) {
      showCustomToast('Rating must be a number between 0.0 and 5.0')
      return
    }

    try {
      const res = await fetch(`/api/reviews/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          content,
          rating: numRating,
        }),
      })

      if (res.ok) {
        showCustomToast('Review updated successfully')
        setEditMode(false)
        router.refresh()
      } else {
        showCustomToast('Failed to update review', 'Please try again.')
      }
    } catch (err) {
      console.error('Update error:', err)
      showCustomToast('Unexpected error while updating review')
    }
  }

  if (!review) return <p>Loading...</p>

  return (
    <div className="max-w-3xl mx-auto py-10 px-4 space-y-6 text-gray-700">
      <h1 className="text-2xl font-semibold">Review titled: {review.title}</h1>
      <p className="text-sm text-gray-500">ID: {review.id}</p>
      <p className="text-sm text-gray-400">
        Created At: {new Date(review.createdAt).toLocaleString()}
      </p>

      <div className="space-y-4">
        <label className="block">
          <span className="font-medium">Title:</span>
          {editMode ? (
            <CustomTextarea
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              rows={2}
            />
          ) : (
            <p className="mt-1 whitespace-pre-wrap">{review.title}</p>
          )}
        </label>

        <label className="block">
          <span className="font-medium">Content:</span>
          {editMode ? (
            <CustomTextarea value={content} onChange={(e) => setContent(e.target.value)} />
          ) : (
            <p className="mt-1 whitespace-pre-wrap">{review.content}</p>
          )}
        </label>

        <label className="block">
          <span className="font-medium">Rating:</span>
          {editMode ? (
            <ValidatedRatingInput value={rating} onChange={setRating} />
          ) : (
            <p className="mt-1">{review.rating}/5</p>
          )}
        </label>

        {editMode ? (
          <div className="flex gap-4">
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              onClick={handleSave}
            >
              Save Changes
            </button>
            <button
              className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 transition"
              onClick={() => setEditMode(false)}
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
            onClick={() => setEditMode(true)}
          >
            Edit
          </button>
        )}
      </div>
    </div>
  )
}
