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

const formatDateForInput = (dateStr?: string): string => {
  if (!dateStr) return new Date().toISOString().split("T")[0];
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
  const parsed = Date.parse(dateStr);
  if (!isNaN(parsed)) {
    return new Date(parsed).toISOString().split("T")[0];
  }
  return new Date().toISOString().split("T")[0];
};

const parseDuration = (duration?: string): string => {
  if (!duration) return "60";
  const num = duration.match(/\d+/)?.[0];
  return num || "60";
};

const formatParticipantsForInput = (
  participants?: string[] | number
): string => {
  if (!participants) return "";
  if (Array.isArray(participants)) {
    return participants.join(", ");
  }
  return "";
};

const parseParticipants = (input?: string): string[] => {
  if (!input) return [];
  return input
    .split(",")
    .map((email) => email.trim())
    .filter(Boolean);
};

export function useFormMeetings({ initialData, onSuccess }: UseFormMeetingsProps = {}) {
  const isEdit = Boolean(initialData?.id);
  const createMutation = useCreateMeeting();
  const updateMutation = useUpdateMeeting();

  const getFormValues = (): CreateMeetingFormData => ({
    name: initialData?.name || "",
    date: formatDateForInput(initialData?.date),
    time: initialData?.time || "10:00",
    duration: parseDuration(initialData?.duration),
    description: initialData?.description || "",
    participants: formatParticipantsForInput(initialData?.participants),
    access: "link",
    approval: true,
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
    watch,
    setValue,
    control,
    formState: { errors },
  } = form;

  const selectedAccess = watch("access");

  const onSubmit = async (data: CreateMeetingFormData) => {
    try {
      const participantsList = parseParticipants(data.participants);

      if (isEdit && initialData?.id) {
        const updatedMeeting = await updateMutation.mutateAsync({
          id: initialData.id,
          data: {
            name: data.name,
            date: data.date,
            time: data.time,
            duration: data.duration,
            description: data.description,
            participants: participantsList,
          },
        });
        onSuccess?.(updatedMeeting);
      } else {
        const newMeeting = await createMutation.mutateAsync({
          name: data.name,
          date: data.date,
          time: data.time,
          duration: data.duration,
          description: data.description,
          participants: participantsList,
        });
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
    errors,
    setValue,
    watch,
    handleSubmit,
    onSubmit: handleSubmit(onSubmit),
    selectedAccess,
    isEdit,
    isPending: isEdit ? updateMutation.isPending : createMutation.isPending,
  };
}

export default useFormMeetings;
