'use client'

import { useState } from 'react'

interface InputBoxProps {
  onSubmit: (name: string, comment: string) => void
}

export default function InputBox({ onSubmit }: InputBoxProps) {
  const [name, setName] = useState('')
  const [comment, setComment] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !comment.trim()) return alert('Please fill out both fields.')

    onSubmit(name, comment)
    setName('')
    setComment('')
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        placeholder="Your name"
        className="w-full border border-gray-300 rounded px-4 py-2"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <textarea
        placeholder="Your review"
        className="w-full border border-gray-300 rounded px-4 py-2 h-24 resize-none"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />
      <button
        type="submit"
        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded transition"
      >
        Submit Review
      </button>
    </form>
  )
}
