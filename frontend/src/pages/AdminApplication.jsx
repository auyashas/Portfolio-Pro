import { useState, useEffect } from "react";
import axios from "axios";
import "../styles/Applications.css"; // Add a CSS file for styling if needed

const Applications = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [processing, setProcessing] = useState(false); // ⬅️ NEW STATE

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

    const handleApprove = async (id) => {
        setProcessing(true); // ⬅️ Start loading
        try {
            await axios.post(`http://localhost:3000/admin/application/${id}`, { status: 'approve' });
            alert("Freelancer approved!");
            window.location.reload();
        } catch (error) {
            console.error("Error approving freelancer:", error);
            alert("Failed to approve freelancer.");
        } finally {
            setProcessing(false); // ⬅️ End loading
        }
    };

    const handleReject = async (id) => {
        setProcessing(true); // ⬅️ Start loading
        try {
            await axios.post(`http://localhost:3000/admin/application/${id}`, { status: 'reject' });
            alert("Freelancer rejected.");
            window.location.reload();
        } catch (error) {
            console.error("Error rejecting freelancer:", error);
            alert("Failed to reject freelancer.");
        } finally {
            setProcessing(false); // ⬅️ End loading
        }
    };

    if (loading) return <p>Loading applications...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="applications-container">
            <h2>Freelancer Applications</h2>
            {processing && <p className="processing-text">Processing request & sending email, please wait...</p>}
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
                                    <a
                                        href={`http://localhost:3000/download-resume/${app.resume_path.replace(/\\/g, '/').split('/').pop()}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        download
                                    >
                                        <button className="download-btn">Download Resume</button>
                                    </a>
                                </td>
                                <td>
                                    {app.status === "Pending" && (
                                        <>
                                            <button
                                                className="approve-btn"
                                                onClick={() => handleApprove(app.freelancer_id)}
                                                disabled={processing} // Disable if processing
                                            >
                                                Approve
                                            </button>
                                            <button
                                                className="reject-btn"
                                                onClick={() => handleReject(app.freelancer_id)}
                                                disabled={processing} // Disable if processing
                                            >
                                                Reject
                                            </button>
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

export default Applications;
