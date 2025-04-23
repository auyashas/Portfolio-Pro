import React from "react";
import { useLocation, Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer"; // Make sure the path is correct

const Layout = () => {
    const location = useLocation();
    const hideLayoutRoutes = ["/login", "/signup", "/register", "/terms","/freelancer/:id/freelancer-application","/password-reset"];

    const shouldHideLayout = hideLayoutRoutes.includes(location.pathname);

    return (
        <>
            {!shouldHideLayout && <Navbar />}
            <Outlet />
            {!shouldHideLayout && <Footer />}
        </>
    );
};

export default Layout;
