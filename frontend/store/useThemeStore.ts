"use client";
import { create } from "zustand";
interface ThemeStore {
  theme: string;
  setTheme: (theme: string) => void;
  loadTheme: () => void;
}
export const useThemeStore = create<ThemeStore>((set) => ({
  theme: "coffee",

  setTheme: (theme: string) => {
    localStorage.setItem("chat-theme", theme);
    set({ theme });
  },


  loadTheme: () => {
    const savedTheme = localStorage.getItem("chat-theme");
    if (savedTheme) {
      set({ theme: savedTheme });
    }
  }
}));