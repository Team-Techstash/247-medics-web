import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AppointmentFormData {
  isForSelf: boolean | null;
  age: number | null;
  reason: string;
  country: string;
  city: string;
  serviceType: string;
  firstName: string;
  lastName: string;
  gender: string;
  pronouns: string;
  email: string;
  visitType: string;
  appointmentMode: string;
  formattedAddress: string;
  location: {
    coordinates: [number, number];
  };
}

const initialState: AppointmentFormData = {
  isForSelf: null,
  age: null,
  reason: '',
  country: '',
  city: '',
  serviceType: '',
  firstName: '',
  lastName: '',
  gender: '',
  pronouns: '',
  email: '',
  visitType: 'urgent-care',
  appointmentMode: 'video',
  formattedAddress: '',
  location: {
    coordinates: [0, 0],
  },
};

const appointmentFormSlice = createSlice({
  name: 'appointmentForm',
  initialState,
  reducers: {
    setAppointmentForm(state, action: PayloadAction<Partial<AppointmentFormData>>) {
      return { ...state, ...action.payload };
    },
    resetAppointmentForm() {
      return initialState;
    },
  },
});

export const { setAppointmentForm, resetAppointmentForm } = appointmentFormSlice.actions;
export default appointmentFormSlice.reducer;
