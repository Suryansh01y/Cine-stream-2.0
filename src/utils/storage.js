const FAVORITES_KEY = "cine-stream-favorites";

export function readFavorites() {
  try {
    const stored = localStorage.getItem(FAVORITES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function toggleFavorite(movie) {
  const current = readFavorites();
  const exists = current.some((item) => item.id === movie.id);

  const next = exists
    ? current.filter((item) => item.id !== movie.id)
    : [...current, movie];

  localStorage.setItem(FAVORITES_KEY, JSON.stringify(next));
  return next;
}
