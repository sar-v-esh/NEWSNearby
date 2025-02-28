import React from 'react';
import { MapPin, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { Location } from '../types';
import Button from './ui/Button';

interface LocationBannerProps {
  location: Location | null;
  permissionStatus: string;
  onRequestLocation: () => void;
}

const LocationBanner: React.FC<LocationBannerProps> = ({
  location,
  permissionStatus,
  onRequestLocation,
}) => {
  if (!location && permissionStatus === 'prompt') {
    return (
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6"
      >
        <div className="flex items-start">
          <MapPin className="text-blue-500 mt-1 mr-3" size={20} />
          <div className="flex-1">
            <h3 className="font-medium text-blue-800">Enable location for local news</h3>
            <p className="text-blue-600 text-sm mt-1 mb-3">
              Allow location access to see news relevant to your area.
            </p>
            <Button
              variant="primary"
              size="sm"
              onClick={onRequestLocation}
              className="mt-1"
            >
              Enable Location
            </Button>
          </div>
        </div>
      </motion.div>
    );
  }

  if (permissionStatus === 'denied') {
    return (
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6"
      >
        <div className="flex items-start">
          <AlertCircle className="text-yellow-500 mt-1 mr-3" size={20} />
          <div>
            <h3 className="font-medium text-yellow-800">Location access denied</h3>
            <p className="text-yellow-600 text-sm mt-1">
              {location
                ? `Using approximate location: ${location.city || location.region || location.country || 'Unknown'}`
                : 'Using global news instead. Enable location in your browser settings for local news.'}
            </p>
          </div>
        </div>
      </motion.div>
    );
  }

  if (location) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6"
      >
        <div className="flex items-start">
          <MapPin className="text-green-500 mt-1 mr-3" size={20} />
          <div>
            <h3 className="font-medium text-green-800">Showing news for your location</h3>
            <p className="text-green-600 text-sm mt-1">
              {location.city ? `${location.city}, ` : ''}
              {location.region ? `${location.region}, ` : ''}
              {location.country || 'Unknown location'}
            </p>
          </div>
        </div>
      </motion.div>
    );
  }

  return null;
};

export default LocationBanner;