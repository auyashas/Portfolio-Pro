import { useRef, useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { MoreVertical } from "lucide-react";
import { useSession } from "../hooks/useSession"; // ✅ now using cookie-based session
import "./Navbar.css";

export default function Navbar() {
    const navigate = useNavigate();
    const dropdownRef = useRef(null);
    const [showDropdown, setShowDropdown] = useState(false);

    const { user, logout, loading } = useSession();  // Ensure the `user` is coming correctly
    const role = user?.role;

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setShowDropdown(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = async () => {
        const confirmLogout = window.confirm("Are you sure you want to log out?");
        if (confirmLogout) {
            await logout();
            navigate("/"); // Redirect to homepage after logout
        }
    };

    const renderDropdownOptions = () => {
        if (role === "admin") {
            return (
                <>
                    <Link to="/admin/applications">Applications</Link>
                    <Link to="/active-freelancers">Active Freelancers</Link>
                    <button onClick={handleLogout}>Logout</button>
                </>
            );
        } else if (role === "freelancer") {
            return (
                <>
                    <Link to="/profile">Profile</Link>
                    <Link to="/job-applications">Job Applications</Link>
                    <button onClick={handleLogout}>Logout</button>
                </>
            );
        } else if (role === "client") {
            return (
                <>
                    <Link to="/job-requests">Job Requests</Link>
                    <button onClick={handleLogout}>Logout</button>
                </>
            );
        } else {
            return null;
        }
    };

    return (
        <nav className="nav">
            <div className="logo">
                <img src="/src/assets/character_logo.png" alt="Logo" onClick={() => navigate("/")} />
            </div>
            <ul className="nav-options">
                <NavLink to="/">Home</NavLink>
                <NavLink to="/about">About Us</NavLink>
                {!user && !loading && <NavLink to="/signup">Apply as Freelancer</NavLink>}
            </ul>

            {!loading && (
                user ? (
                    <div className="nav-user-menu" ref={dropdownRef}>
                        <MoreVertical size={26} onClick={() => setShowDropdown(!showDropdown)} className="three-dots" />
                        {showDropdown && (
                            <div className={`dropdown-menu ${showDropdown ? "show" : ""}`}>
                                {renderDropdownOptions()}
                            </div>
                        )}

                    </div>
                ) : (
                    <button className="nav-btn" onClick={() => navigate("/login")}>Login</button>
                )
            )}
        </nav>
    );
}
