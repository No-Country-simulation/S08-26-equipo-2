import { useForm } from "react-hook-form";
import { useCreateMeeting } from "./useMeetings";
import type { Meeting } from "../types/meeting";
import {
  createMeetingSchema,
  type CreateMeetingFormData,
} from "../types/meeting.validation";

export interface UseFormMeetingsProps {
  onSuccess?: (meeting: Meeting) => void;
}

export function useFormMeetings({ onSuccess }: UseFormMeetingsProps = {}) {
  const createMutation = useCreateMeeting();

  const form = useForm<CreateMeetingFormData>({
    defaultValues: {
      name: "",
      date: new Date().toISOString().split("T")[0],
      time: "10:00",
      duration: "60",
      description: "",
      participants: "",
      access: "link",
      approval: true,
    },
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
      const newMeeting = await createMutation.mutateAsync({
        name: data.name,
        date: data.date,
        time: data.time,
        duration: data.duration,
        description: data.description,
        participants: data.participants
          ? data.participants.split(",").length
          : 1,
      });
      onSuccess?.(newMeeting);
    } catch (err) {
      console.error("Error al crear la reunión:", err);
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
    isPending: createMutation.isPending,
  };
}

export default useFormMeetings;
