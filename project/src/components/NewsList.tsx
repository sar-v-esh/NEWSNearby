import React from 'react';
import { motion } from 'framer-motion';
import { NewsItem } from '../types';
import NewsCard from './NewsCard';
import Loader from './ui/Loader';

interface NewsListProps {
  news: NewsItem[];
  loading: boolean;
  error: string | null;
}

const NewsList: React.FC<NewsListProps> = ({ news, loading, error }) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500 mb-4">{error}</p>
        <p>Please try again later or search for a different topic.</p>
      </div>
    );
  }

  if (news.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">No news articles found.</p>
        <p>Try searching for a different topic or location.</p>
      </div>
    );
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {news.map((newsItem) => (
        <motion.div key={newsItem.id} variants={item}>
          <NewsCard news={newsItem} />
        </motion.div>
      ))}
    </motion.div>
  );
};

export default NewsList;