import { useState, useEffect } from 'react';
import { NewsItem, Location, NewsState } from '../types';
import { fetchNewsByLocation, fetchNewsByKeyword, fetchNewsByCategory } from '../utils/api';

type UseNewsParams = {
  location?: Location | null;
  keyword?: string;
  category?: string;
};

export const useNews = ({ location, keyword, category }: UseNewsParams): NewsState => {
  const [state, setState] = useState<NewsState>({
    items: [],
    loading: true,
    error: null
  });

  useEffect(() => {
    const fetchNews = async () => {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      try {
        let newsItems: NewsItem[] = [];
        
        if (category) {
          newsItems = await fetchNewsByCategory(category);
        } else if (location) {
          newsItems = await fetchNewsByLocation(location);
        } else if (keyword) {
          newsItems = await fetchNewsByKeyword(keyword);
        } else {
          // Default to global news if no parameters provided
          newsItems = await fetchNewsByKeyword('global');
        }
        
        // Sort by publication date (newest first)
        newsItems.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());
        
        setState({
          items: newsItems,
          loading: false,
          error: null
        });
      } catch (error) {
        setState({
          items: [],
          loading: false,
          error: 'Failed to fetch news'
        });
      }
    };

    fetchNews();
  }, [location, keyword, category]);

  return state;
};