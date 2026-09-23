import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useCreateMeeting, useUpdateMeeting } from "./useMeetings";
import type { Meeting } from "../types/meeting";
import {
  createMeetingSchema,
  type CreateMeetingFormData,
} from "../types/meeting.validation";

export interface UseFormMeetingsProps {
  initialData?: Meeting;
  onSuccess?: (meeting: Meeting) => void;
}

export const getTodayDateString = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const getDefaultTimeString = (): string => {
  const now = new Date();
  // Sugerir 15 minutos en el futuro redondeado a multiplo de 5
  now.setMinutes(Math.ceil((now.getMinutes() + 15) / 5) * 5);
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
};

const formatDateForInput = (dateStr?: string | null): string => {
  if (!dateStr) return getTodayDateString();
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
  const parsed = Date.parse(dateStr);
  if (!isNaN(parsed)) {
    const d = new Date(parsed);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }
  return getTodayDateString();
};

const formatTimeForInput = (timeOrIso?: string | null): string => {
  if (!timeOrIso) return getDefaultTimeString();
  if (/^\d{2}:\d{2}$/.test(timeOrIso)) return timeOrIso;
  const parsed = Date.parse(timeOrIso);
  if (!isNaN(parsed)) {
    const d = new Date(parsed);
    const hours = String(d.getHours()).padStart(2, "0");
    const minutes = String(d.getMinutes()).padStart(2, "0");
    return `${hours}:${minutes}`;
  }
  return getDefaultTimeString();
};

const parseDuration = (duration?: string | null): string => {
  if (!duration) return "60";
  const num = duration.match(/\d+/)?.[0];
  return num || "60";
};

export function useFormMeetings({ initialData, onSuccess }: UseFormMeetingsProps = {}) {
  const isEdit = Boolean(initialData?.id);
  const createMutation = useCreateMeeting();
  const updateMutation = useUpdateMeeting();

  const getFormValues = (): CreateMeetingFormData => ({
    title: initialData?.title || initialData?.name || "",
    date: formatDateForInput(initialData?.scheduledStartAt || initialData?.date),
    time: formatTimeForInput(initialData?.scheduledStartAt || initialData?.time),
    duration: parseDuration(
      initialData?.estimatedDurationMinutes
        ? String(initialData.estimatedDurationMinutes)
        : initialData?.duration
    ),
    description: initialData?.description || "",
  });

  const form = useForm<CreateMeetingFormData>({
    defaultValues: getFormValues(),
    resolver: async (values) => {
      const result = createMeetingSchema.safeParse(values);
      if (result.success) {
        return { values: result.data, errors: {} };
      }
      const formErrors: Record<string, { type: string; message: string }> = {};
      for (const issue of result.error.issues) {
        const fieldName = issue.path[0] as string;
        if (!formErrors[fieldName]) {
          formErrors[fieldName] = {
            type: issue.code,
            message: issue.message,
          };
        }
      }
      return { values: {}, errors: formErrors };
    },
  });

  // Sincroniza los campos si cambia initialData
  useEffect(() => {
    if (initialData) {
      form.reset(getFormValues());
    }
  }, [initialData]);

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = form;

  const onSubmit = async (data: CreateMeetingFormData) => {
    try {
      const durationMinutes = parseInt(data.duration, 10) || 60;
      let scheduledStartAt: string | undefined;
      let scheduledEndAt: string | undefined;

      if (data.date && data.time) {
        const start = new Date(`${data.date}T${data.time}:00`);
        if (!isNaN(start.getTime())) {
          scheduledStartAt = start.toISOString();
          const end = new Date(start.getTime() + durationMinutes * 60 * 1000);
          scheduledEndAt = end.toISOString();
        }
      }

      const payload = {
        title: data.title,
        description: data.description || undefined,
        scheduledStartAt,
        scheduledEndAt,
        estimatedDurationMinutes: durationMinutes,
      };

      if (isEdit && initialData?.id) {
        const updatedMeeting = await updateMutation.mutateAsync({
          id: initialData.id,
          payload,
        });
        onSuccess?.(updatedMeeting);
      } else {
        const newMeeting = await createMutation.mutateAsync(payload);
        onSuccess?.(newMeeting);
      }
    } catch (err) {
      console.error(isEdit ? "Error al actualizar la reunión:" : "Error al crear la reunión:", err);
    }
  };

  return {
    form,
    register,
    control,
    watch: form.watch,
    errors,
    setValue,
    onSubmit: handleSubmit(onSubmit),
    isEdit,
    isPending: isEdit ? updateMutation.isPending : createMutation.isPending,
  };
}

export default useFormMeetings;
