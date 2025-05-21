import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AppointmentFormData {
  age: number;
  isForSelf: boolean;
  status: string;
  country: string;
  city: string;
  serviceType: string;
  fname: string;
  lname: string;
  sex: string;
  pronouns: string;
  email: string;
  visitType: string;
  appointmentMode: string;
  reason: string;
}

const initialState: AppointmentFormData = {
  age: 0,
  isForSelf: true,
  status: 'requested',
  country: 'UK',
  city: '',
  serviceType: '',
  fname: '',
  lname: '',
  sex: '',
  pronouns: '',
  email: '',
  visitType: 'urgent-care',
  appointmentMode: 'Video',
  reason: '',
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
