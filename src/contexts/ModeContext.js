import { createContext, useState } from "react";

export const ModeContext = createContext();

export const ModeProvider = ({ children }) => {
  const [mode, setMode] = useState(localStorage.getItem("mode") || "rediron"); // default mode

  const toggleMode = () => {
    const newMode = mode === "rediron" ? "shop" : "rediron";
    setMode(newMode);
    localStorage.setItem("mode", newMode);
    return newMode;
  };

  return (
    <ModeContext.Provider value={{ mode, setMode, toggleMode }}>
      {children}
    </ModeContext.Provider>
  );
};
