import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Hero from '../components/Hero'; 
import Footer from '../components/Footer';
import "../styles/HomeStyles.css";

const FreelancerHome = () => {
    const { id } = useParams();  // Extracts the id parameter from the URL
    const navigate = useNavigate();
    const [profileExists, setProfileExists] = useState(null);

    useEffect(() => {
        // Fetch profile completion status
        const checkProfile = async () => {
            try {
                const response = await fetch(`http://localhost:3000/freelancer/profile/${id}`);
                const data = await response.json();

                if (data.profileExists === false) {
                    // Redirect to profile completion page
                    navigate(`/freelancer/${id}/application`);
                } else {
                    setProfileExists(true);
                }
            } catch (error) {
                console.error("Error checking profile:", error);
            }
        };

        checkProfile();
    }, [id, navigate]);

    if (profileExists === null) {
        return <div>Loading...</div>;  // Wait for the profile check
    }

    return (
        <>
            <Hero />
            <Footer />
        </>
    );
};

export default FreelancerHome;
