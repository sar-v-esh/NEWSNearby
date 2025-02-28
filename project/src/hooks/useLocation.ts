import { useState, useEffect } from 'react';
import { Location, LocationState } from '../types';
import { getUserLocation, getIPBasedLocation, fetchLocationData, fetchNewsByLocation } from '../utils/api';

export const useLocation = (): LocationState & { news: any[] } => {
  const [state, setState] = useState<LocationState>({
    data: null,
    loading: true,
    error: null,
    permissionStatus: 'prompt',
  });

  const [news, setNews] = useState<any[]>([]);

  useEffect(() => {
    const getLocation = async () => {
      try {
        const storedPermission = localStorage.getItem('locationPermission');

        if (!storedPermission) {
          setState((prev) => ({ ...prev, permissionStatus: 'prompt' }));
        } else if (storedPermission === 'denied') {
          setState((prev) => ({ ...prev, permissionStatus: 'denied', loading: true }));
          const ipLocation = await getIPBasedLocation();
          setState({
            data: ipLocation,
            loading: false,
            error: null,
            permissionStatus: 'denied',
          });

          // ✅ Fetch news and update state
          fetchNewsByLocation(ipLocation).then(setNews);
          return;
        }

        setState((prev) => ({ ...prev, loading: true }));

        try {
          const position = await getUserLocation();
          const { latitude, longitude } = position.coords;
          const locationData = await fetchLocationData(latitude, longitude);

          setState({
            data: locationData,
            loading: false,
            error: null,
            permissionStatus: 'granted',
          });

          localStorage.setItem('locationPermission', 'granted');

          // ✅ Fetch news and update state
          fetchNewsByLocation(locationData).then(setNews);
        } catch (error) {
          localStorage.setItem('locationPermission', 'denied');
          const ipLocation = await getIPBasedLocation();
          setState({
            data: ipLocation,
            loading: false,
            error: null,
            permissionStatus: 'denied',
          });

          // ✅ Fetch news and update state
          fetchNewsByLocation(ipLocation).then(setNews);
        }
      } catch (error) {
        setState({
          data: null,
          loading: false,
          error: 'Failed to determine location',
          permissionStatus: 'unavailable',
        });
      }
    };

    getLocation();
  }, []);

  return { ...state, news }; // ✅ Now returns both location & news
};
