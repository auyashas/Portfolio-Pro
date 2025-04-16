import { useState, useEffect } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Auth.css';

axios.defaults.withCredentials = true;

const Signup = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [isOtpSent, setIsOtpSent] = useState(false);
    const [isOtpVerified, setIsOtpVerified] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [userType, setUserType] = useState('freelancer');
    const [timer, setTimer] = useState(60);
    const [isTimerRunning, setIsTimerRunning] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        let countdown;
        if (isTimerRunning && timer > 0) {
            countdown = setInterval(() => {
                setTimer((prevTimer) => prevTimer - 1);
            }, 1000);
        } else if (timer === 0) {
            setIsTimerRunning(false);
        }

        return () => clearInterval(countdown);
    }, [isTimerRunning, timer]);

    useEffect(() => {
        document.title = "Portfolio-Pro | Sign-up";
    }, []);

    const validatePassword = (password) => {
        const regex = /^(?=.*\d)[A-Za-z\d!@#$%^&*]{8,}$/;
        return regex.test(password);
    };

    const sendOtp = async () => {
        if (!email) return alert("Enter your email first.");
        try {
            const response = await axios.post("http://localhost:3000/send-otp", { email });
            if (response.data.success) {
                setIsOtpSent(true);
                setIsOtpVerified(false);
                setTimer(60);
                setIsTimerRunning(true);
                alert("OTP sent to your email.");
            } else {
                alert("Failed to send OTP.");
            }
        } catch (err) {
            console.error(err);
            alert("Error sending OTP.");
        }
    };

    const verifyOtp = async () => {
        if (otp.length !== 4 || !/^\d{4}$/.test(otp)) {
            alert("Please enter a valid 4-digit OTP.");
            return;
        }

        try {
            const response = await axios.post("http://localhost:3000/verify-otp", { email, otp });

            if (response.data.success) {
                setIsOtpVerified(true);
                setIsTimerRunning(false); // 🛑 stop the timer
                alert("OTP verified successfully!");
            } else {
                alert(response.data.message);
            }
        } catch (err) {
            alert(err.response?.data?.message || "Error verifying OTP.");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email || !password || !confirmPassword) {
            alert('Please fill in all fields.');
            return;
        }

        if (password !== confirmPassword) {
            alert('Passwords do not match.');
            return;
        }

        if (!validatePassword(password)) {
            alert('Password must be at least 8 characters long and contain at least one number.');
            return;
        }

        if (!isOtpVerified) {
            alert("Please verify your OTP before proceeding.");
            return;
        }

        try {
            const response = await axios.post('http://localhost:3000/check-email', { email });
            if (response.data.exists) {
                alert('User already exists. Please log in.');
                return;
            }

            localStorage.setItem('signupEmail', email);
            localStorage.setItem('signupPassword', password);
            localStorage.setItem('userType', userType);

            navigate('/register');
        } catch (error) {
            console.error('Error checking email:', error);
            alert('Error checking email. Please try again later.');
        }
    };

    return (
        <div className="auth-box">
            <div className="auth-header">
                <img src="src/assets/character_logo.png" alt="Logo" className='logo' />
                <header>Sign Up</header>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="input-box">
                    <input
                        type="email"
                        className="input-field"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                {isOtpSent && (
                    <div className="otp-box">
                        <input
                            type="text"
                            inputMode="numeric"
                            pattern="\d*"
                            className="input-field"
                            placeholder="Enter OTP"
                            value={otp}
                            maxLength={4}
                            disabled={isOtpVerified}
                            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                        />
                        <button type="button" onClick={verifyOtp} className="verify-btn" disabled={isOtpVerified}>
                            {isOtpVerified ? "Verified" : "Verify"}
                        </button>
                    </div>
                )}

                {!isOtpVerified && isOtpSent && (
                    <p
                        className={`resend-link ${isTimerRunning ? 'disabled' : ''}`}
                        onClick={!isTimerRunning ? sendOtp : null}
                        style={{ cursor: isTimerRunning ? 'not-allowed' : 'pointer', color: isTimerRunning ? 'gray' : '' }}
                    >
                        {isTimerRunning ? `Resend OTP in ${timer}s` : "Resend OTP"}
                    </p>
                )}

                {!isOtpSent && (
                    <p className="resend-link" onClick={sendOtp}>
                        Get OTP
                    </p>
                )}

                <div className="input-box password-box">
                    <input
                        type={showPassword ? 'text' : 'password'}
                        className="input-field"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onPaste={(e) => e.preventDefault()}
                        disabled={!isOtpVerified}
                        required
                    />
                    <span className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? <EyeOff size={24} /> : <Eye size={24} />}
                    </span>
                </div>

                <div className="input-box password-box">
                    <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        className="input-field"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        onPaste={(e) => e.preventDefault()}
                        disabled={!isOtpVerified}
                        required
                    />
                    <span className="password-toggle" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                        {showConfirmPassword ? <EyeOff size={24} /> : <Eye size={24} />}
                    </span>
                </div>

                <div className="role-select">
                    <label>
                        <input
                            type="radio"
                            name="userType"
                            value="freelancer"
                            checked={userType === 'freelancer'}
                            className='radio-btn'
                            onChange={(e) => setUserType(e.target.value)}
                        />
                        Freelancer
                    </label>
                    <label style={{ marginLeft: '20px' }}>
                        <input
                            type="radio"
                            name="userType"
                            value="client"
                            checked={userType === 'client'}
                            className='radio-btn'
                            onChange={(e) => setUserType(e.target.value)}
                        />
                        Client
                    </label>
                </div>

                <div className="input-submit">
                    <button type="submit" className="submit-btn" disabled={!isOtpVerified}>
                        {isOtpVerified ? "Sign Up" : "Verify OTP to Continue"}
                    </button>
                </div>

                <div className="sign-up-link">
                    <p>Do you have an account?</p> <Link to="/login">Log in as a freelancer</Link>
                </div>
            </form>
        </div>
    );
};

export default Signup;
