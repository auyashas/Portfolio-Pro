import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Hero from '../components/Hero'; // Corrected import for Hero
import Footer from '../components/Footer';
import axios from 'axios';

const FreelancerHome = () => {
    const { id } = useParams(); // This is user_id
    const navigate = useNavigate();

    useEffect(() => {
        const checkProfile = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/freelancer/check/${id}`);
                if (!response.data.exists) {
                    alert("Please complete your profile to continue.");
                    navigate(`/freelancer/${id}/freelancer-application`);
                }
                // You can set freelancer data in state here if needed
            } catch (error) {
                console.error("Error checking freelancer profile:", error);
            }
        };

        checkProfile();
    }, [id, navigate]);

    return (
        <div>
            <Hero />
            <Footer />
        </div>
    );
};

export default FreelancerHome;
