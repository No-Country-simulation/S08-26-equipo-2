import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Meeting, Screen } from '../types/meeting';
import { MeetingForm } from '../components/form/MeetingForm';
import { MeetingSuccess } from '../components/form/MeetingSuccess';

export interface CreateMeetingScreenProps {
  onNav?: (screen: Screen) => void;
}

type Step = 'form' | 'created';

export default function CreateMeetingScreen({ onNav }: CreateMeetingScreenProps) {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>('form');
  const [createdMeeting, setCreatedMeeting] = useState<Meeting | null>(null);

  const handleNav = (screen: Screen) => {
    if (onNav) {
      onNav(screen);
      return;
    }
    if (screen === 'dashboard' || screen === 'history') {
      navigate('/meetings');
    } else if (screen === 'video-room') {
      navigate('/livekit');
    }
  };

  const handleSuccess = (meeting: Meeting) => {
    setCreatedMeeting(meeting);
    setStep('created');
  };

  if (step === 'created' && createdMeeting) {
    return <MeetingSuccess meeting={createdMeeting} isEdit={false} onNav={handleNav} />;
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

        <MeetingForm onSuccess={handleSuccess} />
      </div>
    </div>
  );
}

export { CreateMeetingScreen };
