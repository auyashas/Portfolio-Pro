import React from "react";
import { useParams } from "react-router-dom";
import Hero from '../components/Hero'; // Corrected import for Hero
import Footer from '../components/Footer';
import "../styles/HomeStyles.css";

const FreelancerHome = () => {
    const { id } = useParams();  // Extracts the id parameter from the URL
    console.log("📍 useParams ID:", id);  // Logging the id for debugging

    return (
        <>
            <Hero />
            <div className="freelancer-home">
                <h1>Welcome Freelancer {id}</h1>
                {/* Display freelancer's id or any other information here */}
            </div>
            <Footer />
        </>
    );
};

export default FreelancerHome;
