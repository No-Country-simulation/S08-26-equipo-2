import { useState } from 'react';
import type { Meeting, Screen } from '../types/meeting';
import { MeetingForm } from '../components/form/MeetingForm';
import { MeetingSuccess } from '../components/form/MeetingSuccess';

export interface EditMeetingScreenProps {
  meeting: Meeting;
  onNav?: (screen: Screen) => void;
}

type Step = 'form' | 'success';

export default function EditMeetingScreen({
  meeting,
  onNav,
}: EditMeetingScreenProps) {
  const [step, setStep] = useState<Step>('form');
  const [updatedMeeting, setUpdatedMeeting] = useState<Meeting | null>(null);

  const handleSuccess = (m: Meeting) => {
    setUpdatedMeeting(m);
    setStep('success');
  };

  if (step === 'success' && updatedMeeting) {
    return <MeetingSuccess meeting={updatedMeeting} isEdit={true} onNav={onNav} />;
  }

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h1
            className="text-xl font-bold text-foreground"
            style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
          >
            Editar reunión
          </h1>
          <p className="text-sm mt-1 text-muted-foreground">
            Modifica los datos de la reunión programada
          </p>
        </div>

        <MeetingForm initialData={meeting} onSuccess={handleSuccess} />
      </div>
    </div>
  );
}

export { EditMeetingScreen };
