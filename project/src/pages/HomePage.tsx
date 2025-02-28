import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLocation } from '../hooks/useLocation';
import { useNews } from '../hooks/useNews';
import Header from '../components/Header';
import LocationBanner from '../components/LocationBanner';
import CategoryFilter from '../components/CategoryFilter';
import NewsList from '../components/NewsList';
import { getUserLocation } from '../utils/api';

const HomePage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const locationState = useLocation();
  
  const newsState = useNews({
    location: searchQuery ? null : locationState.data,
    keyword: searchQuery || undefined,
    category: selectedCategory || undefined
  });

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setSelectedCategory(null);
  };

  const handleCategorySelect = (category: string | null) => {
    setSelectedCategory(category);
    setSearchQuery('');
  };

  const handleRequestLocation = async () => {
    try {
      await getUserLocation();
      // The useLocation hook will handle the rest
      window.location.reload();
    } catch (error) {
      console.error('Error requesting location:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onSearch={handleSearch} />
      
      <main className="container mx-auto px-4 py-8">
        <LocationBanner
          location={locationState.data}
          permissionStatus={locationState.permissionStatus}
          onRequestLocation={handleRequestLocation}
        />
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              {searchQuery
                ? `Search Results for "${searchQuery}"`
                : selectedCategory
                ? `${selectedCategory} News`
                : locationState.data
                ? `Latest News Near ${locationState.data.city || locationState.data.region || locationState.data.country || 'You'}`
                : 'Latest News'}
            </h2>
            <p className="text-gray-600">
              {searchQuery
                ? `Showing the latest articles about "${searchQuery}"`
                : selectedCategory
                ? `Browse the latest ${selectedCategory.toLowerCase()} news and updates`
                : locationState.data
                ? `Stay informed with local news and events`
                : 'Browse the latest headlines from around the world'}
            </p>
          </div>
          
          <CategoryFilter
            selectedCategory={selectedCategory}
            onSelectCategory={handleCategorySelect}
          />
          
          <NewsList
            news={newsState.items}
            loading={newsState.loading}
            error={newsState.error}
          />
        </motion.div>
      </main>
      
      <footer className="bg-white border-t border-gray-200 mt-12 py-6">
        <div className="container mx-auto px-4">
          <p className="text-center text-gray-600 text-sm">
            © {new Date().getFullYear()} NEWSNearby - Location & Keyword-Based News Aggregator
          </p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;