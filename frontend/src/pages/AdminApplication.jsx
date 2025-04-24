import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Eye } from "lucide-react"; // Eye icon from lucide-react
import Popup from "../components/Popup";
import ConfirmPopup from "../components/ConfirmPopup"; // Import ConfirmPopup
import "../styles/Applications.css";

const Applications = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [processing, setProcessing] = useState(false);
    const [showPopup, setShowPopup] = useState(false); // State to control the popup
    const [showConfirmPopup, setShowConfirmPopup] = useState(false); // State to control confirm popup
    const [message, setMessage] = useState('');
    const [currentAction, setCurrentAction] = useState('');
    const [currentId, setCurrentId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        document.title = "Portfolio-Pro | Applications";

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
        setShowConfirmPopup(true);
        setCurrentAction('approve');
        setCurrentId(id);
    };

    const handleReject = async (id) => {
        setShowConfirmPopup(true);
        setCurrentAction('reject');
        setCurrentId(id);
    };

    const confirmAction = async () => {
        setProcessing(true);
        try {
            await axios.post(`http://localhost:3000/admin/application/${currentId}`, { status: currentAction });
            setMessage(`Freelancer ${currentAction}d!`);
            setShowPopup(true);
            setShowConfirmPopup(false);
            setApplications((prevApps) =>
                prevApps.map((app) =>
                    app.freelancer_id === currentId ? { ...app, status: currentAction.charAt(0).toUpperCase() + currentAction.slice(1) } : app
                )
            );
        } catch (error) {
            console.error("Error performing action:", error);
            setMessage(`Failed to ${currentAction} freelancer.`);
            setShowPopup(true);
            setShowConfirmPopup(false);
        } finally {
            setProcessing(false);
        }
    };

    const cancelAction = () => {
        setShowConfirmPopup(false);
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
                            <th>Profile</th>
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
                                    <button
                                        className="eye-btn"
                                        onClick={() => navigate(`/admin/profile/${app.user_id}`)}
                                        title="View Profile"
                                    >
                                        <Eye size={20} />
                                    </button>
                                </td>
                                <td>
                                    {app.status === "Pending" && (
                                        <>
                                            <button
                                                className="approve-btn"
                                                onClick={() => handleApprove(app.freelancer_id)}
                                                disabled={processing}
                                            >
                                                Approve
                                            </button>
                                            <button
                                                className="reject-btn"
                                                onClick={() => handleReject(app.freelancer_id)}
                                                disabled={processing}
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

            {showPopup && (
                <Popup message={message} onClose={() => setShowPopup(false)} />
            )}

            {showConfirmPopup && (
                <ConfirmPopup
                    message={`Are you sure you want to ${currentAction} this freelancer?`}
                    onConfirm={confirmAction}
                    onCancel={cancelAction}
                />
            )}
        </div>
    );
};

export default Applications;
