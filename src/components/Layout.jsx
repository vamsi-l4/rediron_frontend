import React, { useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ModeContext } from "../contexts/ModeContext";
import Navbar from "./Navbar"; // Your RedIron main navbar
import Footer from "./Footer";

export default function Layout({ children }) {
  const { toggleMode } = useContext(ModeContext);
  const navigate = useNavigate();
  const location = useLocation();
  const isShopRoute = location.pathname.startsWith("/shop");

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
      {!isShopRoute && <Navbar style={{ height: '50px' }} onModeSwitch={handleModeSwitch} />}

      {/* Page Content */}
      <main>{children}</main>

      {/* Footer for both modes */}
      <Footer />
    </div>
  );
}
