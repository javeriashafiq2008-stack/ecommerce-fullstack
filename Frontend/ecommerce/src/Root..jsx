import { Outlet } from "react-router";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import { checkAuthStatus } from "./features/authentication/authenticationSlice.js";
import { ShopProvider } from "./components/context/ShopContext.jsx";
import { isDemoModeActive } from "./api/mockApi.js";

function Root() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkAuthStatus());
  }, [dispatch]);

  const isDemo = isDemoModeActive();

  return (
    <ShopProvider>
      <Navbar />
      <Outlet />
      <Footer />
      {isDemo && (
        <div className="fixed bottom-4 right-4 z-[9999] flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/90 text-white text-xs font-bold shadow-lg backdrop-blur-sm pointer-events-none select-none border border-amber-400">
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
          Demo Mode
        </div>
      )}
    </ShopProvider>
  );
}

export default Root;