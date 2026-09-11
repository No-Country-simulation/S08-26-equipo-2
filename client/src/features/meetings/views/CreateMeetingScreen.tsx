import { useState } from 'react';
import type { Meeting, Screen } from '../types/meeting';
import { CreateMeetingForm } from '../components/form/CreateMeetingForm';
import { MeetingCreatedSuccess } from '../components/form/MeetingCreatedSuccess';

export interface CreateMeetingScreenProps {
  onNav?: (screen: Screen) => void;
}

type Step = 'form' | 'created';

export default function CreateMeetingScreen({ onNav }: CreateMeetingScreenProps) {
  const [step, setStep] = useState<Step>('form');
  const [createdMeeting, setCreatedMeeting] = useState<Meeting | null>(null);

  const handleSuccess = (meeting: Meeting) => {
    setCreatedMeeting(meeting);
    setStep('created');
  };

  if (step === 'created' && createdMeeting) {
    return <MeetingCreatedSuccess meeting={createdMeeting} onNav={onNav} />;
  }

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h1
            className="text-xl font-bold text-foreground"
            style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
          >
            Crear nueva reunión
          </h1>
          <p className="text-sm mt-1 text-muted-foreground">
            Completa los datos para programar tu reunión
          </p>
        </div>

        <CreateMeetingForm onSuccess={handleSuccess} />
      </div>
    </div>
  );
}

export { CreateMeetingScreen };
