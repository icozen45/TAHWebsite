'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Copy, Plus, Trash2, PencilLine, Check } from 'lucide-react'
import { motion } from 'framer-motion'

interface BlogPost {
  id: string
  title: string
  summary: string
}

export default function AdminBlogsPage() {
  const [blogs, setBlogs] = useState<BlogPost[]>([])
  const [copiedId, setCopiedId] = useState<string | null>(null)

  useEffect(() => {
    const fetchBlogs = async () => {
      const res = await fetch('/api/blogs')
      const data = await res.json()
      setBlogs(data)
    }

    fetchBlogs()
  }, [])

  const handleCopy = async (id: string) => {
    await navigator.clipboard.writeText(id)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 1500)
  }

  return (
    <main className="max-w-5xl mx-auto px-4 py-12 space-y-10">
      {/* Top Buttons */}
      <div className="flex flex-wrap gap-4 justify-start">
        <Link
          href="/admin/admin-blogs/create-blog"
          className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-medium px-5 py-2 rounded-md shadow transition"
        >
          <Plus size={18} /> Create Blog
        </Link>
        <Link
          href="/admin/admin-blogs/edit-blog"
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2 rounded-md shadow transition"
        >
          <PencilLine size={18} /> Edit Blog
        </Link>
        <Link
          href="/admin/admin-blogs/delete-blog"
          className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-medium px-5 py-2 rounded-md shadow transition"
        >
          <Trash2 size={18} /> Delete Blog
        </Link>
      </div>

      {/* Blog List */}
      <section>
        <h2 className="text-3xl font-semibold mb-6 text-gray-700">All Blog Posts</h2>

        {blogs.length === 0 ? (
          <p className="text-gray-500">No blogs found.</p>
        ) : (
          <div className="space-y-6">
            {blogs.map((blog, index) => (
              <motion.div
                key={blog.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white border border-gray-200 p-5 rounded-xl shadow-sm hover:shadow-md transition relative"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-1">{blog.title}</h3>
                <p className="text-gray-700 mb-3">{blog.summary}</p>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span>ID: {blog.id}</span>
                  <button
                    onClick={() => handleCopy(blog.id)}
                    className="ml-2 p-1 rounded hover:bg-gray-100"
                    title="Copy ID"
                  >
                    {copiedId === blog.id ? <Check size={16} className="text-green-600" /> : <Copy size={16} />}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}