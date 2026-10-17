import { getImageUrl } from "../services/tmdb";
import React from "react";

function MovieCard({ movie, isFavorite, onFavorite }) {
  const year = movie.release_date
    ? new Date(movie.release_date).getFullYear()
    : "N/A";

  return (
    <article className="movie-card">
      <div className="poster-wrap">
        {movie.poster_path ? (
          <img
            src={getImageUrl(movie.poster_path)}
            alt={`${movie.title} poster`}
            loading="lazy"
          />
        ) : (
          <div className="poster-placeholder">No Poster</div>
        )}

        <button
          type="button"
          className={`heart-btn ${isFavorite ? "active" : ""}`}
          onClick={() => onFavorite(movie)}
          aria-label={
            isFavorite
              ? `Remove ${movie.title} from favorites`
              : `Add ${movie.title} to favorites`
          }
          aria-pressed={isFavorite}
        >
          {isFavorite ? "♥" : "♡"}
        </button>
      </div>

      <div className="movie-info">
        <h2 title={movie.title}>{movie.title}</h2>
        <div className="movie-meta">
          <span>{year}</span>
          <span>★ {Number(movie.vote_average || 0).toFixed(1)}</span>
        </div>
      </div>
    </article>
  );
}

export default MovieCard;
