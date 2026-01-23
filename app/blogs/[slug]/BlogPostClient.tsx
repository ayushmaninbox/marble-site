'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Blog } from '@/lib/types';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import QuoteModal from '@/components/QuoteModal';

const HeartIcon = ({ filled }: { filled?: boolean }) => (
  <svg
    className="w-5 h-5"
    fill={filled ? "currentColor" : "none"}
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
  </svg>
);

const ArrowLeftIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
  </svg>
);

export default function BlogPostClient() {
  const params = useParams();
  const slug = params.slug as string;

  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);

  useEffect(() => {
    fetchBlog();
  }, [slug]);

  const fetchBlog = async () => {
    try {
      const response = await fetch('/api/blogs');
      const blogs = await response.json();
      const foundBlog = blogs.find((b: Blog) => b.slug === slug);
      if (foundBlog) {
        setBlog(foundBlog);
        setLikeCount(foundBlog.likes);
      }
    } catch (error) {
      console.error('Error fetching blog:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (blog) {
      const isLiked = localStorage.getItem(`blog_liked_${blog.id}`);
      if (isLiked) setLiked(true);
    }
  }, [blog]);

  const handleLike = async () => {
    if (!blog || liked) return;

    try {
      const response = await fetch(`/api/blogs/${blog.id}/like`, { method: 'POST' });
      if (response.ok) {
        const data = await response.json();
        setLikeCount(data.likes);
        setLiked(true);
        localStorage.setItem(`blog_liked_${blog.id}`, 'true');
      }
    } catch (error) {
      console.error('Error liking blog:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-red-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold text-slate-900 mb-4">Blog post not found</h1>
        <Link href="/blogs" className="text-red-600 hover:underline">← Back to blogs</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 pt-24">
      <SiteHeader setIsQuoteOpen={setIsQuoteOpen} />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Link href="/blogs" className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-red-600 transition">
          <ArrowLeftIcon /> Back to all posts
        </Link>
      </div>

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {blog.coverImage && (
          <div className="aspect-[21/9] rounded-2xl overflow-hidden mb-8">
            <img src={blog.coverImage} alt={blog.title} className="w-full h-full object-cover" />
          </div>
        )}

        <div className="flex items-center gap-4 text-sm text-slate-500 mb-4">
          <span>By {blog.author}</span>
          <span>•</span>
          <span>{new Date(blog.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
        </div>

        <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 font-serif mb-6">
          {blog.title}
        </h1>

        <div className="prose prose-slate prose-lg max-w-none mb-12 prose-headings:font-serif prose-headings:text-slate-900 prose-p:text-slate-700 prose-a:text-red-600 prose-img:rounded-xl" dangerouslySetInnerHTML={{ __html: blog.content }} />

        <div className="flex items-center gap-4 py-6 border-t border-b border-stone-200 mb-12">
          <button
            onClick={handleLike}
            disabled={liked}
            className={`inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all ${liked ? 'bg-red-100 text-red-600 cursor-default' : 'bg-red-600 text-white hover:bg-red-700'}`}
          >
            <HeartIcon filled={liked} />
            {liked ? 'Liked!' : 'Like this post'}
          </button>
          <span className="text-slate-600">{likeCount} {likeCount === 1 ? 'like' : 'likes'}</span>
        </div>

        <CommentSection blogId={blog.id} />
      </article>

      <SiteFooter setIsQuoteOpen={setIsQuoteOpen} />
      <QuoteModal isOpen={isQuoteOpen} onClose={() => setIsQuoteOpen(false)} />
    </div>
  );
}

function CommentSection({ blogId }: { blogId: string }) {
  const [comments, setComments] = useState<any[]>([]);
  const [formData, setFormData] = useState({ name: '', email: '', content: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchComments();
    const storedName = localStorage.getItem('comment_name');
    const storedEmail = localStorage.getItem('comment_email');
    if (storedName && storedEmail) {
        setFormData(prev => ({ ...prev, name: storedName, email: storedEmail }));
    }
  }, [blogId]);

  const fetchComments = async () => {
    try {
      const res = await fetch(`/api/comments?blogId=${blogId}`);
      if (res.ok) {
        const data = await res.json();
        setComments(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
           blogId,
           name: formData.name,
           email: formData.email,
           content: formData.content,
        })
      });

      if (res.ok) {
        localStorage.setItem('comment_name', formData.name);
        localStorage.setItem('comment_email', formData.email);
        setFormData(prev => ({ ...prev, content: '' }));
        fetchComments();
      }
    } catch (err) {
      alert('Failed to post comment');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section>
        <h2 className="text-xl font-bold text-slate-900 mb-6">Comments ({comments.length})</h2>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 border border-stone-200 mb-8">
            <h3 className="text-sm font-bold text-slate-900 mb-4">Leave a comment</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <input
                type="text"
                placeholder="Your name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="rounded-lg border border-stone-200 px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-red-400 focus:ring-2 focus:ring-red-500/20"
              />
              <input
                type="email"
                placeholder="Your email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="rounded-lg border border-stone-200 px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-red-400 focus:ring-2 focus:ring-red-500/20"
              />
            </div>
            <textarea
              placeholder="Write your comment..."
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              required
              rows={3}
              className="w-full rounded-lg border border-stone-200 px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-red-400 focus:ring-2 focus:ring-red-500/20 mb-4"
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-lg bg-red-600 hover:bg-red-700 px-6 py-2.5 text-sm font-semibold text-white transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Posting...' : 'Post Comment'}
            </button>
        </form>

        <div className="space-y-4">
            {comments.map(comment => (
                <div key={comment.id} className="bg-white rounded-xl p-6 border border-stone-200">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-red-500 to-orange-400 flex items-center justify-center text-white text-xs font-bold">
                           {comment.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                           <div className="text-sm font-medium text-slate-900">{comment.name}</div>
                           <div className="text-xs text-slate-400">{new Date(comment.createdAt).toLocaleDateString()}</div>
                        </div>
                    </div>
                    <p className="text-sm text-slate-700">{comment.content}</p>
                </div>
            ))}
            {comments.length === 0 && (
              <p className="text-center text-slate-400 py-8">No comments yet. Be the first to comment!</p>
            )}
        </div>
    </section>
  );
}
