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
        axios.get("http://localhost:3000/admin/applications") 
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
                            <th>ID</th>
                            <th>Email</th>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Title</th>
                            <th>Skills</th>
                            <th>Experience</th>
                            <th>Resume</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {applications.map((app) => (
                            <tr key={app.freelancer_id}>
                                <td>{app.freelancer_id}</td>
                                <td>{app.email}</td>
                                <td>{app.first_name}</td>
                                <td>{app.last_name}</td>
                                <td>{app.title}</td>
                                <td>{app.skills}</td>
                                <td>{app.experience} years</td>
                                <td>
                                    {/* Add a button for downloading resume */}
                                    <a href={`http://localhost:3000${app.resume_path}`} target="_blank" rel="noopener noreferrer">
                                        <button className="download-btn">Download Resume</button>
                                    </a>
                                </td>
                                <td>
                                    {app.status === "Pending" && (
                                        <>
                                            <button className="approve-btn" onClick={() => handleApprove(app.freelancer_id)}>Approve</button>
                                            <button className="reject-btn" onClick={() => handleReject(app.freelancer_id)}>Reject</button>
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
        await axios.post(`http://localhost:3000/admin/application/${id}`, { status: 'approve' });
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
        await axios.post(`http://localhost:3000/admin/application/${id}`, { status: 'reject' });
        alert("Freelancer rejected.");
        window.location.reload(); // Reload to reflect changes
    } catch (error) {
        console.error("Error rejecting freelancer:", error);
        alert("Failed to reject freelancer.");
    }
};

export default Applications;
