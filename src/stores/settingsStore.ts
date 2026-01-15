import { create } from 'zustand';
import type { Settings, Theme } from '../types';

interface SettingsStore extends Settings {
  setTheme: (theme: Theme) => void;
  setAccentColor: (color: string) => void;
  setWallpaper: (wallpaper: string) => void;
  toggleTheme: () => void;
}

const defaultSettings: Settings = {
  theme: 'light',
  accentColor: '#007aff',
  wallpaper: 'gradient-1',
  dockPosition: 'bottom',
  iconSize: 'medium',
};

export const useSettingsStore = create<SettingsStore>((set, get) => ({
  ...defaultSettings,

  setTheme: (theme: Theme) => {
    document.documentElement.setAttribute('data-theme', theme);
    set({ theme });
  },

  setAccentColor: (color: string) => {
    document.documentElement.style.setProperty('--color-primary', color);
    set({ accentColor: color });
  },

  setWallpaper: (wallpaper: string) => {
    set({ wallpaper });
  },

  toggleTheme: () => {
    const newTheme = get().theme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', newTheme);
    set({ theme: newTheme });
  },
}));
