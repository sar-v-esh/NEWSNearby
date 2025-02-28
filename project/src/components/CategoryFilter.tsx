import React from 'react';
import { motion } from 'framer-motion';
import { Category } from '../types';
import { Newspaper, Briefcase, Tv, Activity, Globe, Lightbulb, Users } from 'lucide-react';

interface CategoryFilterProps {
  selectedCategory: string | null;
  onSelectCategory: (category: string | null) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  const categories: Category[] = [
    { id: 'all', name: 'All', icon: 'Globe' },
    { id: 'Business', name: 'Business', icon: 'Briefcase' },
    { id: 'Technology', name: 'Technology', icon: 'Lightbulb' },
    { id: 'Entertainment', name: 'Entertainment', icon: 'Tv' },
    { id: 'Sports', name: 'Sports', icon: 'Activity' },
    { id: 'Health', name: 'Health', icon: 'Activity' },
    { id: 'Politics', name: 'Politics', icon: 'Users' },
    { id: 'Science', name: 'Science', icon: 'Lightbulb' },
  ];

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Globe':
        return <Globe size={18} />;
      case 'Briefcase':
        return <Briefcase size={18} />;
      case 'Lightbulb':
        return <Lightbulb size={18} />;
      case 'Tv':
        return <Tv size={18} />;
      case 'Activity':
        return <Activity size={18} />;
      case 'Users':
        return <Users size={18} />;
      default:
        return <Newspaper size={18} />;
    }
  };

  return (
    <div className="mb-6 overflow-x-auto">
      <div className="flex space-x-2 pb-2">
        {categories.map((category) => (
          <motion.button
            key={category.id}
            className={`flex items-center px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
              (selectedCategory === category.id) || (selectedCategory === null && category.id === 'all')
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }`}
            onClick={() => onSelectCategory(category.id === 'all' ? null : category.id)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="mr-2">{getIcon(category.icon)}</span>
            {category.name}
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;