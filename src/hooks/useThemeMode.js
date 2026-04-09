import { useEffect, useState } from "react";

const THEME_STORAGE_KEY = "edulib-theme";
const themes = {
  light: "light",
  dark: "dark",
};

const getInitialTheme = () => {
  if (typeof window === "undefined") return themes.dark;

  const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
  if (storedTheme === themes.light || storedTheme === themes.dark) {
    return storedTheme;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? themes.dark
    : themes.light;
};

const useThemeMode = () => {
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("theme-dark", theme === themes.dark);
    root.classList.toggle("theme-light", theme === themes.light);
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((current) => (current === themes.dark ? themes.light : themes.dark));
  };

  return {
    theme,
    toggleTheme,
    isDark: theme === themes.dark,
  };
};

export default useThemeMode;
