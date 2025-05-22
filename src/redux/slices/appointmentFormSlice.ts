import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AppointmentFormData {
  age: number;
  isForSelf: boolean;
  status: string;
  country: string;
  city: string;
  serviceType: string;
  firstName: string;
  lastName: string;
  pronouns: string;
  gender:string,
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
  firstName: '',
  lastName: '',
  pronouns: '',
  gender: '',
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
