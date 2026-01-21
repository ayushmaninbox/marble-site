'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Blog } from '@/lib/types';
import SiteHeader from '@/components/SiteHeader';
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

export default function BlogPostPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);

  // Comment form
  const [commentForm, setCommentForm] = useState({ name: '', email: '', content: '' });
  const [commentSubmitting, setCommentSubmitting] = useState(false);
  const [comments, setComments] = useState<Blog['comments']>([]);

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
        setComments(foundBlog.comments);
        document.title = `${foundBlog.title} | Shree Radhe Marble & Granite`;
      }
    } catch (error) {
      console.error('Error fetching blog:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (!blog || liked) return;

    try {
      const response = await fetch(`/api/blogs/${blog.id}/like`, { method: 'POST' });
      if (response.ok) {
        const data = await response.json();
        setLikeCount(data.likes);
        setLiked(true);
      }
    } catch (error) {
      console.error('Error liking blog:', error);
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!blog || !commentForm.name || !commentForm.email || !commentForm.content) return;

    setCommentSubmitting(true);
    try {
      const response = await fetch(`/api/blogs/${blog.id}/comment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(commentForm),
      });

      if (response.ok) {
        const data = await response.json();
        setComments(data.comments);
        setCommentForm({ name: '', email: '', content: '' });
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setCommentSubmitting(false);
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
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <SiteHeader setIsQuoteOpen={setIsQuoteOpen} />

      {/* Back Link */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Link href="/blogs" className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-red-600 transition">
          <ArrowLeftIcon /> Back to all posts
        </Link>
      </div>

      {/* Article */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {/* Cover Image */}
        {blog.coverImage && (
          <div className="aspect-[21/9] rounded-2xl overflow-hidden mb-8">
            <img
              src={blog.coverImage}
              alt={blog.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Meta */}
        <div className="flex items-center gap-4 text-sm text-slate-500 mb-4">
          <span>By {blog.author}</span>
          <span>•</span>
          <span>{new Date(blog.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
        </div>

        {/* Title */}
        <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 font-serif mb-6">
          {blog.title}
        </h1>

        {/* Content */}
        <div className="prose prose-slate prose-lg max-w-none mb-12">
          {blog.content.split('\n').map((paragraph, i) => {
            if (paragraph.startsWith('## ')) {
              return <h2 key={i} className="text-xl font-bold text-slate-900 mt-8 mb-4">{paragraph.replace('## ', '')}</h2>;
            }
            if (paragraph.startsWith('### ')) {
              return <h3 key={i} className="text-lg font-bold text-slate-900 mt-6 mb-3">{paragraph.replace('### ', '')}</h3>;
            }
            if (paragraph.startsWith('- ') || paragraph.startsWith('* ')) {
              return <li key={i} className="text-slate-700 ml-4">{paragraph.replace(/^[-*] /, '')}</li>;
            }
            if (paragraph.trim() === '') return null;
            return <p key={i} className="text-slate-700 mb-4">{paragraph}</p>;
          })}
        </div>

        {/* Like Button */}
        <div className="flex items-center gap-4 py-6 border-t border-b border-stone-200 mb-12">
          <button
            onClick={handleLike}
            disabled={liked}
            className={`inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all ${liked
              ? 'bg-red-100 text-red-600 cursor-default'
              : 'bg-red-600 text-white hover:bg-red-700'
              }`}
          >
            <HeartIcon filled={liked} />
            {liked ? 'Liked!' : 'Like this post'}
          </button>
          <span className="text-slate-600">{likeCount} {likeCount === 1 ? 'like' : 'likes'}</span>
        </div>

        {/* Comments Section */}
        <section>
          <h2 className="text-xl font-bold text-slate-900 mb-6">
            Comments ({comments.length})
          </h2>

          {/* Comment Form */}
          <form onSubmit={handleCommentSubmit} className="bg-white rounded-xl p-6 border border-stone-200 mb-8">
            <h3 className="text-sm font-bold text-slate-900 mb-4">Leave a comment</h3>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <input
                type="text"
                placeholder="Your name"
                value={commentForm.name}
                onChange={(e) => setCommentForm({ ...commentForm, name: e.target.value })}
                required
                className="rounded-lg border border-stone-200 px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-red-400 focus:ring-2 focus:ring-red-500/20"
              />
              <input
                type="email"
                placeholder="Your email"
                value={commentForm.email}
                onChange={(e) => setCommentForm({ ...commentForm, email: e.target.value })}
                required
                className="rounded-lg border border-stone-200 px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-red-400 focus:ring-2 focus:ring-red-500/20"
              />
            </div>
            <textarea
              placeholder="Write your comment..."
              value={commentForm.content}
              onChange={(e) => setCommentForm({ ...commentForm, content: e.target.value })}
              required
              rows={3}
              className="w-full rounded-lg border border-stone-200 px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-red-400 focus:ring-2 focus:ring-red-500/20 mb-4"
            />
            <button
              type="submit"
              disabled={commentSubmitting}
              className="rounded-lg bg-red-600 hover:bg-red-700 px-6 py-2.5 text-sm font-semibold text-white transition-colors disabled:opacity-50"
            >
              {commentSubmitting ? 'Posting...' : 'Post Comment'}
            </button>
          </form>

          {/* Comment List */}
          <div className="space-y-4">
            {comments.map((comment) => (
              <div key={comment.id} className="bg-white rounded-xl p-6 border border-stone-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-red-500 to-orange-400 flex items-center justify-center text-white text-xs font-bold">
                    {comment.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-slate-900">{comment.name}</div>
                    <div className="text-xs text-slate-400">
                      {new Date(comment.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </div>
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
      </article>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="h-10 w-10 mx-auto rounded-lg bg-gradient-to-br from-red-600 via-red-500 to-orange-400 mb-4" />
          <p className="text-slate-400 text-sm">
            © 2026 Shree Radhe Marble & Granite. All rights reserved.
          </p>
        </div>
      </footer>
      <QuoteModal isOpen={isQuoteOpen} onClose={() => setIsQuoteOpen(false)} />
    </div>
  );
}
