import React, { useState } from 'react';

const NewspaperIcon = () => <span className="logo-icon">📰</span>;

function Header({ onSearch }) {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      onSearch(searchTerm.trim());
    }
  };

  return (
    <header className="app-header">
      <div className="logo-container">
        <NewspaperIcon />
        <span className="logo-text">NEWSNearby</span>
      </div>
      <form onSubmit={handleSearchSubmit} className="search-bar-container">
        <input
          type="text"
          className="search-input"
          placeholder="Search for news..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button type="submit" className="search-button">Search</button>
      </form>
    </header>
  );
}

export default Header;