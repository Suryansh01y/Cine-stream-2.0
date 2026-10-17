import { useEffect, useState } from "react";
import useDebounce from "../hooks/useDebounce";
import React from "react";

function SearchBar({ value, onSearch }) {
  const [input, setInput] = useState(value);
  const debouncedValue = useDebounce(input, 500);

  useEffect(() => {
    if (debouncedValue.trim()) {
      onSearch(debouncedValue);
    } else if (value) {
      onSearch("");
    }
  }, [debouncedValue]);

  useEffect(() => {
    setInput(value);
  }, [value]);

  return (
    <div className="search-wrap">
      <label htmlFor="movie-search" className="visually-hidden">
        Search movies
      </label>
      <input
        id="movie-search"
        type="search"
        value={input}
        onChange={(event) => setInput(event.target.value)}
        placeholder="Search for a movie..."
        autoComplete="off"
      />
      <span className="search-hint">500ms debounce</span>
    </div>
  );
}

export default SearchBar;
