import React from "react";

const PostCard = ({ post }) => {
  return (
    <article className="post-card">
      <div className="post-card__image-wrapper">
        <div className="post-card__image-placeholder">📄</div>
      </div>

      <div className="post-card__content">
        <div className="post-card__header">
          <div className="post-card__id">#{post.id}</div>
        </div>

        <h2 className="post-card__title">{post.title}</h2>

        <p className="post-card__body">{post.body}</p>

        <div className="post-card__footer">
          <div className="post-card__tags">
            {post.tags?.slice(0, 3).map((tag, index) => (
              <span key={index} className="post-card__tag">
                #{tag}
              </span>
            ))}
          </div>

          <div className="post-card__reactions">
            <div className="post-card__reactions-item">
              <span className="post-card__reactions-icon">👍</span>
              <span>{post.reactions?.likes || 0}</span>
            </div>
            <div className="post-card__reactions-item">
              <span className="post-card__reactions-icon">👎</span>
              <span>{post.reactions?.dislikes || 0}</span>
            </div>
            <div className="post-card__reactions-item">
              <span className="post-card__reactions-icon">👁️</span>
              <span>{post.views || 0}</span>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};

export default PostCard;
