// src/pages/jobRequest.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import axios from 'axios';
import '../styles/jobRequest.css';

const JobRequest = () => {
  const { id } = useParams();
  const [jobRequests, setJobRequests] = useState([]);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/job-requests/${id}`, {
          withCredentials: true,
        });
        setJobRequests(res.data);
      } catch (error) {
        console.error('Error fetching job requests:', error);
      }
    };

    fetchRequests();
  }, []);

  return (
    <div className="job-request-page">
      <h2 className="title">Job Request List</h2>
      {jobRequests.length === 0 ? (
        <p className="empty-message">No job requests found.</p>
      ) : (
        <div className="job-request-container">
          {jobRequests.map((request) => (
            <div className="job-card" key={request.job_id}>
              <p><strong>Freelancer Name:</strong> {request.freelancer_name}</p>
              <p><strong>Freelancer Email:</strong> {request.freelancer_email}</p>
              <p><strong>Job Title:</strong> {request.job_title}</p>
              <p><strong>Status:</strong> <span className={`status ${request.status.toLowerCase()}`}>{request.status}</span></p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default JobRequest;
