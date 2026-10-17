import { useCallback, useEffect, useState } from "react";
import Header from "../components/Header";
import Loader from "../components/Loader";
import { readFavorites } from "../utils/storage";
import { createPost, deletePost, getPosts } from "../services/posts";
import React from "react";

function Community() {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [favorites] = useState(readFavorites);

  const loadPosts = useCallback(async (signal) => {
    try {
      setError("");
      const data = await getPosts(signal);
      setPosts(Array.isArray(data) ? data : []);
    } catch (err) {
      if (err.name !== "AbortError") setError(err.message || "Could not load community posts.");
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    loadPosts(controller.signal);
    return () => controller.abort();
  }, [loadPosts]);

  async function handleSubmit(event) {
    event.preventDefault();
    const formElement = event.currentTarget;
    setError("");
    setNotice("");
    if (!title.trim() || !content.trim()) {
      setError("Please enter both a title and post content.");
      return;
    }
    if (image && !["image/jpeg", "image/png", "image/webp", "image/gif"].includes(image.type)) {
      setError("Choose a JPG, PNG, WEBP, or GIF image.");
      return;
    }
    setSaving(true);
    try {
      const result = await createPost({ title: title.trim(), content: content.trim(), image });
      setPosts((current) => [result.post, ...current]);
      setTitle("");
      setContent("");
      setImage(null);
      formElement.reset();
      setNotice("Your post was published successfully.");
    } catch (err) {
      setError(err.message || "Could not create the post.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(postId) {
    if (!window.confirm("Delete this community post?")) return;
    setDeletingId(postId);
    setError("");
    setNotice("");
    try {
      await deletePost(postId);
      setPosts((current) => current.filter((post) => post._id !== postId));
      setNotice("Post deleted successfully.");
    } catch (err) {
      setError(err.message || "Could not delete the post.");
    } finally {
      setDeletingId("");
    }
  }

  return (
    <>
      <Header favoriteCount={favorites.length} />
      <main className="container community-page page-space">
        <section className="section-heading">
          <p className="eyebrow">CINE-STREAM COMMUNITY</p>
          <h1>Share your movie thoughts.</h1>
          <p>Publish a review or recommendation. Posts are saved by the Node.js API in MongoDB.</p>
        </section>

        <section className="community-form-card">
          <h2>Create a post</h2>
          <form onSubmit={handleSubmit} className="community-form">
            <label htmlFor="post-title">Title</label>
            <input id="post-title" value={title} onChange={(event) => setTitle(event.target.value)} maxLength={120} required placeholder="e.g. A movie worth watching" />
            <label htmlFor="post-content">Your thoughts</label>
            <textarea id="post-content" value={content} onChange={(event) => setContent(event.target.value)} maxLength={5000} required rows={5} placeholder="Write your review or recommendation..." />
            <label htmlFor="post-image">Optional image (JPG, PNG, WEBP, GIF; max 5 MB)</label>
            <input id="post-image" type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={(event) => setImage(event.target.files?.[0] || null)} />
            <button className="primary-btn" type="submit" disabled={saving}>{saving ? "Publishing..." : "Publish post"}</button>
          </form>
        </section>

        {error && <div className="error-box" role="alert">{error}</div>}
        {notice && <div className="success-box" role="status">{notice}</div>}

        <section className="community-posts-section">
          <div className="community-section-title"><div><p className="eyebrow">FROM THE COMMUNITY</p><h2>Recent posts</h2></div><span className="post-count">{posts.length} {posts.length === 1 ? "post" : "posts"}</span></div>
          {loading ? <Loader label="Loading community posts..." /> : posts.length === 0 ? (
            <div className="empty-state"><div className="empty-icon">✍️</div><h2>No posts yet</h2><p>Be the first to share a movie recommendation.</p></div>
          ) : (
            <div className="community-post-grid">
              {posts.map((post) => (
                <article className="community-post-card" key={post._id}>
                  {post.imageUrl && <img className="community-post-image" src={post.imageUrl} alt={`Image for ${post.title}`} loading="lazy" />}
                  <div className="community-post-body">
                    <div className="community-post-meta"><span>{post.authorId?.name || "Community member"}</span><time dateTime={post.createdAt}>{post.createdAt ? new Date(post.createdAt).toLocaleDateString() : "Just now"}</time></div>
                    <h3>{post.title}</h3>
                    <p>{post.content}</p>
                    <button type="button" className="delete-btn" onClick={() => handleDelete(post._id)} disabled={deletingId === post._id}>{deletingId === post._id ? "Deleting..." : "Delete post"}</button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </>
  );
}

export default Community;
