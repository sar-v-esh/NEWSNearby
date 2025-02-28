import React from 'react';
import { motion } from 'framer-motion';
import { Newspaper } from 'lucide-react';
import SearchBar from './ui/SearchBar';

interface HeaderProps {
  onSearch: (query: string) => void;
}

const Header: React.FC<HeaderProps> = ({ onSearch }) => {
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <motion.div
            className="flex items-center"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Newspaper className="text-blue-600 mr-2" size={28} />
            <h1 className="text-2xl font-bold text-gray-800">NEWSNearby</h1>
          </motion.div>
          
          <motion.div
            className="w-full md:w-1/2 lg:w-2/5"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <SearchBar onSearch={onSearch} />
          </motion.div>
        </div>
      </div>
    </header>
  );
};

export default Header;