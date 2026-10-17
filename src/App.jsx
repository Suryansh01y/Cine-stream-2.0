import { useCallback, useEffect, useRef, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import Header from "./components/Header";
import SearchBar from "./components/SearchBar";
import MovieGrid from "./components/MovieGrid";
import Loader from "./components/Loader";
import EmptyState from "./components/EmptyState";
import MoodMatcher from "./components/MoodMatcher";
import React from "react";
import Home from "./pages/Home";
import Favorites from "./pages/Favorites";
import Community from "./pages/Community";
import {
  getPopularMovies,
  searchMovies,
  getImageUrl
} from "./services/tmdb";
import { getMoodMovieTitle } from "./services/ai";
import { readFavorites, toggleFavorite } from "./utils/storage";

const FIRST_PAGE = 1;

function MovieExplorer() {
  const [movies, setMovies] = useState([]);
  const [favorites, setFavorites] = useState(readFavorites);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(FIRST_PAGE);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");
  const loaderRef = useRef(null);

  const loadMovies = useCallback(async (pageNumber = 1, searchQuery = "") => {
    try {
      if (pageNumber === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      setError("");

      const data = searchQuery.trim()
        ? await searchMovies(searchQuery.trim(), pageNumber)
        : await getPopularMovies(pageNumber);

      setMovies((previous) =>
        pageNumber === 1 ? data.results : [...previous, ...data.results]
      );

      setHasMore(pageNumber < data.total_pages);
      setPage(pageNumber);
    } catch (err) {
      setError(err.message || "Something went wrong while loading movies.");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    loadMovies(1, "");
  }, [loadMovies]);

  const handleSearch = useCallback(
    (value) => {
      setQuery(value);
      loadMovies(1, value);
    },
    [loadMovies]
  );

  const handleLoadMore = useCallback(() => {
    if (!loading && !loadingMore && hasMore) {
      loadMovies(page + 1, query);
    }
  }, [hasMore, loadMovies, loading, loadingMore, page, query]);

  useEffect(() => {
    const node = loaderRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          handleLoadMore();
        }
      },
      { rootMargin: "500px 0px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [handleLoadMore]);

  const handleFavorite = (movie) => {
    setFavorites(toggleFavorite(movie));
  };

  const handleMoodSearch = async (mood) => {
    const title = await getMoodMovieTitle(mood);
    setQuery(title);
    await loadMovies(1, title);
    return title;
  };

  return (
    <>
      <Header favoriteCount={favorites.length} />

      <main className="container">
        <section className="hero">
          <div>
            <p className="eyebrow">CINE-STREAM</p>
            <h1>Discover your next movie.</h1>
            <p className="hero-text">
              Browse popular movies, search instantly, save favorites, and
              find a movie using your mood.
            </p>
          </div>
        </section>

        <SearchBar value={query} onSearch={handleSearch} />

        <MoodMatcher onFindMovie={handleMoodSearch} />

        {error && (
          <div className="error-box" role="alert">
            {error}
          </div>
        )}

        {loading ? (
          <Loader label="Loading movies..." />
        ) : movies.length ? (
          <>
            <MovieGrid
              movies={movies}
              favorites={favorites}
              onFavorite={handleFavorite}
            />
            <div ref={loaderRef} className="scroll-sentinel" aria-hidden="true" />
            {loadingMore && <Loader label="Loading more movies..." />}
            {!hasMore && (
              <p className="end-message">You reached the end of the results.</p>
            )}
          </>
        ) : (
          <EmptyState message="No movies found. Try another search." />
        )}
      </main>
    </>
  );
}

function FavoritesPage() {
  const [favorites, setFavorites] = useState(readFavorites);

  const removeFavorite = (movie) => {
    setFavorites(toggleFavorite(movie));
  };

  return (
    <>
      <Header favoriteCount={favorites.length} />
      <main className="container page-space">
        <section className="section-heading">
          <p className="eyebrow">MY COLLECTION</p>
          <h1>My Favorites</h1>
          <p>Movies you saved are stored in your browser using localStorage.</p>
        </section>

        {favorites.length ? (
          <MovieGrid
            movies={favorites}
            favorites={favorites}
            onFavorite={removeFavorite}
          />
        ) : (
          <EmptyState message="You have not added any favorites yet." />
        )}
      </main>
    </>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<MovieExplorer />} />
      <Route path="/favorites" element={<FavoritesPage />} />
      <Route path="/community" element={<Community />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

function NotFound() {
  const navigate = useNavigate();

  return (
    <main className="container not-found">
      <h1>404</h1>
      <p>That page does not exist.</p>
      <button className="primary-btn" onClick={() => navigate("/")}>
        Go Home
      </button>
    </main>
  );
}

export default App;
