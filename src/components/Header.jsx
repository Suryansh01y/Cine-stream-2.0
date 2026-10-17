import { NavLink } from "react-router-dom";
import React from "react";

function Header({ favoriteCount }) {
  return (
    <header className="site-header">
      <div className="container nav">
        <NavLink to="/" className="brand">
          <span className="brand-mark">C</span>
          <span>Cine-Stream</span>
        </NavLink>

        <nav aria-label="Primary navigation">
          <NavLink to="/" end className="nav-link">
            Home
          </NavLink>
          <NavLink to="/favorites" className="nav-link">
            Favorites <span className="badge">{favoriteCount}</span>
          </NavLink>
          <NavLink to="/community" className="nav-link">Community</NavLink>
        </nav>
      </div>
    </header>
  );
}

export default Header;
