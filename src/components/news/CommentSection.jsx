import React, { useState } from 'react';
import { MessageSquare, ThumbsUp, Send } from 'lucide-react';

export const CommentSection = () => {
  const [comments, setComments] = useState([]);
  const [authorName, setAuthorName] = useState('');
  const [commentText, setCommentText] = useState('');

  const handleLike = (id) => {
    setComments((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          return {
            ...c,
            likesCount: c.isLiked ? c.likesCount - 1 : c.likesCount + 1,
            isLiked: !c.isLiked,
          };
        }
        return c;
      })
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    const newComment = {
      id: `c-${Date.now()}`,
      author: authorName.trim() || 'Anonymous Reader',
      timestamp: 'Just now',
      text: commentText,
      likesCount: 0,
      isLiked: false,
    };

    setComments([newComment, ...comments]);
    setCommentText('');
    setAuthorName('');
  };

  return (
    <section className="bg-surface-container-lowest border border-surface-container-high p-6 sm:p-8 mt-10">
      <div className="flex items-center justify-between border-b border-surface-container-high pb-4 mb-6">
        <div className="flex items-center gap-2 font-headline font-bold text-xl uppercase tracking-tight text-on-surface">
          <MessageSquare size={22} className="text-primary" />
          <span>READER DISCUSSION ({comments.length})</span>
        </div>
        <span className="text-xs text-secondary font-sans font-medium">MODERATED FOR CIVIC INTEGRITY</span>
      </div>

      {/* Comment Form */}
      <form onSubmit={handleSubmit} className="mb-8 space-y-3 font-sans">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input
            type="text"
            placeholder="Your Name (Optional)"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            className="bg-surface border border-surface-container-highest px-3.5 py-2 text-sm focus:outline-none focus:border-primary text-on-surface"
          />
        </div>
        <textarea
          rows={3}
          required
          placeholder="Join the discussion... Keep comments respectful and constructive."
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          className="w-full bg-surface border border-surface-container-highest p-3 text-sm focus:outline-none focus:border-primary text-on-surface resize-none"
        ></textarea>
        <button
          type="submit"
          className="bg-news-dark hover:bg-black text-white font-headline font-bold text-xs uppercase px-5 py-2.5 flex items-center gap-2 transition-colors"
        >
          <span>POST COMMENT</span>
          <Send size={14} />
        </button>
      </form>

      {/* Comments List */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <p className="text-xs text-secondary italic">No comments yet. Be the first to join the conversation!</p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="p-4 bg-surface border border-surface-container-high font-sans">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-none bg-surface-container-highest flex items-center justify-center font-bold text-xs text-on-surface">
                    {comment.author[0]}
                  </div>
                  <span className="font-bold text-sm text-on-surface">{comment.author}</span>
                  <span className="text-[11px] text-secondary">• {comment.timestamp}</span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-on-surface leading-relaxed mt-1">{comment.text}</p>

              <div className="mt-3 flex items-center gap-4 text-xs text-secondary pt-2 border-t border-surface-container">
                <button
                  onClick={() => handleLike(comment.id)}
                  className={`flex items-center gap-1.5 font-medium transition-colors ${
                    comment.isLiked ? 'text-primary font-bold' : 'hover:text-on-surface'
                  }`}
                >
                  <ThumbsUp size={14} className={comment.isLiked ? 'fill-primary' : ''} />
                  <span>{comment.likesCount} Helpful</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
};
