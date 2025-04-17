import React from "react";
import { useLocation, Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";

const Layout = () => {
    const location = useLocation();
    const hideNavbarRoutes = ["/login", "/signup", "/register", "/terms"];

    return (
        <>
            {!hideNavbarRoutes.includes(location.pathname) && <Navbar />}
            <Outlet /> {/* This will render the child route content */}
        </>
    );
};

export default Layout;
