import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Popup from '../components/Popup';
import ConfirmPopup from '../components/ConfirmPopup';
import '../styles/AdminDashboard.css';

const AdminDashboard = () => {
    const [freelancers, setFreelancers] = useState([]);
    const [clients, setClients] = useState([]);
    const [stats, setStats] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [showPopup, setShowPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState('');
    const [showConfirmPopup, setShowConfirmPopup] = useState(false);
    const [freelancerToDelete, setFreelancerToDelete] = useState(null);

    useEffect(() => {
        fetchDashboard();
    }, []);

    const fetchDashboard = async () => {
        try {
            const res = await axios.get('http://localhost:3000/admin/dashboard');
            setFreelancers(res.data.freelancers);
            setClients(res.data.clients);
            setStats(res.data.stats);
        } catch (err) {
            setError('Error fetching dashboard data');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteClick = (id) => {
        setFreelancerToDelete(id);
        setShowConfirmPopup(true);
    };

    const confirmDelete = async () => {
        try {
            setLoading(true);
            await axios.post(`http://localhost:3000/admin/application/${freelancerToDelete}`, {
                status: 'reject',
            });
            setPopupMessage("Freelancer account deleted.");
            setShowPopup(true);
            setFreelancers((prev) =>
                prev.filter((freelancer) => freelancer.id !== freelancerToDelete)
            );
        } catch (error) {
            console.error("Error rejecting freelancer:", error);
            setPopupMessage("Failed to reject freelancer.");
            setShowPopup(true);
        } finally {
            setLoading(false);
            setShowConfirmPopup(false);
        }
    };

    const cancelDelete = () => {
        setShowConfirmPopup(false);
        setFreelancerToDelete(null);
    };

    return (
        <div className="dashboard-container">
            <h2>Admin Dashboard</h2>

            {loading && <p>Loading data...</p>}
            {error && <p className="error-message">{error}</p>}

            <div className="stats">
                <p>Total Active Freelancers: <span className='grey'><strong>{stats?.total_freelancers ?? 'Loading...'}</strong></span></p>
                <p>Total Clients: <span className='grey'><strong>{stats?.total_clients ?? 'Loading...'}</strong></span></p>
                <p>Pending Freelancer Applications: <span className='grey'><strong>{stats?.total_pending ?? 'Loading...'}</strong></span></p>
                <p>Freelancers who haven't applied: <span className='grey'><strong>{stats?.total_not_applied ?? 'Loading...'}</strong></span></p>
                <p className='total-user'>Total Users: <span className='grey'><strong>{stats?.total_users ?? 'Loading...'}</strong></span></p>
            </div>

            <h3>Freelancer Table</h3>
            <table className="dashboard-table">
                <thead>
                    <tr>
                        <th>User ID</th>
                        <th>Name</th>
                        <th>Title</th>
                        <th>Skills</th>
                        <th>Status</th>
                        <th>Resume</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {freelancers.map(f => (
                        <tr key={f.id}>
                            <td>{f.user_id}</td>
                            <td>{f.first_name} {f.last_name}</td>
                            <td>{f.title}</td>
                            <td>{f.skills}</td>
                            <td>{f.status}</td>
                            <td>
                                {f.resume_path ? (
                                    <a href={`http://localhost:3000/download-resume/${f.resume_path.replace(/\\/g, '/').split('/').pop()}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        download>
                                        Download
                                    </a>
                                ) : 'N/A'}
                            </td>
                            <td>
                                <button onClick={() => handleDeleteClick(f.id)} className="delete-btn">
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <h3>Client Table</h3>
            <table className="dashboard-table">
                <thead>
                    <tr>
                        <th>User ID</th><th>Email</th><th>First Name</th><th>Last Name</th><th>Contact</th><th>City</th>
                    </tr>
                </thead>
                <tbody>
                    {clients.map(c => (
                        <tr key={c.id}>
                            <td>{c.id}</td>
                            <td>{c.email}</td>
                            <td>{c.firstname}</td>
                            <td>{c.lastname}</td>
                            <td>{c.contact}</td>
                            <td>{c.city}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {showPopup && (
                <Popup message={popupMessage} onClose={() => setShowPopup(false)} />
            )}

            {showConfirmPopup && (
                <ConfirmPopup
                    message="Are you sure you want to delete this freelancer?"
                    onConfirm={confirmDelete}
                    onCancel={cancelDelete}
                />
            )}
        </div>
    );
};

export default AdminDashboard;
