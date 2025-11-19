import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useThemeStore = create(
  persist(
    (set) => ({
      mode: 'light',
      primaryColor: '#667eea',
      secondaryColor: '#764ba2',
      toggleMode: () => set((state) => ({ 
        mode: state.mode === 'light' ? 'dark' : 'light' 
      })),
      setMode: (mode) => set({ mode }),
      setPrimaryColor: (color) => set({ primaryColor: color }),
      setSecondaryColor: (color) => set({ secondaryColor: color }),
    }),
    {
      name: 'theme-storage',
    }
  )
);

export default useThemeStore;