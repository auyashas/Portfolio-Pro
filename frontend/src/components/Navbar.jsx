import { useState } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useSession } from "../hooks/useSession"; // ✅ cookie-based session
import ConfirmPopup from "../components/ConfirmPopup"; // Corrected import to use ConfirmPopup
import "./Navbar.css";

export default function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const { logout, user } = useSession();  // ← get user too
    const [showConfirmPopup, setShowConfirmPopup] = useState(false);

    // Determine role based on the current URL path
    const role = location.pathname.includes('/admin') ? 'admin' :
                 location.pathname.includes('/freelancer') ? 'freelancer' :
                 location.pathname.includes('/client') ? 'client' : null;

    const handleLogout = () => {
        setShowConfirmPopup(true);  // Show confirmation popup
    };

    const confirmLogout = async () => {
        try {
            await logout();
            setShowConfirmPopup(false); // Close the confirm popup
            navigate("/"); // Redirect to home page after logout
        } catch (error) {
            console.error("Error during logout:", error);
            // Optionally, handle any error message
        }
    };

    const renderUserOptions = () => {
        if (!user) {
            return (
                <>
                    <span>Loading...</span>
                </>
            );
        }

        if (role === "admin") {
            return (
                <>
                    <Link to="/admin/applications">Applications</Link>
                    <Link to="/admin/dashboard">Dashboard</Link>
                    <button onClick={handleLogout}>Logout</button>
                </>
            );
        } else if (role === "freelancer") {
            return (
                <>
                    {user.id && <Link to={`/freelancer/${user.id}/profile`}>Profile</Link>}
                    <Link to={`/freelancer/${user.id}/job-requests`}>Job Applications</Link>
                    <button onClick={handleLogout}>Logout</button>
                </>
            );
        } else if (role === "client") {
            return (
                <>
                    <Link to={`/client/${user.id}/job-requests`}>Job Requests</Link>
                    <button onClick={handleLogout}>Logout</button>
                </>
            );
        } else {
            return (
                <>
                    <button className="nav-btn" onClick={() => navigate("/login")}>Login</button>
                    <NavLink to="/signup">Signup</NavLink>
                </>
            );
        }
    };

    const getHomeLink = () => {
        if (role === 'admin') return '/admin';
        if (role === 'freelancer' && user) return `/freelancer/${user.id}`;
        if (role === 'client' && user) return `/client/${user.id}`;
        return '/';
    };

    const getAboutLink = () => {
        if (role === 'admin') return '/admin/about';
        if (role === 'freelancer' && user) return `/freelancer/${user.id}/about`;
        if (role === 'client' && user) return `/client/${user.id}/about`;
        return '/about';
    };

    return (
        <nav className="nav">
            <div className="logo">
                <img src="/src/assets/character_logo.png" alt="Logo" onClick={() => navigate(getHomeLink())} />
            </div>
            <ul className="nav-options">
                <NavLink to={getHomeLink()}>Home</NavLink>
                <NavLink to={getAboutLink()}>About Us</NavLink>

                {/* Show the login/signup options if no role is assigned */}
                {role === null && (
                    <>
                        <NavLink to="/signup">Signup</NavLink>
                        <button className="nav-btn" onClick={() => navigate("/login")}>Login</button>
                    </>
                )}

                {/* Render user options based on role */}
                {role && (
                    <div className="nav-user-menu">
                        {renderUserOptions()}
                    </div>
                )}
            </ul>

            {/* ConfirmPopup for confirmation on logout */}
            {showConfirmPopup && (
                <ConfirmPopup 
                    message="Are you sure you want to log out?"
                    onConfirm={confirmLogout}
                    onCancel={() => setShowConfirmPopup(false)} 
                />
            )}
        </nav>
    );
}
