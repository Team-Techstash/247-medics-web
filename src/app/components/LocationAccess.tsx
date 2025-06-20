
'use client'; // For Next.js App Router (if you're using App Router)

import { useEffect } from 'react';

const LocationAccess = () => {
  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log('User allowed location:', position.coords);
          // You can save to state, send to backend, etc.
        },
        (error) => {
          console.warn('User denied location:', error.message);
        }
      );
    } else {
      console.error('Geolocation not supported');
    }
  }, []);

  return null; // or some message like "Getting your location..."
};

export default LocationAccess;
