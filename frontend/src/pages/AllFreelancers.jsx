// src/pages/AllFreelancers.jsx

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import "../styles/allFreelancers.css";

const AllFreelancers = () => {
    const role = location.pathname.includes('/admin') ? 'admin' :
                 location.pathname.includes('/freelancer') ? 'freelancer' :
                 location.pathname.includes('/client') ? 'client' : null;
    const { id } = useParams();
    const [freelancers, setFreelancers] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        document.title = "Portfolio-Pro | Freelancers";
        
        const fetchFreelancers = async () => {
            try {
                const response = await axios.get("http://localhost:3000/freelancers/approved");
                setFreelancers(response.data);
            } catch (error) {
                console.error("Error fetching freelancers:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchFreelancers();
    }, []);
    
    const url=(fid)=>{
        if (role === 'admin') {
            return `/${role}/profile/${fid}`;
        }else if(role === 'freelancer' && id == fid){
            return `/${role}/${id}/profile`;
        }
        else{
            return `/${role}/${id}/profile/${fid}`;
        }
    }
    if (loading) return <p className="loading">Loading freelancers...</p>;

    return (
        <div className="freelancer-page">
            <h2 className="main-title">All Freelancers</h2>
            {freelancers.length === 0 ? (
                <p className="empty-message">No approved freelancers found.</p>
            ) : (
                <div className="freelancer-container">
                    {freelancers.map((freelancer) => (
                        <div className="freelancer-card" key={freelancer.freelancer_id}>
                            <img
                                src={`http://localhost:3000/${freelancer.profile_pic_path}`}
                                alt={`${freelancer.first_name} ${freelancer.last_name}`}
                                className="freelancer-img"
                            />
                            <h3 className="freelancer-name">
                                <Link to={`/client/${id}/profile/${freelancer.user_id}`}>
                                    {freelancer.first_name} {freelancer.last_name}
                                </Link>
                            </h3>
                            <p className="freelancer-title">{freelancer.title}</p>
                            <p><strong>Skills:</strong> {freelancer.skills}</p>
                            <p><strong>Experience:</strong> {freelancer.experience} years</p>
                            <Link to={`${url(freelancer.user_id)}`}>
                                <button className="view-btn">View Profile</button>
                            </Link>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AllFreelancers;
