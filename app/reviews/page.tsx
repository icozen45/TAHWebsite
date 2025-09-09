'use client'

import { useEffect, useRef, useState } from 'react'
import { X, Star, StarHalf, Star as StarOutline, Upload } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { showCustomToast } from '../components/ui/customToast'

function SkeletonCard() {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm animate-pulse w-full max-w-3xl space-y-4">
      <div className="flex justify-between items-start">
        <div className="w-32 h-6 bg-gray-300 rounded" />
        <div className="flex gap-1">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="w-4 h-4 bg-gray-300 rounded" />
          ))}
        </div>
      </div>
      <div className="h-32 bg-gray-200 rounded w-full" />
      <div className="flex gap-2">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="w-24 h-24 bg-gray-200 rounded-md" />
        ))}
      </div>
    </div>
  )
}

type Review = {
  id: string
  title: string
  content: string
  rating: number
  images: string[]
}

export default function ReviewsPage() {
  const [showForm, setShowForm] = useState(false)
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [rating, setRating] = useState('')
  const [images, setImages] = useState<File[]>([])
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const formRef = useRef(null)

  const perPage = 8
  const totalPages = Math.ceil(reviews.length / perPage)
  const current = reviews.slice((page - 1) * perPage, page * perPage)

  useEffect(() => {
    fetch('/api/reviews')
      .then((res) => res.json())
      .then((data) => setReviews(data.reviews || []))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const renderStars = (rating: number) => {
    const full = Math.floor(rating)
    const half = rating - full >= 0.5
    const empty = 5 - full - (half ? 1 : 0)

    return (
      <div className="flex items-center text-yellow-500">
        {[...Array(full)].map((_, i) => (
          <Star key={'f' + i} size={16} />
        ))}
        {half && <StarHalf size={16} />}
        {[...Array(empty)].map((_, i) => (
          <StarOutline key={'o' + i} size={16} className="opacity-50" />
        ))}
      </div>
    )
  }

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      setImages((prev) => [...prev, ...Array.from(files)])
    }
  }

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index))
  }

  const handleClickOutside = (e: MouseEvent) => {
    if (formRef.current && !(formRef.current as any).contains(e.target)) {
      setShowForm(false)
    }
  }

  useEffect(() => {
    if (showForm) document.addEventListener('mousedown', handleClickOutside)
    else document.removeEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showForm])

  const handleSubmit = async () => {
    const newErrors: any = {}
    if (!title.trim()) newErrors.title = 'Title is required'
    if (!content.trim()) newErrors.content = 'Content is required'
    const num = parseFloat(rating)
    if (isNaN(num) || num < 0 || num > 5)
      newErrors.rating = 'Rating must be between 0 and 5'

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    try {
      const formData = new FormData()
      formData.append('title', title)
      formData.append('content', content)
      formData.append('rating', rating)
      images.forEach((img) => formData.append('images', img))

      const res = await fetch('/api/reviews/create', {
        method: 'POST',
        body: formData,
      })

      if (res.ok) {
        const { review } = await res.json()
        setReviews((prev) => [review, ...prev])
        showCustomToast('Thanks for submitting!')
        setShowForm(false)
        setTitle('')
        setContent('')
        setRating('')
        setImages([])
        setErrors({})
      } else {
        showCustomToast('Submission failed.')
      }
    } catch (err) {
      console.error('Submit error:', err)
      showCustomToast('Error while submitting.')
    }
  }

  return (
    <div className="pt-24 pb-12 max-w-3xl mx-auto px-4 sm:px-6">
      <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">People’s Reviews</h2>

      {loading ? (
        <div className="space-y-4">
          {Array(3)
            .fill(0)
            .map((_, i) => (
              <SkeletonCard key={i} />
            ))}
        </div>
      ) : (
        <>
          <div className="space-y-6">
            {current.map((r) => (
              <div key={r.id} className="bg-white p-4 rounded-xl shadow-md border border-gray-200 space-y-2 sm:space-y-3">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1">
                  <h3 className="text-lg font-semibold text-gray-800">{r.title}</h3>
                  {renderStars(r.rating)}
                </div>
                <p className="text-gray-600">{r.content}</p>
                {r.images?.length ? (
                  <div
                    className="flex gap-2 mt-3 overflow-x-auto max-w-full"
                    style={{ WebkitOverflowScrolling: 'touch' }}
                  >
                    {r.images.map((img, i) => (
                      <div key={i} className="h-20 w-20 rounded overflow-hidden flex-shrink-0">
                        <img src={img} alt={`review-img-${i}`} className="object-cover w-full h-full" />
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex flex-wrap justify-center items-center gap-2 mt-8">
              <button
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                disabled={page === 1}
                className="px-3 py-1 rounded-full bg-gray-200 disabled:opacity-50"
              >
                Prev
              </button>
              {Array(totalPages)
                .fill(0)
                .map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i + 1)}
                    className={`px-3 py-1 rounded-full ${
                      page === i + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              <button
                onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                disabled={page === totalPages}
                className="px-3 py-1 rounded-full bg-gray-200 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      <div className="mt-12 text-center">
        <button
          onClick={() => setShowForm(true)}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition"
        >
          Submit a Review
        </button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 overflow-y-auto px-3 py-8 flex items-start justify-center"
          >
            <motion.div
              ref={formRef}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl p-4 sm:p-6 w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-lg"
              role="dialog"
              aria-modal="true"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-800">Submit a Review</h3>
                <button
                  onClick={() => setShowForm(false)}
                  className="p-1 rounded-full hover:bg-gray-300 transition"
                  aria-label="Close form"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              <div className="space-y-4">
                {[
                  {
                    label: 'Title',
                    value: title,
                    onChange: (e: any) => setTitle(e.target.value),
                    error: errors.title,
                    type: 'input',
                    placeholder: 'e.g. Excellent service!',
                  },
                  {
                    label: 'Content',
                    value: content,
                    onChange: (e: any) => setContent(e.target.value),
                    error: errors.content,
                    type: 'textarea',
                    placeholder: 'Write your thoughts...',
                  },
                  {
                    label: 'Rating (0–5)',
                    value: rating,
                    onChange: (e: any) => setRating(e.target.value),
                    error: errors.rating,
                    type: 'input',
                    placeholder: 'e.g. 4.5',
                  },
                ].map((field, idx) => (
                  <div key={idx}>
                    <label className="text-sm text-gray-500">{field.label}</label>
                    {field.type === 'textarea' ? (
                      <textarea
                        value={field.value}
                        onChange={field.onChange}
                        placeholder={field.placeholder}
                        rows={4}
                        className="w-full mt-1 text-gray-800 bg-transparent py-1 px-1 border-b border-gray-300 focus:border-blue-500 focus:outline-none transition-colors duration-200"
                      />
                    ) : (
                      <input
                        value={field.value}
                        onChange={field.onChange}
                        placeholder={field.placeholder}
                        className="w-full mt-1 text-gray-800 bg-transparent py-1 px-1 border-b border-gray-300 focus:border-blue-500 focus:outline-none transition-colors duration-200"
                      />
                    )}
                    {field.error && <p className="text-sm text-red-500 mt-1">{field.error}</p>}
                  </div>
                ))}

                <div>
                  <label className="text-sm text-gray-500">Images</label>
                  <div className="flex items-center gap-2 mt-1">
                    <input
                      id="upload"
                      type="file"
                      accept="image/*"
                      multiple
                      hidden
                      onChange={handleImageSelect}
                    />
                    <label
                      htmlFor="upload"
                      className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition"
                    >
                      <Upload className="w-4 h-4" /> Choose Files
                    </label>
                  </div>

                  {images.length > 0 && (
                    <div
                      className="flex gap-2 mt-3 overflow-x-auto max-w-full"
                      style={{ WebkitOverflowScrolling: 'touch' }}
                    >
                      {images.map((img, i) => (
                        <div
                          key={i}
                          onDoubleClick={() => removeImage(i)}
                          className="relative w-20 h-20 rounded overflow-hidden border border-gray-300 cursor-pointer"
                        >
                          <img
                            src={URL.createObjectURL(img)}
                            alt="preview"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <button
                onClick={handleSubmit}
                className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded transition"
              >
                Submit
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
