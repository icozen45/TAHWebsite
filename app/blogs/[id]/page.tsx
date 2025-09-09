import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';

interface BlogPageProps {
  params: { id: string };
}

export default async function BlogPage({ params }: BlogPageProps) {
  const blog = await prisma.blogPost.findUnique({
    where: { id: params.id },
  });

  if (!blog) return notFound();

  const tagList = blog.tags.split(',').map(tag => tag.trim());

  return (
    <div className="max-w-4xl mx-auto pt-24 px-6">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">{blog.title}</h1>
      <p className="text-gray-500 text-sm mb-6">{new Date(blog.createdAt).toLocaleDateString()}</p>
      <p className="text-gray-700 text-xl mb-8 font-bold border-b border-gray-200 pb-8">{blog.summary}</p>
      <article className="text-gray-800 whitespace-pre-line leading-relaxed">
        {blog.content}
      </article>

      {tagList.length > 0 && (
        <div className="mt-8 mb-8">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Tags:</h3>
          <div className="flex flex-wrap gap-2">
            {tagList.map((tag, index) => (
              <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
                #{tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
