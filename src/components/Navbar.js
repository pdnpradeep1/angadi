import React from "react";
import { useTheme } from "./ThemeProvider";
// import "../styles/theme.css"; // Import CSS file

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    // <nav className="p-4 bg-white dark:bg-gray-800 text-black dark:text-white">
    //   <h1>My App</h1>
    //   <button
    //     onClick={toggleTheme}
    //     className="px-4 py-2 bg-gray-600 rounded"
    //   >
    //     {theme === "light" ? "🌙 Dark Mode" : "☀️ Light Mode"}
    //   </button>
    // </nav>
    <nav className="p-4 bg-white dark:bg-gray-800 text-black dark:text-white flex justify-between">
      <h1>My App</h1>
      <button
        onClick={toggleTheme}
        className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-black dark:text-white rounded"
      >
        {theme === "light" ? "🌙 Dark Mode" : "☀️ Light Mode"}
      </button>
    </nav>
  );
};

export default Navbar;
