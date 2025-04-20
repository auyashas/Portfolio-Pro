import { useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Hero from '../components/Hero'; 
const FreelancerHome = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const hasCheckedProfile = useRef(false); // 💡 Prevent double alert

    useEffect(() => {
        if (hasCheckedProfile.current) return;
        hasCheckedProfile.current = true;

        const checkProfile = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/freelancer/check/${id}`);
                if (!response.data.exists) {
                    alert("Please complete your profile to continue.");
                    navigate(`/freelancer/${id}/freelancer-application`);
                }
            } catch (error) {
                console.error("Error checking freelancer profile:", error);
            }
        };

        checkProfile();
    }, [id, navigate]);

    return (
        <div>
            <Hero />
        </div>
    );
};

export default FreelancerHome;
