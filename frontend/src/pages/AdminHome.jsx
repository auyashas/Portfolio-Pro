    import React from "react";
    import Hero from '../components/Hero'; // Corrected import for Hero
    import Footer from '../components/Footer';
    import "../styles/HomeStyles.css";

    const AdminHome = () => {
        return (
            <>
            <Hero />
            <Footer />
            </>
        );
    };

    export default AdminHome;
