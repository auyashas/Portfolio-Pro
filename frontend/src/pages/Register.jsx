import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Auth.css';
import Popup from '../components/Popup'; // ✅ import Popup

const Register = () => {
    useEffect(() => {
        document.title = "Portfolio-Pro | Registration";
    }, []);

    const navigate = useNavigate();

    const storedEmail = localStorage.getItem('signupEmail') || '';
    const storedPassword = localStorage.getItem('signupPassword') || '';
    const userType = localStorage.getItem('userType') || '';

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        contactNumber: '',
        city: '',
        country: ''
    });

    const [isLoading, setIsLoading] = useState(false);
    const [popup, setPopup] = useState({ show: false, message: '', onClose: null });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const dataToSend = {
            firstName: formData.firstName,
            lastName: formData.lastName,
            contactNumber: formData.contactNumber,
            city: formData.city,
            country: formData.country,
            email: storedEmail,
            password: storedPassword,
            userType: userType
        };

        setIsLoading(true);

        try {
            const response = await axios.post('http://localhost:3000/register', dataToSend);

            if (response.status === 200) {
                setPopup({
                    show: true,
                    message: 'Registration successful! Please login to continue.',
                    onClose: () => {
                        localStorage.removeItem('signupEmail');
                        localStorage.removeItem('signupPassword');
                        localStorage.removeItem('userType');
                        setPopup({ show: false, message: '', onClose: null });
                        navigate('/login');
                    }
                });
            }
        } catch (error) {
            console.error('Registration Error:', error);
            setPopup({
                show: true,
                message: 'Registration failed. Please try again.',
                onClose: () => setPopup({ show: false, message: '', onClose: null })
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {popup.show && <Popup message={popup.message} onClose={popup.onClose} />}

            <div className="auth-box">
                <div className="auth-header">
                    <img src="src/assets/character_logo.png" alt="Portfolio Logo" className="logo" />
                    <header>Registration</header>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="input-box">
                        <input
                            type="text"
                            name="firstName"
                            placeholder="First Name"
                            value={formData.firstName}
                            onChange={handleChange}
                            className="input-field"
                            required
                        />
                        <input
                            type="text"
                            name="lastName"
                            placeholder="Last Name"
                            value={formData.lastName}
                            onChange={handleChange}
                            className="input-field"
                            required
                        />
                        <input
                            type="tel"
                            name="contactNumber"
                            placeholder="Contact Number"
                            value={formData.contactNumber}
                            onChange={handleChange}
                            className="input-field"
                            inputMode="numeric"
                            pattern="\d*"
                            onInput={(e) => {
                                e.target.value = e.target.value.replace(/\D/g, '');
                            }}
                            maxLength={10}
                            required
                        />
                        <input
                            type="text"
                            name="city"
                            placeholder="City"
                            value={formData.city}
                            onChange={handleChange}
                            className="input-field"
                            required
                        />
                        <input
                            type="text"
                            name="country"
                            placeholder="Country"
                            value={formData.country}
                            onChange={handleChange}
                            className="input-field"
                            required
                        />
                    </div>

                    <div className="input-submit load">
                        <button className="submit-btn" disabled={isLoading}>
                            {isLoading ? "Registering..." : "Register"}
                        </button>
                        {isLoading && <div className="spinner"></div>}
                    </div>
                </form>
            </div>
        </>
    );
};

export default Register;
