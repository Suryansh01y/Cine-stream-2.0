const API_URL = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/$/, "");

async function parseResponse(response) {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.message || `Request failed (${response.status})`);
  }
  return data;
}

export async function getPosts(signal) {
  const response = await fetch(`${API_URL}/posts`, { signal });
  return parseResponse(response);
}

export async function createPost({ title, content, image }) {
  const formData = new FormData();
  formData.append("title", title);
  formData.append("content", content);
  if (image) formData.append("image", image);

  const response = await fetch(`${API_URL}/posts`, {
    method: "POST",
    body: formData,
  });
  return parseResponse(response);
}

export async function deletePost(postId) {
  const response = await fetch(`${API_URL}/posts/${postId}`, {
    method: "DELETE",
  });
  return parseResponse(response);
}
