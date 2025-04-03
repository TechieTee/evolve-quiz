import { useAppStore } from "../store/useStore";

const ThemeToggle = () => {
  const { darkMode, toggleDarkMode } = useAppStore();
  return <button onClick={toggleDarkMode}>{darkMode ? "🌙" : "☀️"}</button>;
};
export default ThemeToggle;