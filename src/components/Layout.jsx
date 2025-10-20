import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ModeContext } from "../contexts/ModeContext";
import Navbar from "./Navbar"; // Your RedIron main navbar
import Footer from "./Footer";

export default function Layout({ children }) {
  const { toggleMode } = useContext(ModeContext);
  const navigate = useNavigate();

  const handleModeSwitch = () => {
    const newMode = toggleMode();
    if (newMode === "shop") {
      navigate("/shop");
    } else {
      navigate("/");
    }
  };

  return (
    <div style={{ minHeight: '100vh' }}>
      <Navbar style={{ height: '50px' }} onModeSwitch={handleModeSwitch} />

      {/* Page Content */}
      <main>{children}</main>

      {/* Footer for both modes */}
      <Footer />
    </div>
  );
}
