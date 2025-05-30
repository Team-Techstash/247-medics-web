import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AppointmentFormData {
  age: number | null;
  isForSelf: boolean;
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
  age: null,
  isForSelf: true,
  country: '',
  city: '',
  serviceType: '',
  firstName: '',
  lastName: '',
  pronouns: '',
  gender: '',
  email: '',
  visitType: 'urgent-care',
  appointmentMode: 'video',
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
