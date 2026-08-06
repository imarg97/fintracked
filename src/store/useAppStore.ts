import { create } from 'zustand';

interface AppState {
  isPrivacyMode: boolean;
  togglePrivacyMode: () => void;
  userName: string;
  setUserName: (name: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
  isPrivacyMode: false,
  togglePrivacyMode: () => set((state) => ({ isPrivacyMode: !state.isPrivacyMode })),
  userName: 'Anu',
  setUserName: (name: string) => set({ userName: name }),
}));
