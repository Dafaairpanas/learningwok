import { useStore } from '@nanostores/react';
import { Sun, Moon } from 'lucide-react';
import { themeStore, toggleTheme, initTheme } from '../../stores/themeStore';
import { useEffect } from 'react';

export default function ThemeToggle() {
  const theme = useStore(themeStore);

  useEffect(() => {
    initTheme();
  }, []);

  return (
    <button
      onClick={toggleTheme}
      className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-gray-600 transition-all duration-200 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-accent/50 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
      aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
    >
      <Sun 
        className={`absolute h-5 w-5 transition-all duration-300 ${
          theme === 'light' ? 'rotate-0 scale-100' : 'rotate-90 scale-0'
        }`} 
      />
      <Moon 
        className={`absolute h-5 w-5 transition-all duration-300 ${
          theme === 'dark' ? 'rotate-0 scale-100' : '-rotate-90 scale-0'
        }`} 
      />
    </button>
  );
}
