import React from 'react';

const IconAll = () => <svg viewBox="0 0 24 24" fill="currentColor" width="1em" height="1em"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93s3.05-7.44 7-7.93v15.86zm2-15.86c1.03.13 2 .45 2.87.93H13v-.93zM13 7h5.24c.25.31.48.65.68 1H13V7zm0 3h6.3c.18.65.27 1.31.27 2s-.09 1.35-.27 2H13v-4zm0 6h5.92c-.2.35-.43.69-.68 1H13v-1zm-2 3.07c.87.48 1.84.8 2.87.93V19H9.13c.87-.48 1.84-.8 2.87-.93z"/></svg>;
const IconBusiness = () => <svg viewBox="0 0 24 24" fill="currentColor" width="1em" height="1em"><path d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z"/></svg>;
const IconTechnology = () => <svg viewBox="0 0 24 24" fill="currentColor" width="1em" height="1em"><path d="M12.01 2C9.46 2 7.23 3.32 6.13 5.42L4.6 4L3 5.6l1.78 1.78C4.22 8.51 4 9.72 4 11c0 2.7.95 5.11 2.5 6.97V20h2.38L12 22l3.13-2H17.5v-2.03A8.925 8.925 0 0020 11c0-1.28-.22-2.49-.6-3.62L21.18 5.6 19.58 4l-1.53 1.42C16.95 3.32 14.72 2 12.01 2zm0 2c1.79 0 3.4.78 4.51 2.04l-1.52 1.52C14.24 6.53 13.18 6 12.01 6s-2.23.53-3 1.56L7.5 5.96C8.61 4.78 10.22 4 12.01 4zm0 13c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z"/><circle cx="12" cy="11" r="2"/></svg>;
const IconEntertainment = () => <svg viewBox="0 0 24 24" fill="currentColor" width="1em" height="1em"><path d="M21 3H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h5v2h8v-2h5c1.1 0 1.99-.9 1.99-2L23 5c0-1.1-.9-2-2-2zm0 14H3V5h18v12z"/></svg>;
const IconSports = () => <svg viewBox="0 0 24 24" fill="currentColor" width="1em" height="1em"><path d="M3.5 18.49l6-6.01 4 4L22 6.92l-1.41-1.41L13.5 12.5l-4-4L2 17.08l1.5 1.41z"/></svg>;
const IconHealth = () => <svg viewBox="0 0 24 24" fill="currentColor" width="1em" height="1em"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>;
const IconPolitics = () => <svg viewBox="0 0 24 24" fill="currentColor" width="1em" height="1em"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>;
const IconScience = () => <svg viewBox="0 0 24 24" fill="currentColor" width="1em" height="1em"><path d="M18 10.48V6c0-1.1-.9-2-2-2H8c-1.1 0-2 .9-2 2v4.48l-3.94 6.56C1.53 22.06 2.44 23 3.5 23h17c1.06 0 1.97-.94 1.44-2.02L18 10.48zM9 4h6v6l-3 5-3-5V4zm3 17c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z"/></svg>;


const categories = [
  { name: 'All', icon: <IconAll /> },
  { name: 'Business', icon: <IconBusiness /> },
  { name: 'Technology', icon: <IconTechnology /> },
  { name: 'Entertainment', icon: <IconEntertainment /> },
  { name: 'Sports', icon: <IconSports /> },
  { name: 'Health', icon: <IconHealth /> },
  { name: 'Politics', icon: <IconPolitics /> },
  { name: 'Science', icon: <IconScience /> },
];

function CategoryFilters({ activeCategory, onSelectCategory }) {
  return (
    <div className="category-filters">
      {categories.map(category => (
        <button
          key={category.name}
          className={`category-button ${activeCategory === category.name ? 'active' : ''} ${category.name === 'All' && activeCategory === 'All' ? 'all-active' : ''}`}
          onClick={() => onSelectCategory(category.name)}
        >
          {category.icon}
          {category.name}
        </button>
      ))}
    </div>
  );
}

export default CategoryFilters;