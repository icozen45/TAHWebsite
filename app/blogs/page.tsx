'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { showCustomToast } from '@/app/components/ui/customToast';
import type { BlogPost } from '../types';

const POSTS_PER_PAGE = 8;

export default function BlogsPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [page, setPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [showDrawer, setShowDrawer] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/blogs');
        if (!res.ok) {
          const html = await res.text();
          console.error('Failed to fetch blogs. HTML error:', html);
          return;
        }
        const data = await res.json();
        setPosts(data);
      } catch (err) {
        console.error('Error fetching blog posts:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const parsedPosts = posts.map((post) => ({
    ...post,
    tags: post.tags ? post.tags.split(',').map((tag) => tag.trim()) : [],
  }));

  const filteredPosts = parsedPosts.filter((post) =>
    [post.title, post.summary, ...(post.tags || [])].some((field) =>
      field.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const paginatedPosts = filteredPosts.slice(
    page * POSTS_PER_PAGE,
    (page + 1) * POSTS_PER_PAGE
  );

  const hasNextPage = (page + 1) * POSTS_PER_PAGE < filteredPosts.length;

  const recentPosts = [...parsedPosts]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);

  return (
    <div className="flex flex-col min-h-screen pt-24 px-4 pb-8 items-center bg-gray-50">
      <main className="w-full max-w-6xl flex flex-col lg:flex-row gap-6">
        <section className="flex-1">
          <h1 className="text-3xl font-bold text-gray-800">Latest Insights</h1>
          <p className="text-lg text-gray-600 py-2">
            Check the latest insights and blogs.
          </p>

          <div className="text-xl font-semibold text-gray-700 mb-2">Search Blogs</div>
          <input
            type="text"
            placeholder="Search blogs..."
            className="mb-6 w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300 text-gray-700"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(0);
            }}
          />

          <h2 className="text-2xl font-bold text-gray-800 mb-6">All Blog Posts</h2>

          {loading ? (
            <p className="text-gray-500">Loading posts...</p>
          ) : filteredPosts.length === 0 ? (
            <p className="text-gray-500">Nothing found.</p>
          ) : (
            <div className="space-y-6">
              {paginatedPosts.map((post, index) => {
                const truncatedSummary =
                  isMobile && post.summary.length > 120
                    ? post.summary.slice(0, 120) + '...'
                    : post.summary;

                return (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <div className="p-6 rounded-xl border border-gray-200 hover:shadow-md bg-white group flex flex-col justify-between w-full">
                      <Link href={`/blogs/${post.id}`}>
                        <div>
                          <h3 className="text-2xl font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                            {post.title}
                          </h3>
                          <p className="text-sm text-gray-500">{post.date}</p>
                          <p className="mt-2 text-gray-700 line-clamp-3">
                            {truncatedSummary}
                          </p>

                          {post.tags.length > 0 && (
                            <div className="mt-3 flex flex-wrap gap-2">
                              {post.tags.map((tag) => (
                                <span
                                  key={tag}
                                  className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-medium"
                                >
                                  #{tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </Link>

                      <div className="mt-4 flex justify-end">
                        <span className="text-sm italic text-gray-500">
                          by Global Project Solutions
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}

          <div className="flex justify-between mt-10">
            {page > 0 ? (
              <button
                onClick={() => setPage((prev) => prev - 1)}
                className="text-blue-600 font-medium hover:underline text-sm"
              >
                ← Previous Page
              </button>
            ) : <div />}

            {hasNextPage && (
              <button
                onClick={() => setPage((prev) => prev + 1)}
                className="text-blue-600 font-medium hover:underline text-sm"
              >
                Next Page →
              </button>
            )}
          </div>
        </section>

        {/* Desktop Aside */}
        <aside className="hidden lg:block w-80 border-l pt-0 pl-6">
          <h2 className="text-xl font-bold text-gray-700 mb-4">Recent Updates</h2>
          <ul className="space-y-4 mb-6">
            {recentPosts.map((post) => (
              <li key={post.id}>
                <Link href={`/blogs/${post.id}`}>
                  <div className="text-gray-700 font-medium hover:text-blue-600 transition">
                    {post.title}
                  </div>
                  <div className="text-sm text-gray-500">{post.date}</div>
                </Link>
              </li>
            ))}
          </ul>

          <button
            onClick={() => setShowDrawer(true)}
            className="bg-blue-600 text-white w-full py-2 rounded-lg hover:bg-blue-700 transition"
          >
            📬 Subscribe for Updates
          </button>
        </aside>

        {/* Mobile Drawer Button */}
        {isMobile && (
          <button
            onClick={() => setShowDrawer(true)}
            className="fixed bottom-6 right-6 z-50 bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg hover:bg-blue-700 transition lg:hidden"
          >
            📬 More
          </button>
        )}
      </main>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {showDrawer && (
          <motion.div
            className="fixed inset-0 z-50 flex"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              className="absolute inset-0 bg-gray-600 bg-opacity-60"
              onClick={() => setShowDrawer(false)}
            />
            <motion.div
              className="ml-auto w-80 h-full bg-white shadow-xl p-6 relative flex flex-col"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              <button
                onClick={() => setShowDrawer(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>

              <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Updates</h2>
              <ul className="space-y-4 mb-6">
                {recentPosts.map((post) => (
                  <li key={post.id}>
                    <Link href={`/blogs/${post.id}`}>
                      <div className="text-gray-700 font-medium hover:text-blue-600 transition">
                        {post.title}
                      </div>
                      <div className="text-sm text-gray-500">{post.date}</div>
                    </Link>
                  </li>
                ))}
              </ul>

              <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-2">
                📬 Subscribe to our newsletter
              </h3>
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  const form = e.currentTarget as HTMLFormElement;
                  const emailInput = form.elements.namedItem('email') as HTMLInputElement;

                  try {
                    const res = await fetch('/api/newsletter/send-email', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ email: emailInput.value }),
                    });

                    const text = await res.text();
                    const data = (() => {
                      try {
                        return JSON.parse(text);
                      } catch {
                        return text;
                      }
                    })();

                    if (res.ok) {
                      showCustomToast('Thanks for subscribing!', 'Check your inbox for updates.');
                      form.reset();
                      setShowDrawer(false);
                    } else {
                      const error = typeof data === 'string' ? data : data?.error || 'Please try again later.';
                      showCustomToast('Subscription failed', error);
                    }
                  } catch (err) {
                    showCustomToast('Something went wrong...', 'Please try again later.');
                  }
                }}
                className="flex flex-col gap-3"
              >
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="Enter your email"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200 text-gray-700"
                />
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
                >
                  Subscribe
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
