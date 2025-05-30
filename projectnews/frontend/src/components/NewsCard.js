import React from 'react';

function getPublisherName(title, link) {
  if (title) {
    const parts = title.split(' - ');
    if (parts.length > 1) {
      const potentialPublisher = parts[parts.length - 1];
      if (potentialPublisher.length < 35 && !potentialPublisher.includes('.')) {
        return potentialPublisher.trim();
      }
    }
  }
  if (link) {
    try {
      const url = new URL(link);
      let hostname = url.hostname.replace(/^www\./, '');
      const domainParts = hostname.split('.');
      if (domainParts.length >= 2) {
        const mainDomain = domainParts[domainParts.length - 2];
        return mainDomain.charAt(0).toUpperCase() + mainDomain.slice(1);
      }
      return hostname;
    } catch (e) {  }
  }
  return "Unknown Source";
}

function NewsCard({ article }) {
  const publisher = getPublisherName(article.title, article.link);
  let displayTitle = article.title;
  if (publisher !== "Unknown Source" && displayTitle.endsWith(` - ${publisher}`)) {
      displayTitle = displayTitle.substring(0, displayTitle.length - ` - ${publisher}`.length);
  }

  const date = new Date(article.pubDate);
  const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;

  let fullSnippet = article.snippet || "";
  if (publisher && publisher !== "Unknown Source" && fullSnippet) {
    if (!fullSnippet.toLowerCase().endsWith(publisher.toLowerCase())) {
        fullSnippet += `. ${publisher}`;
    }
  } else if (publisher && publisher !== "Unknown Source" && !fullSnippet) {
    fullSnippet = publisher; 
  }


  return (
    <div className="news-card">
      <div className="news-card-header">
        <span className="publisher" title={publisher}>{publisher}</span>
        <span className="date">{formattedDate}</span>
      </div>
      <h3>
        <a href={article.link} target="_blank" rel="noopener noreferrer" title={displayTitle}>
          {displayTitle}
        </a>
      </h3>
      {}
      <p className="snippet" title={fullSnippet}> 
        {fullSnippet}
      </p>
    </div>
  );
}

export default NewsCard;