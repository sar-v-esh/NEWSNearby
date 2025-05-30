import React from 'react';
import NewsCard from './NewsCard';

function NewsList({ newsItems }) {
  if (!newsItems || newsItems.length === 0) {
    return <p className="message-center">No news articles found for this selection.</p>;
  }

  return (
    <div className="news-list">
      {newsItems.map((article, index) => (
        <NewsCard key={article.link || index} article={article} />
      ))}
    </div>
  );
}

export default NewsList;