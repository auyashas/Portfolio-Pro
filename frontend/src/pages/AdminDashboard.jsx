import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/AdminDashboard.css'; // optional styling

const AdminDashboard = () => {
    const [freelancers, setFreelancers] = useState([]);
    const [clients, setClients] = useState([]);
    const [stats, setStats] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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

    const deleteFreelancer = async (id) => {
        const confirm = window.confirm("Are you sure you want to delete this freelancer?");
        if (!confirm) return;
        try {
            setLoading(true);
            await axios.post(`http://localhost:3000/admin/application/${id}`, { status: 'reject' });
            alert("Freelancer Account deleted.");
            window.location.reload();
        } catch (error) {
            console.error("Error rejecting freelancer:", error);
            alert("Failed to reject freelancer.");
        }finally {
            setLoading(false);
        } 
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
                <p>Total Users: <span className='grey'><strong>{stats?.total_users ?? 'Loading...'}</strong></span></p>
            </div>

            <h3>Freelancer Table</h3>
            <table className="dashboard-table">
                <thead>
                    <tr>
                        <th>ID</th>
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
                            <td>{f.id}</td>
                            <td>{f.first_name} {f.last_name}</td>
                            <td>{f.title}</td>
                            <td>{f.skills}</td>
                            <td>{f.status}</td>
                            <td>
                                {f.resume_path ? (
                                    <a href={`http://localhost:3000/${f.resume_path}`} target="_blank" rel="noopener noreferrer">
                                        Download
                                    </a>
                                ) : 'N/A'}
                            </td>
                            <td>
                                <button onClick={() => deleteFreelancer(f.id)} className="delete-btn">Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <h3>Client Table</h3>
            <table className="dashboard-table">
                <thead>
                    <tr>
                        <th>ID</th><th>Email</th><th>First Name</th><th>Last Name</th><th>Contact</th><th>City</th>
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
        </div>
    );
};

export default AdminDashboard;
