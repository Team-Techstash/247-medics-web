'use client'
import { useState, useEffect } from "react";
import CreateAppointment from "../components/Registration";
import MainLayout from "../layouts/MainLayout";
import { appointmentsService } from "@/api/services/service";
import { showToast } from '../../utils/toast';
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch, useSelector } from 'react-redux';
import { resetAppointmentForm } from '@/redux/slices/appointmentFormSlice';
import { setLocationStart } from '@/redux/slices/locationSlice';
import { RootState } from '@/redux/store';

export default function CreateAppointmentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const location = useSelector((state: RootState) => state.location);

  useEffect(() => {
    if (location.status === 'failed') {
      dispatch(setLocationStart());
    }
  }, [dispatch, location.status]);

  const handleSubmit = async (data: any) => {
    setIsLoading(true);
    console.log(data)

    try {
      const response = await appointmentsService.create(data);
      if (response && response.success) {
        showToast.success("Appointment created successfully!");
        console.log(response)
        dispatch(resetAppointmentForm());
        router.push(`/find?id=${response.data._id}`);
      } else {
        showToast.error(response.message || "Failed to create appointment.");
      }
    } catch (err: any) {
      showToast.error(err.message || "Failed to create appointment.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MainLayout>
      <CreateAppointment onSubmit={handleSubmit} />
    </MainLayout>
  );
}

