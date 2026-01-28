import { atom, onMount } from 'nanostores';

export type Theme = 'light' | 'dark';

export const themeStore = atom<Theme>('light');

// Initialize theme on mount (client-side only)
export function initTheme() {
  if (typeof window === 'undefined') return;
  
  const stored = localStorage.getItem('theme') as Theme | null;
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = stored || (systemPrefersDark ? 'dark' : 'light');
  
  themeStore.set(theme);
  applyTheme(theme);
  
  // Listen for system preference changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
      const newTheme = e.matches ? 'dark' : 'light';
      themeStore.set(newTheme);
      applyTheme(newTheme);
    }
  });
}

// Apply theme to document
function applyTheme(theme: Theme) {
  if (typeof document === 'undefined') return;
  
  document.documentElement.classList.remove('light', 'dark');
  document.documentElement.classList.add(theme);
}

// Toggle theme
export function toggleTheme() {
  const current = themeStore.get();
  const next = current === 'light' ? 'dark' : 'light';
  
  themeStore.set(next);
  localStorage.setItem('theme', next);
  applyTheme(next);
}

// Set specific theme
export function setTheme(theme: Theme) {
  themeStore.set(theme);
  localStorage.setItem('theme', theme);
  applyTheme(theme);
}
