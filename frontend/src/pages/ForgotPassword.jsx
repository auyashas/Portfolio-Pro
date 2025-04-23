import { useState, useEffect } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Auth.css';

axios.defaults.withCredentials = true;

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [isOtpSent, setIsOtpSent] = useState(false);
    const [isOtpVerified, setIsOtpVerified] = useState(false);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [timer, setTimer] = useState(60);
    const [isTimerRunning, setIsTimerRunning] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [userId, setUserId] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        let countdown;
        if (isTimerRunning && timer > 0) {
            countdown = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        } else if (timer === 0) {
            setIsTimerRunning(false);
        }

        return () => clearInterval(countdown);
    }, [isTimerRunning, timer]);

    useEffect(() => {
        document.title = "Portfolio-Pro | Forgot Password";
    }, []);

    const validatePassword = (password) => {
        const regex = /^(?=.*\d)[A-Za-z\d!@#$%^&*]{8,}$/;
        return regex.test(password);
    };

    const sendOtp = async () => {
        if (!email) return alert("Enter your email first.");
        try {
            setIsLoading(true);
    
            // Step 1: Check if email exists
            const checkRes = await axios.post("http://localhost:3000/check-email", { email });
            if (!checkRes.data.exists) {
                console.log("no")
                alert("Email not registered.");
                return;
            }
    
            // Step 2: Save userId
            setUserId(checkRes.data.userId);
    
            // Step 3: Send OTP
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
            alert("Error sending OTP.");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };
    
    const verifyOtp = async () => {
        if (otp.length !== 4 || !/^\d{4}$/.test(otp)) {
            alert("Please enter a valid 4-digit OTP.");
            return;
        }
    
        try {
            const otpRes = await axios.post("http://localhost:3000/verify-otp", { email, otp });
    
            if (otpRes.data.success) {
                setIsOtpVerified(true);
                setIsTimerRunning(false);
                alert("OTP verified successfully!");
            } else {
                alert(otpRes.data.message);
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

        if (!isOtpVerified || !userId) {
            alert("Please verify your OTP before proceeding.");
            return;
        }

        try {
            await axios.put(`http://localhost:3000/password/${userId}`, { password });
            alert('Password updated successfully. Please log in.');
            navigate('/login');
        } catch (err) {
            alert("Error updating password. Try again.");
            console.error(err);
        }
    };

    return (
        <div className="auth-box">
            <div className="auth-header">
                <img src="src/assets/character_logo.png" alt="Logo" className='logo' />
                <header>Reset Password</header>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="input-box">
                    <input
                        type="email"
                        className="input-field"
                        placeholder="Enter your registered email"
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

                {isLoading && (
                    <div className="loading-buffer">
                        <span className='loading-text'>Sending OTP</span>
                        <div className="spinner"></div>
                    </div>
                )}

                <div className="input-box password-box">
                    <input
                        type={showPassword ? 'text' : 'password'}
                        className="input-field"
                        placeholder="New Password"
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
                        placeholder="Confirm New Password"
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

                <div className="input-submit">
                    <button type="submit" className="submit-btn" disabled={!isOtpVerified}>
                        Reset Password
                    </button>
                </div>

                <div className="sign-up-link">
                    <p>Remembered your password?</p> <Link to="/login">Log in</Link>
                </div>
            </form>
        </div>
    );
};

export default ForgotPassword;
