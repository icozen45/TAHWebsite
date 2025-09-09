'use client'

import { useState } from 'react'
import { Button } from '@/app/components/ui/button'
import { showCustomToast } from '@/app/components/ui/customToast'

export default function DeleteBlogPage() {
  const [blogId, setBlogId] = useState('')
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    if (!blogId) return
    setLoading(true)

    try {
      const res = await fetch(`/api/blogs/${blogId}`, { method: 'DELETE' })

      if (!res.ok) throw new Error('Delete failed')

      showCustomToast('Deleted!', 'Blog successfully deleted.')
      setBlogId('')
    } catch (err) {
      console.error(err)
      showCustomToast('Failed to delete', 'Blog may not exist.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-semibold text-gray-700">Delete Blog</h1>

      <input
        placeholder="Enter blog ID"
        value={blogId}
        onChange={(e) => setBlogId(e.target.value)}
        className="w-full border border-gray-300 rounded px-4 py-2 text-gray-600"
      />

      <Button onClick={handleDelete} disabled={loading}>
        {loading ? 'Deleting...' : 'Delete Blog'}
      </Button>
    </div>
  )
}
