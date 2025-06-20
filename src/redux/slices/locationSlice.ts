import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface LocationState {
  latitude: number | null;
  longitude: number | null;
  city: string | null;
  country: string | null;
  countryCode: string | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: LocationState = {
  latitude: null,
  longitude: null,
  city: null,
  country: null,
  countryCode: null,
  status: 'idle',
  error: null,
};

const locationSlice = createSlice({
  name: 'location',
  initialState,
  reducers: {
    setLocationStart(state) {
      state.status = 'loading';
    },
    setLocationSuccess(state, action: PayloadAction<Omit<LocationState, 'status' | 'error'>>) {
      state.latitude = action.payload.latitude;
      state.longitude = action.payload.longitude;
      state.city = action.payload.city;
      state.country = action.payload.country;
      state.countryCode = action.payload.countryCode;
      state.status = 'succeeded';
      state.error = null;
    },
    setLocationFailure(state, action: PayloadAction<string>) {
      state.status = 'failed';
      state.error = action.payload;
    },
  },
});

export const { setLocationStart, setLocationSuccess, setLocationFailure } = locationSlice.actions;

export default locationSlice.reducer; 