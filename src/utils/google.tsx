import React, { useState, useEffect } from 'react';
import { LoadScript, Autocomplete } from '@react-google-maps/api';

type AutoCompleteComponentProps = {
  setLocation: (location: { lat: number; lng: number; city: string; country: string; formattedAddress: string }) => void;
  currentCity?: string;
  currentFormattedAddress?: string;
};

const libraries: ("places")[] = ["places"];

export default function AutoCompleteComponent({ setLocation, currentCity, currentFormattedAddress }: AutoCompleteComponentProps) {
  const [autoCom, setAutoCom] = useState<google.maps.places.Autocomplete | null>(null);
  const [apiKey, setApiKey] = useState<string>('');
  const [inputValue, setInputValue] = useState<string>(currentFormattedAddress || currentCity || '');
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);

  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;
    if (!key) {
      console.error('Google Maps API key is not defined in environment variables');
      return;
    }
    setApiKey(key);

    // Check if Google Maps API is already loaded
    if (window.google && window.google.maps && window.google.maps.places) {
      setIsScriptLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (currentFormattedAddress) {
      setInputValue(currentFormattedAddress);
    } else if (currentCity) {
      setInputValue(currentCity);
    }
  }, [currentCity, currentFormattedAddress]);

  const onLoad = (autocompleteInstance: google.maps.places.Autocomplete) => {
    setAutoCom(autocompleteInstance);
  };

  const onScriptLoad = () => {
    setIsScriptLoaded(true);
  };

  const onScriptError = (error: Error) => {
    console.error('Error loading Google Maps API:', error);
  };

  const onPlaceChanged = () => {
    if (autoCom) {
      const place = autoCom.getPlace();

      if (place.geometry && place.geometry.location) {
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();

        // Get city and country from address components
        let city = '';
        let country = '';
        let formattedAddress = place.formatted_address || '';

        if (place.address_components) {
          for (const component of place.address_components) {
            // Only get the city name without state/country
            if (component.types.includes('locality')) {
              city = component.long_name;
            }
            // Get the country name
            if (component.types.includes('country')) {
              country = component.long_name;
            }
          }
        }

        // If we couldn't find a city, try to extract it from the formatted address
        if (!city && formattedAddress) {
          const addressParts = formattedAddress.split(',');
          if (addressParts.length > 0) {
            city = addressParts[0].trim();
          }
        }

        setInputValue(formattedAddress);
        setLocation({ lat, lng, city, country, formattedAddress });
        console.log('Selected location:', { lat, lng, city, country, formattedAddress });
      } else {
        console.log('No geometry found for the selected place');
      }
    } else {
      console.log('Autocomplete is not loaded yet!');
    }
  };

  const renderInput = () => (
    <input
      className="block w-full border rounded-lg 2xl:rounded-2xl px-4 py-2 2xl:px-6 2xl:py-4 hover:bg-primary/[.1] outline-0 text-sm 2xl:text-lg"
      type="search"
      placeholder="Enter your city"
      aria-label="Search"
      value={inputValue}
      onChange={(e) => setInputValue(e.target.value)}
    />
  );

  if (!apiKey) {
    return (
      <input
        className="block w-full border rounded-lg 2xl:rounded-2xl px-4 py-2 2xl:px-6 2xl:py-4 hover:bg-primary/[.1] outline-0 text-sm 2xl:text-lg"
        type="search"
        placeholder="Enter your city"
        aria-label="Search"
        disabled
        value={inputValue}
      />
    );
  }

  return (
    <LoadScript
      googleMapsApiKey={apiKey}
      libraries={libraries}
      onLoad={onScriptLoad}
      onError={onScriptError}
    >
      <Autocomplete
        onLoad={onLoad}
        onPlaceChanged={onPlaceChanged}
        options={{
          types: ['(cities)'],
          fields: ['address_components', 'geometry', 'formatted_address'],
        }}
      >
        {renderInput()}
      </Autocomplete>
    </LoadScript>
  );
}
