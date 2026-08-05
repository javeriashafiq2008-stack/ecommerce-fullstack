import { Outlet } from "react-router";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import { checkAuthStatus } from "./features/authentication/authenticationSlice.js";
import { ShopProvider } from "./components/context/ShopContext.jsx";

function Root() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkAuthStatus());
  }, [dispatch]);

  return (
    <ShopProvider>
      <Navbar />
      <Outlet />
      <Footer />
    </ShopProvider>
  );
}

export default Root;