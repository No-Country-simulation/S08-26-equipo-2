import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface MediaSettingsState {
  selectedMic: string;
  selectedSpeaker: string;
  selectedCamera: string;
  isCameraActive: boolean;
  isMicActive: boolean;
  setSelectedMic: (id: string) => void;
  setSelectedSpeaker: (id: string) => void;
  setSelectedCamera: (id: string) => void;
  setIsCameraActive: (active: boolean) => void;
  setIsMicActive: (active: boolean) => void;
  toggleCamera: () => void;
  toggleMic: () => void;
}

export const useMediaSettingsStore = create<MediaSettingsState>()(
  persist(
    (set) => ({
      selectedMic: "",
      selectedSpeaker: "default",
      selectedCamera: "",
      isCameraActive: true,
      isMicActive: true,
      setSelectedMic: (selectedMic) => set({ selectedMic }),
      setSelectedSpeaker: (selectedSpeaker) => set({ selectedSpeaker }),
      setSelectedCamera: (selectedCamera) => set({ selectedCamera }),
      setIsCameraActive: (isCameraActive) => set({ isCameraActive }),
      setIsMicActive: (isMicActive) => set({ isMicActive }),
      toggleCamera: () => set((state) => ({ isCameraActive: !state.isCameraActive })),
      toggleMic: () => set((state) => ({ isMicActive: !state.isMicActive })),
    }),
    {
      name: "meetflow-media-settings",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
