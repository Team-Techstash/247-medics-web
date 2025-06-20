"use client";

import { useState, useEffect } from 'react';

interface UserLocation {
  latitude: number;
  longitude: number;
  city?: string;
  country?: string;
  countryCode?: string;
}

export const useUserLocation = () => {
  const [location, setLocation] = useState<UserLocation | null>(null);

  useEffect(() => {
    const storedLocation = localStorage.getItem('userLocation');
    if (storedLocation) {
      try {
        setLocation(JSON.parse(storedLocation));
      } catch (error) {
        console.error("Failed to parse stored location:", error);
      }
    }
  }, []);
  
  const getLocation = (): UserLocation | null => {
    const storedLocation = localStorage.getItem('userLocation');
    if (storedLocation) {
      try {
        return JSON.parse(storedLocation);
      } catch (error) {
        console.error("Failed to parse stored location:", error);
        return null;
      }
    }
    return null;
  };

  return { location, getLocation };
}; 