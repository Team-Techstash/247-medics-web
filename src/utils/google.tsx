import React, { useState, useEffect } from 'react';
import { LoadScript, Autocomplete } from '@react-google-maps/api';

type AutoCompleteComponentProps = {
  setLocation: (location: { lat: number; lng: number; city: string; country: string }) => void;
};

let libraries: any = ['places'];

export default function AutoCompleteComponent({ setLocation }: AutoCompleteComponentProps) {
  const [autoCom, setAutoCom] = useState<google.maps.places.Autocomplete | null>(null);
  const [apiKey, setApiKey] = useState<string>('');

  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;
    if (!key) {
      console.error('Google Maps API key is not defined in environment variables');
      return;
    }
    setApiKey(key);
  }, []);

  const onLoad = (autocompleteInstance: google.maps.places.Autocomplete) => {
    setAutoCom(autocompleteInstance);
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

        if (place.address_components) {
          for (const component of place.address_components) {
            if (component.types.includes('locality')) {
              city = component.long_name;
            }
            if (component.types.includes('country')) {
              country = component.long_name;
            }
          }
        }

        setLocation({ lat, lng, city, country });
        console.log('Selected location:', { lat, lng, city, country });
      } else {
        console.log('No geometry found for the selected place');
      }
    } else {
      console.log('Autocomplete is not loaded yet!');
    }
  };

  if (!apiKey) {
    return (
      <input
        className="block w-full border rounded-lg 2xl:rounded-2xl px-4 py-2 2xl:px-6 2xl:py-4 hover:bg-primary/[.1] outline-0 text-sm 2xl:text-lg"
        type="search"
        placeholder="Enter your city"
        aria-label="Search"
        disabled
      />
    );
  }

  return (
    <LoadScript
      googleMapsApiKey={apiKey}
      libraries={libraries}
    >
      <Autocomplete
        onLoad={onLoad}
        onPlaceChanged={onPlaceChanged}
        options={{
          types: ['(cities)'],
          fields: ['address_components', 'geometry', 'formatted_address'],
        }}
      >
        <input
          className="block w-full border rounded-lg 2xl:rounded-2xl px-4 py-2 2xl:px-6 2xl:py-4 hover:bg-primary/[.1] outline-0 text-sm 2xl:text-lg"
          type="search"
          placeholder="Enter your city"
          aria-label="Search"
        />
      </Autocomplete>
    </LoadScript>
  );
}
