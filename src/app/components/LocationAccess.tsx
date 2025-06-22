'use client'; // For Next.js App Router (if you're using App Router)

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { usePathname } from 'next/navigation';
import {
  setLocationStart,
  setLocationSuccess,
  setLocationFailure,
} from '@/redux/slices/locationSlice';
import { RootState } from '@/redux/store';

const LocationAccess = () => {
  const dispatch = useDispatch();
  const locationStatus = useSelector((state: RootState) => state.location.status);
  const pathname = usePathname();
  const [hasRequestedOnPage, setHasRequestedOnPage] = useState(false);

  const getLocation = async () => {
    if (!('geolocation' in navigator)) {
      dispatch(setLocationFailure('Geolocation is not supported by your browser.'));
      return;
    }

    dispatch(setLocationStart());
    
    try {
      const position: GeolocationPosition = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          timeout: 10000,
          enableHighAccuracy: true,
        });
      });

      const { latitude, longitude } = position.coords;

      try {
        const response = await fetch(
          `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
        );
        const data = await response.json();
        
        const locationData = {
          latitude,
          longitude,
          city: data.city || null,
          country: data.countryName || null,
          countryCode: data.countryCode || null,
        };

        dispatch(setLocationSuccess(locationData));
        console.log(`Location set to ${data.city}, ${data.countryName}`);
      } catch (geoError) {
        console.error("Error fetching location details:", geoError);
        // Dispatch with coordinates even if reverse geocoding fails
        dispatch(setLocationSuccess({ latitude, longitude, city: null, country: null, countryCode: null }));
      }
    } catch (error: any) {
      console.warn('User denied location:', error.message);
      dispatch(setLocationFailure('Location access was denied.'));
      console.log('Location access was denied.');
    }
  };

  useEffect(() => {
    // Initial location request when status is idle
    if (locationStatus === 'idle') {
      getLocation();
    }
  }, [locationStatus]);

  // Try to request location again when user visits create-appointment page
  useEffect(() => {
    if (pathname === '/create-appointment' && locationStatus === 'failed' && !hasRequestedOnPage) {
      setHasRequestedOnPage(true);
      console.log('Attempting to request location again on create-appointment page...');
      getLocation();
    }
  }, [pathname, locationStatus, hasRequestedOnPage]);

  // Show simple message if location is still failed after trying on create-appointment page
  if (pathname === '/create-appointment' && locationStatus === 'failed' && hasRequestedOnPage) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            <span className="text-yellow-600">📍</span>
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-medium text-yellow-900 mb-1">
              Location Access Needed
            </h3>
            <p className="text-sm text-yellow-700">
              Please enable location access in your browser settings to get better service. 
              You can still continue without location.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default LocationAccess;
