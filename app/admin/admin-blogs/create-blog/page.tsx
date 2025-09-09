'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function CreateBlogPage() {
  const [title, setTitle] = useState('')
  const [summary, setSummary] = useState('')
  const [content, setContent] = useState('')
  const [tags, setTags] = useState('')
  const [date, setDate] = useState('')
  const [loading, setLoading] = useState(false)

  const router = useRouter()

  const wordCount = content.trim().split(/\s+/).filter(Boolean).length
  const contentTooShort = wordCount < 120

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (contentTooShort) return alert('Content must be at least 120 words.')

    setLoading(true)

    const res = await fetch('/api/blogs/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title,
        summary,
        content,
        tags,
        date: date || undefined,
      }),
    })

    setLoading(false)

    if (res.ok) {
      router.push('/admin/admin-blogs')
    } else {
      const err = await res.json()
      alert(err.error || 'Something went wrong.')
    }
  }

  return (
    <div className='flex'>
      <main className="max-w-5xl px-4 py-8 text-gray-700">
        <h1 className="text-3xl font-semibold mb-6">Create New Blog</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-4xl px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Summary</label>
            <textarea
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              required
              className="w-4xl px-3 py-2 border border-gray-300 rounded-md min-h-[80px] focus:outline-none focus:ring focus:ring-blue-200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Content</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              className="w-4xl px-3 py-2 border border-gray-300 rounded-md min-h-[180px] focus:outline-none focus:ring focus:ring-blue-200"
            />
            <p className={`text-sm mt-1 ${contentTooShort ? 'text-red-500' : 'text-gray-500'}`}>
              Word count: {wordCount} {contentTooShort && '(Minimum 120 words required)'}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Tags (comma-separated)</label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              required
              className="w-4xl px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Date (optional)</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-4xl px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
            />
          </div>

          <button
            type="submit"
            disabled={loading || contentTooShort}
            className={`px-5 py-2 rounded-md text-white transition ${
              loading || contentTooShort
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {loading ? 'Creating...' : 'Create Blog'}
          </button>
        </form>
      </main>
    </div>
  )
}
