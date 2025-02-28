import React from 'react';
import { Calendar, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import { NewsItem } from '../types';
import Card from './ui/Card';

interface NewsCardProps {
  news: NewsItem;
}

const NewsCard: React.FC<NewsCardProps> = ({ news }) => {
  const formattedDate = new Date(news.pubDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <Card className="h-full flex flex-col">
      <div className="relative h-48 overflow-hidden">
        <img
          src={news.imageUrl || 'https://source.unsplash.com/random/800x600?news'}
          alt={news.title}
          className="w-full h-full object-cover"
        />
        {news.category && (
          <span className="absolute top-2 right-2 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded">
            {news.category}
          </span>
        )}
      </div>
      <div className="p-4 flex-grow flex flex-col">
        <h3 className="text-lg font-semibold mb-2 line-clamp-2">{news.title}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">{news.description}</p>
        <div className="mt-auto">
          <div className="flex items-center text-gray-500 text-xs mb-2">
            <Calendar size={14} className="mr-1" />
            <span>{formattedDate}</span>
          </div>
          <div className="text-gray-500 text-xs mb-3">Source: {news.source}</div>
          <motion.a
            href={news.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-blue-600 hover:text-blue-800"
            whileHover={{ x: 5 }}
          >
            Read more <ExternalLink size={14} className="ml-1" />
          </motion.a>
        </div>
      </div>
    </Card>
  );
};

export default NewsCard;