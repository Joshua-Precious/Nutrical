import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface CommonState {
    theme: 'light' | 'dark' | 'system';
    setTheme: (theme: 'light' | 'dark' | 'system') => void;
    isDarkMode: boolean;
    toggleDarkMode: () => void;
}

export const useCommonStore = create<CommonState>()(
    persist((set) => ({
        theme: 'system',
        setTheme: (theme) => set({theme}),
        isDarkMode: false,
        toggleDarkMode: () =>
            set((state) => ({isDarkMode: !state.isDarkMode})),
    }),
    {
        name: 'common-storage',
        storage: createJSONStorage(() => AsyncStorage),
    }),
);