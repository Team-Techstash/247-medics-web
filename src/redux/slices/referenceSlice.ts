import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { referenceService } from '@/api/services/service';

interface ReferenceItem {
  id: number;
  code: string;
  name: string;
}

interface ReferenceData {
  VISIT_TYPES: { [key: string]: ReferenceItem };
  APPOINTMENT_STATUSES: { [key: string]: ReferenceItem };
  SERVICE_TYPES: { [key: string]: ReferenceItem };
  APPOINTMENT_MODES: { [key: string]: ReferenceItem };
  PAYMENT_STATUSES: { [key: string]: ReferenceItem };
}

interface ReferenceState {
  data: ReferenceData | null;
  loading: boolean;
  error: string | null;
}

const initialState: ReferenceState = {
  data: null,
  loading: false,
  error: null,
};

export const fetchReferences = createAsyncThunk<ReferenceData>(
  'references/fetchReferences',
  async () => {
    const response = await referenceService.getReferences();
    return response.data;
  }
);

const referenceSlice = createSlice({
  name: 'references',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchReferences.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReferences.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchReferences.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch references';
      });
  },
});

// Selectors
export const selectServiceTypes = (state: { references: ReferenceState }) => 
  state.references.data?.SERVICE_TYPES || {};
export const selectVisitTypes = (state: { references: ReferenceState }) => 
  state.references.data?.VISIT_TYPES || {};
export const selectAppointmentStatuses = (state: { references: ReferenceState }) => 
  state.references.data?.APPOINTMENT_STATUSES || {};
export const selectAppointmentModes = (state: { references: ReferenceState }) => 
  state.references.data?.APPOINTMENT_MODES || {};
export const selectPaymentStatuses = (state: { references: ReferenceState }) => 
  state.references.data?.PAYMENT_STATUSES || {};
export const selectReferencesLoading = (state: { references: ReferenceState }) => 
  state.references.loading;
export const selectReferencesError = (state: { references: ReferenceState }) => 
  state.references.error;

export default referenceSlice.reducer; 