'use client'

import { useState } from 'react'
import { Button } from '@/app/components/ui/button'
import { showCustomToast } from '@/app/components/ui/customToast'

export default function EditBlogPage() {
  const [blogId, setBlogId] = useState('')
  const [blog, setBlog] = useState<any | null>(null)
  const [loading, setLoading] = useState(false)

  const fetchBlog = async () => {
    if (!blogId) return

    setLoading(true)
    try {
      const res = await fetch(`/api/blogs/${blogId}`)
      if (!res.ok) throw new Error('Fetch failed')
      const data = await res.json()
      setBlog(data)
    } catch (err) {
      console.error(err)
      showCustomToast('Error', 'Could not fetch blog')
      setBlog(null)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!blog) return

    try {
      const res = await fetch(`/api/blogs/${blogId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(blog),
      })

      if (!res.ok) throw new Error('Save failed')
      showCustomToast('Blog Updated', 'Changes were saved.')
    } catch (err) {
      console.error(err)
      showCustomToast('Failed to save', 'Try again later.')
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-semibold text-gray-700">Edit Blog</h1>

      <div className="flex gap-2">
        <input
          placeholder="Enter blog ID"
          value={blogId}
          onChange={(e) => setBlogId(e.target.value)}
          className="border border-gray-300 rounded px-4 py-2 text-gray-600 w-full"
        />
        <Button onClick={fetchBlog} disabled={loading}>
          {loading ? 'Loading...' : 'Fetch'}
        </Button>
      </div>

      {blog && (
        <div className="space-y-4">
          <input
            value={blog.title}
            onChange={(e) => setBlog({ ...blog, title: e.target.value })}
            placeholder="Title"
            className="w-full border rounded px-4 py-2 text-gray-600"
          />
          <input
            value={blog.summary}
            onChange={(e) => setBlog({ ...blog, summary: e.target.value })}
            placeholder="Summary"
            className="w-full border rounded px-4 py-2 text-gray-600"
          />
          <textarea
            value={blog.content}
            onChange={(e) => setBlog({ ...blog, content: e.target.value })}
            placeholder="Content"
            className="w-full border rounded px-4 py-2 text-gray-600 h-32"
          />
          <input
            value={blog.tags}
            onChange={(e) => setBlog({ ...blog, tags: e.target.value })}
            placeholder="Tags (comma separated)"
            className="w-full border rounded px-4 py-2 text-gray-600"
          />
          <Button onClick={handleSave}>Save Changes</Button>
        </div>
      )}
    </div>
  )
}
