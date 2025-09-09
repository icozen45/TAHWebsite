'use client'

import { useState } from "react"
import { Review } from "@/app/types"

type Props = {
  onReviewAdded?: () => void | Promise<void>
}

export default function ReviewForm({ onReviewAdded }: Props) {
  const [name, setName] = useState("")
  const [comment, setComment] = useState("")
  const [rating, setRating] = useState<number>(5)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    if (!name.trim() || !comment.trim() || isNaN(rating) || rating < 1 || rating > 5) {
      setError("Please fill out all fields correctly.")
      return
    }

    const res = await fetch("/api/reviews", {
      method: "POST",
      body: JSON.stringify({ name, comment, rating }),
    })

    if (!res.ok) {
      const text = await res.text()
      setError(`Submission failed: ${text}`)
      return
    }

    setSuccess("Review submitted!")
    setName("")
    setComment("")
    setRating(5)

    // ✅ Call the parent refresh function
    if (onReviewAdded) await onReviewAdded()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-lg mx-auto px-6 py-8 bg-white rounded-xl shadow-md">
      <h2 className="text-xl font-semibold mb-2 text-gray-600">Leave a Review</h2>

      <input
        type="text"
        placeholder="Your name"
        value={name}
        onChange={e => setName(e.target.value)}
        className="w-full border rounded-lg px-3 py-2"
      />

      <textarea
        placeholder="Your comment"
        value={comment}
        onChange={e => setComment(e.target.value)}
        className="w-full border rounded-lg px-3 py-2"
      />

      <select
        value={rating}
        onChange={e => {
          const val = parseInt(e.target.value)
          if (!isNaN(val)) setRating(val)
        }}
        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-gray-500"
      >
        <option value={5} className="text-gray-600">5 - Excellent</option>
        <option value={4} className="text-gray-600">4 - Good</option>
        <option value={3} className="text-gray-600">3 - Average</option>
        <option value={2} className="text-gray-600">2 - Poor</option>
        <option value={1} className="text-gray-600">1 - Terrible</option>
      </select>

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
      >
        Submit
      </button>
    
      {error && <p className="text-red-600 mt-2">{error}</p>}
      {success && <p className="text-green-600 mt-2">{success}</p>}
    </form>
  )
}
