import { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/Admin.css';
import { Link } from 'react-router-dom';

const AdminApplications = () => {
    const [applications, setApplications] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        document.title = "Admin | Applications";
        fetchApplications();
    }, []);

    const fetchApplications = async () => {
        try {
            const response = await axios.get('http://localhost:3000/admin/applications');
            console.log(response.data);
            setApplications(response.data);
        } catch (error) {
            console.error("Error fetching applications:", error);
            alert("Failed to load applications");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDecision = async (freelancerId, decision) => {
        try {
            const res = await axios.post(`http://localhost:3000/admin/application/${freelancerId}`, { status: decision });
            if (res.status === 200) {
                alert(`Freelancer ${decision}ed successfully!`);
                fetchApplications(); // Refresh list
            }
        } catch (err) {
            console.error(`Failed to ${decision} freelancer:`, err);
            alert(`Failed to ${decision} freelancer`);
        }
    };

    return (
        <div className="admin-panel">
            <h1>Freelancer Applications</h1>

            {isLoading ? (
                <p>Loading applications...</p>
            ) : applications.length === 0 ? (
                <p>No pending applications.</p>
            ) : (
                <div className="applications-list">
                    {applications.map((freelancer) => (
                        <div key={freelancer.id} className="application-card">
                            <img
                                src={freelancer.profilePictureURL
                                    ? `http://localhost:3000/${freelancer.profilePictureURL}`
                                    : 'http://localhost:3000/uploads/profile_pics/default-user.png'}
                                alt="Profile"
                                className="profile-thumb"
                            />

                            <h3>{freelancer.name || 'Unknown Freelancer'}</h3>
                            <p><strong>Title:</strong> {freelancer.title || 'N/A'}</p>
                            <p><strong>Skills:</strong> {freelancer.skills || 'N/A'}</p>
                            <p><strong>Experience:</strong> {freelancer.experience ? `${freelancer.experience} years` : 'N/A'}</p>
                            <p><strong>Bio:</strong> {freelancer.bio || 'N/A'}</p>

                            {/* Conditional rendering for user information */}
                            <p><strong>First Name:</strong> {freelancer.user?.first_name || 'N/A'}</p>
                            <p><strong>Last Name:</strong> {freelancer.user?.last_name || 'N/A'}</p>
                            <p><strong>Email:</strong> {freelancer.user?.email || 'N/A'}</p>
                            <p><strong>Contact:</strong> {freelancer.user?.contact || 'N/A'}</p>
                            <p><strong>City:</strong> {freelancer.user?.city || 'N/A'}</p>
                            <p><strong>Country:</strong> {freelancer.user?.country || 'N/A'}</p>

                            {/* Download resume */}
                            <a
                                href={`http://localhost:3000/download-resume/${freelancer.resume_path?.replace(/\\/g, '/').split('/').pop()}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                download
                            >
                                Download Resume
                            </a>

                            <div className="btn-group">
                                <button className="approve-btn" onClick={() => handleDecision(freelancer.id, 'approve')}>Approve</button>
                                <button className="reject-btn" onClick={() => handleDecision(freelancer.id, 'reject')}>Reject</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AdminApplications;
