import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Applications.css";
import Popup from "../components/Popup";
import ConfirmPopup from "../components/ConfirmPopup";

const JobApplications = () => {
    const { id: freelancerId } = useParams();
    const [pendingJobs, setPendingJobs] = useState([]);
    const [acceptedJobs, setAcceptedJobs] = useState([]);
    const [rejectedJobs, setRejectedJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [processing, setProcessing] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [confirmData, setConfirmData] = useState(null); // For ConfirmPopup
    const hasCheckedProfile = useRef(false);
    const navigate = useNavigate();

    useEffect(() => {
        document.title = "Portfolio-Pro | Job Requests";
        if (hasCheckedProfile.current) return;
        hasCheckedProfile.current = true;

        const fetchJobs = async () => {
            try {
                const checkProfile = async () => {
                    try {
                        const response = await axios.get(`http://localhost:3000/freelancer/check/${freelancerId}`);
                        if (!response.data.exists) {
                            setShowPopup(true); 
                        }
                    } catch (error) {
                        console.error("Error checking freelancer profile:", error);
                    }
                };

                await checkProfile();

                const [pending, accepted, rejected] = await Promise.all([
                    axios.get(`http://localhost:3000/freelancer/${freelancerId}/job-requests/Pending`),
                    axios.get(`http://localhost:3000/freelancer/${freelancerId}/job-requests/Approved`),
                    axios.get(`http://localhost:3000/freelancer/${freelancerId}/job-requests/Rejected`)
                ]);

                setPendingJobs(pending.data);
                setAcceptedJobs(accepted.data);
                setRejectedJobs(rejected.data);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching job requests:", err);
                setError("Failed to load job requests.");
                setLoading(false);
            }
        };

        fetchJobs();
    }, [freelancerId]);

    const handleStatusChange = (jobId, status) => {
        const message = `Are you sure you want to ${status.toLowerCase()} this job?`;
        setConfirmData({ jobId, status, message });
    };

    const handleConfirm = async () => {
        if (!confirmData) return;
        const { jobId, status } = confirmData;

        setProcessing(true);
        setConfirmData(null); // Close popup

        try {
            await axios.post(`http://localhost:3000/freelancer/job-status/${jobId}`, { status });
            setShowPopup({ message: `Job ${status.toLowerCase()} successfully.` }); // 👈 show success popup
            setTimeout(() => window.location.reload(), 1500); // optional reload
        } catch (error) {
            console.error("Error updating job status:", error);
            setShowPopup({ message: "Failed to update job status." });
        } finally {
            setProcessing(false);
        }
    };

    if (loading) return <p>Loading job requests...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="applications-container">
            <h2>Job Requests</h2>
            {processing && <p className="processing-text">Processing, please wait...</p>}

            {/* PENDING JOBS */}
            <h3>Pending Applications</h3>
            {pendingJobs.length === 0 ? (
                <p>No pending job requests.</p>
            ) : (
                <table className="applications-table">
                    <thead>
                        <tr>
                            <th>Job ID</th>
                            <th>Job Title</th>
                            <th>Description</th>
                            <th>Client Name</th>
                            <th>Client Email</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pendingJobs.map((job) => (
                            <tr key={job.id}>
                                <td>{job.id}</td>
                                <td>{job.job_title}</td>
                                <td>{job.description}</td>
                                <td>{job.client_name}</td>
                                <td>{job.client_email}</td>
                                <td>{job.status}</td>
                                <td>
                                    <button
                                        className="approve-btn"
                                        onClick={() => handleStatusChange(job.id, "Approved")}
                                        disabled={processing}
                                    >
                                        Approve
                                    </button>
                                    <button
                                        className="reject-btn"
                                        onClick={() => handleStatusChange(job.id, "Rejected")}
                                        disabled={processing}
                                    >
                                        Reject
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {/* ACCEPTED JOBS */}
            <h3>Accepted Jobs</h3>
            {acceptedJobs.length === 0 ? (
                <p>No accepted job requests.</p>
            ) : (
                <table className="applications-table">
                    <thead>
                        <tr>
                            <th>Job ID</th>
                            <th>Job Title</th>
                            <th>Description</th>
                            <th>Client Name</th>
                            <th>Client Email</th>
                            <th>Client Contact</th>
                        </tr>
                    </thead>
                    <tbody>
                        {acceptedJobs.map((job) => (
                            <tr key={job.id}>
                                <td>{job.id}</td>
                                <td>{job.job_title}</td>
                                <td>{job.description}</td>
                                <td>{job.client_name}</td>
                                <td>{job.client_email}</td>
                                <td>{job.client_contact}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {/* REJECTED JOBS */}
            <h3>Rejected Jobs</h3>
            {rejectedJobs.length === 0 ? (
                <p>No rejected job requests.</p>
            ) : (
                <table className="applications-table">
                    <thead>
                        <tr>
                            <th>Job ID</th>
                            <th>Job Title</th>
                            <th>Description</th>
                            <th>Client Name</th>
                            <th>Client Email</th>
                            <th>Client Contact</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rejectedJobs.map((job) => (
                            <tr key={job.id}>
                                <td>{job.id}</td>
                                <td>{job.job_title}</td>
                                <td>{job.description}</td>
                                <td>{job.client_name}</td>
                                <td>{job.client_email}</td>
                                <td>{job.client_contact}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {/* 👇 Popups */}
            {showPopup && (
                <Popup
                    message={typeof showPopup === "string" ? showPopup : showPopup.message}
                    onClose={() => {
                        setShowPopup(false);
                        if (typeof showPopup !== "string") navigate(`/freelancer/${freelancerId}/freelancer-application`);
                    }}
                />
            )}

            {confirmData && (
                <ConfirmPopup
                    message={confirmData.message}
                    onConfirm={handleConfirm}
                    onCancel={() => setConfirmData(null)}
                />
            )}
        </div>
    );
};

export default JobApplications;
