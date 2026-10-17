import MovieCard from "./MovieCard";
import React from "react";

function MovieGrid({ movies, favorites, onFavorite }) {
  const favoriteIds = new Set(favorites.map((movie) => movie.id));

  return (
    <section className="movie-grid" aria-label="Movie results">
      {movies.map((movie) => (
        <MovieCard
          key={`${movie.id}-${movie.title}`}
          movie={movie}
          isFavorite={favoriteIds.has(movie.id)}
          onFavorite={onFavorite}
        />
      ))}
    </section>
  );
}

export default MovieGrid;
