import React from 'react';

// Helper function to extract publisher name (already provided, can be refined)
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
    } catch (e) { /* ignore */ }
  }
  return "Unknown Source";
}

function NewsCard({ article }) {
  const publisher = getPublisherName(article.title, article.link);
  let displayTitle = article.title;
  // Attempt to remove publisher from title if it was appended with ' - '
  if (publisher !== "Unknown Source" && displayTitle.endsWith(` - ${publisher}`)) {
      displayTitle = displayTitle.substring(0, displayTitle.length - ` - ${publisher}`.length);
  }

  const date = new Date(article.pubDate);
  const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;

  // Combine snippet with publisher as per the image style
  let fullSnippet = article.snippet || "";
  if (publisher && publisher !== "Unknown Source" && fullSnippet) {
    // Check if snippet already ends with publisher to avoid duplication
    // This is a simple check and might need more robust logic
    if (!fullSnippet.toLowerCase().endsWith(publisher.toLowerCase())) {
        fullSnippet += `. ${publisher}`;
    }
  } else if (publisher && publisher !== "Unknown Source" && !fullSnippet) {
    fullSnippet = publisher; // If no snippet, just show publisher
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
      {/* Display the combined snippet */}
      <p className="snippet" title={fullSnippet}> 
        {fullSnippet}
      </p>
    </div>
  );
}

export default NewsCard;