const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

function getToken() {
  const token = import.meta.env.VITE_TMDB_TOKEN;

  if (!token || token === "your_tmdb_read_access_token") {
    throw new Error(
      "TMDB token is missing. Add VITE_TMDB_TOKEN to your .env file."
    );
  }

  return token;
}

async function request(endpoint, params = {}) {
  const url = new URL(`${BASE_URL}${endpoint}`);

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      url.searchParams.set(key, value);
    }
  });

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
      accept: "application/json"
    }
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`TMDB request failed (${response.status}). ${body}`);
  }

  return response.json();
}

export function getPopularMovies(page = 1) {
  return request("/movie/popular", {
    language: "en-US",
    page
  });
}

export function searchMovies(query, page = 1) {
  return request("/search/movie", {
    query,
    include_adult: false,
    language: "en-US",
    page
  });
}

export function getImageUrl(path) {
  return path ? `${IMAGE_BASE_URL}${path}` : "";
}
