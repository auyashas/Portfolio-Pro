import { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Auth.css";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        document.title = "Portfolio-Pro | Login";
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(""); // Reset error message

        if (!email || !password) {
            setError("Please fill in both fields.");
            return;
        }

        try {
            const response = await axios.post(
                "http://localhost:3000/login",
                { email, password },
                { withCredentials: true }
            );

            const user = response.data.user;

            if (user && user.id && user.role) {
                if (user.role === "admin") {
                    navigate("/admin"); // ✅ Static route for admin
                } else {
                    navigate(`/${user.role}/${user.id}`); // ✅ Dynamic for freelancer/client
                }
            } else {
                setError("Invalid user data received.");
            }
        } catch (err) {
            console.error("Login error:", err);
            setError(err.response?.data?.message || "Login failed. Please try again.");
        }
    };

    return (
        <div className="auth-box">
            <div className="auth-header">
                <img src="src/assets/character_logo.png" alt="" className="logo" />
                <header>Login</header>
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

                <div className="input-box password-box">
                    <input
                        type={showPassword ? "text" : "password"}
                        className="input-field"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <span className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? <EyeOff size={24} /> : <Eye size={24} />}
                    </span>
                </div>

                {error && <p className="error-msg">{error}</p>}

                <div className="forgot">
                    <section><a href="#">Forgot Password</a></section>
                </div>

                <div className="input-submit">
                    <button className="submit-btn" type="submit">Sign In</button>
                </div>

                <div className="sign-up-link">
                    <p>Don't have an account? </p>
                    <Link to="/signup">Sign up as a freelancer</Link>
                </div>
            </form>
        </div>
    );
};

export default Login;
