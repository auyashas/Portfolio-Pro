import { useState, useEffect } from "react";
import axios from "axios";
import "../styles/Applications.css"; // Add a CSS file for styling if needed
import Navbar from "../components/Navbar";

const Applications = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        document.title = "Portfolio-Pro | Applications";
        
        // Fetch applications from backend
        axios.get("http://localhost:3000/api/applications") 
            .then((response) => {
                setApplications(response.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching applications:", error);
                setError("Failed to load applications");
                setLoading(false);
            });
    }, []);

    if (loading) return <p>Loading applications...</p>;
    if (error) return <p>{error}</p>;

    return (
        
        <div className="applications-container">
            <Navbar />
            <h2>Freelancer Applications</h2>
            {applications.length === 0 ? (
                <p>No pending applications.</p>
            ) : (
                <table className="applications-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Skills</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {applications.map((app) => (
                            <tr key={app.id}>
                                <td>{app.name}</td>
                                <td>{app.login_mail}</td>
                                <td>{app.skill}</td>
                                <td>{app.status}</td>
                                <td>
                                    {app.status === "Pending" && (
                                        <>
                                            <button className="approve-btn" onClick={() => handleApprove(app.id)}>Approve</button>
                                            <button className="reject-btn" onClick={() => handleReject(app.id)}>Reject</button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

// Function to approve a freelancer
const handleApprove = async (id) => {
    try {
        await axios.post(`http://localhost:3000/api/applications/approve/${id}`);
        alert("Freelancer approved!");
        window.location.reload(); // Reload to reflect changes
    } catch (error) {
        console.error("Error approving freelancer:", error);
        alert("Failed to approve freelancer.");
    }
};

// Function to reject a freelancer
const handleReject = async (id) => {
    try {
        await axios.post(`http://localhost:3000/api/applications/reject/${id}`);
        alert("Freelancer rejected.");
        window.location.reload(); // Reload to reflect changes
    } catch (error) {
        console.error("Error rejecting freelancer:", error);
        alert("Failed to reject freelancer.");
    }
};

export default Applications;
