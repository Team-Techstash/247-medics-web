'use client'; // For Next.js App Router (if you're using App Router)

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  setLocationStart,
  setLocationSuccess,
  setLocationFailure,
} from '@/redux/slices/locationSlice';
import { RootState } from '@/redux/store';

const LocationAccess = () => {
  const dispatch = useDispatch();
  const locationStatus = useSelector((state: RootState) => state.location.status);

  useEffect(() => {
    const getLocation = async () => {
      // Only fetch if location status is idle
      if (locationStatus !== 'idle') {
        return;
      }

      dispatch(setLocationStart());
      
      if ('geolocation' in navigator) {
        try {
          const position: GeolocationPosition = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, {
              timeout: 10000,
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
      } else {
        console.error('Geolocation not supported');
        dispatch(setLocationFailure('Geolocation is not supported.'));
        console.log('Geolocation is not supported by your browser.');
      }
    };
    
    getLocation();
  }, [dispatch, locationStatus]);

  return null;
};

export default LocationAccess;
