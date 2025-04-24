import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Hero from '../components/Hero';
import Popup from '../components/Popup'; // ✅ import Popup

const FreelancerHome = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const hasCheckedProfile = useRef(false);
    const [showPopup, setShowPopup] = useState(false);

    useEffect(() => {
        if (hasCheckedProfile.current) return;
        hasCheckedProfile.current = true;

        const checkProfile = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/freelancer/check/${id}`);
                if (!response.data.exists) {
                    setShowPopup(true);
                }
            } catch (error) {
                console.error("Error checking freelancer profile:", error);
            }
        };

        checkProfile();
    }, [id]);

    const handlePopupClose = () => {
        setShowPopup(false);
        navigate(`/freelancer/${id}/freelancer-application`);
    };

    return (
        <div>
            <Hero />
            {showPopup && (
                <Popup
                    message="Please complete your profile to continue."
                    onClose={handlePopupClose}
                />
            )}
        </div>
    );
};

export default FreelancerHome;
