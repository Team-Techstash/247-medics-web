// src/utils/toast.ts
import { toast } from 'react-hot-toast';

const toastSuccess = (message: string) => toast.success(message);
const toastError = (message: string) => toast.error(message);
const toastLoading = (message: string) => toast.loading(message);

export const showToast = {
  success: toastSuccess,
  error: toastError,
  loading: toastLoading,
};
