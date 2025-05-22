// src/utils/toast.ts
import { toast } from 'react-hot-toast';

const toastSuccess = (message: string) => toast.success(message);

export const showToast = {
  success: toastSuccess,
  error: (msg: string) => toast.error(msg),
  loading: (msg: string) => toast.loading(msg),
};

