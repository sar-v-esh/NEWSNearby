import express from 'express';
import axios from 'axios';
import cors from 'cors';
import dotenv from 'dotenv';
import Parser from 'rss-parser';

dotenv.config();
const app = express();
const parser = new Parser();

app.use(cors());
app.use(express.json());

const GOOGLE_RSS_BASE = 'https://news.google.com/rss';

// Fetch news by keyword
app.get('/api/news', async (req, res) => {
  const { query, category } = req.query;
  let rssUrl = `${GOOGLE_RSS_BASE}?hl=en`;

  if (query) rssUrl += `&q=${encodeURIComponent(query as string)}`;
  if (category) rssUrl += `&topic=${encodeURIComponent(category as string)}`;

  try {
    const response = await axios.get(rssUrl);
    const feed = await parser.parseString(response.data);

    const news = feed.items.map((item) => ({
      title: item.title,
      link: item.link,
      pubDate: item.pubDate,
      description: item.contentSnippet,
      source: item.source || 'Unknown Source',
    }));

    res.json({ news });
  } catch (error) {
    console.error('Error fetching news:', error);
    res.status(500).json({ error: 'Failed to fetch news' });
  }
});

// Start Server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`🚀 Backend running on port ${PORT}`));
