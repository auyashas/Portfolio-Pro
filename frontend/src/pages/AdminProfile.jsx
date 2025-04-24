// src/pages/admin/AdminProfile.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Profile.css';

const AdminProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/admin/profile/${id}`);
        setProfile(res.data);
      } catch (err) {
        console.error('Error fetching profile:', err);
      }
    };

    fetchProfile();
  }, [id]);

  const handleApprove = async () => {
    try {
      await axios.post(`http://localhost:3000/admin/application/${profile.id}`, { status: 'approve' });
      alert("Freelancer approved!");
      navigate('/admin/applications');
    } catch (err) {
      console.error('Error approving profile:', err);
    }
  };

  const handleReject = async () => {
    try {
      await axios.post(`http://localhost:3000/admin/application/${profile.id}`, { status: 'reject' });
      alert("Freelancer Account deleted.");
      navigate('/admin/applications');
    } catch (err) {
      console.error('Error rejecting profile:', err);
    }
  };

  const handleDelete = async () => {
    try {
      const res = await axios.delete(`http://localhost:3000/admin/profile/${id}`);
      alert(res.data.message);
      navigate('/admin/dashboard');
    } catch (err) {
      console.error('Error deleting profile:', err);
    }
  };

  if (!profile) return <div className="loading-text">Loading...</div>;

  return (
    <div className="profile-container">
      <div className="profile-card">
        {/* Profile Picture */}
        <div className="profile-pic-wrapper">
          <img
            src={`http://localhost:3000/${profile.profile_pic_path}`}
            alt="Profile"
            className="profile-pic"
          />
        </div>

        {/* Freelancer Details */}
        <div className="profile-details">
          <h2 className="profile-name">{profile.first_name} {profile.last_name}</h2>

          <div className="section personal-section">
            <h3>Personal Details</h3>
            <div className="section-body">
              <p><span className='detail-heading'>Bio:</span> {profile.bio}</p>
              <p><span className='detail-heading'>Email:</span> {profile.email}</p>
              <p><span className='detail-heading'>Contact:</span> {profile.contact}</p>
              <p><span className='detail-heading'>City:</span> {profile.city}</p>
              <p><span className='detail-heading'>Country:</span> {profile.country}</p>
            </div>
          </div>

          <div className="section professional-section">
            <h3>Professional Details</h3>
            <div className="section-body">
              <p><span className='detail-heading'>Title:</span> {profile.title}</p>
              <p><span className='detail-heading'>Skills:</span> {profile.skills}</p>
              <p><span className='detail-heading'>Experience:</span> {profile.experience} years</p>
              <p><span className='detail-heading'>Status:</span> {profile.status}</p>
              {profile.social_links && (
                <p><span className='detail-heading'>Portfolio:</span> <a className='blue' href={profile.social_links} target="_blank" rel="noopener noreferrer">{profile.social_links}</a></p>
              )}
            </div>
          </div>

          {/* Resume & Hire Button */}
          <div className="buttons">
            {profile.resume_path && (
              <a
                href={`http://localhost:3000/download-resume/${profile.resume_path.replace(/\\/g, '/').split('/').pop()}`}
                target="_blank"
                rel="noopener noreferrer"
                download
                className="download-resume-btn"
              >
                Download Resume
              </a>
            )}
            {profile.status === 'Pending' && (
              <div className="btn-group">
                <button onClick={handleApprove} className="approve-button">Approve</button>
                <button onClick={handleReject} className="reject-button">Reject</button>
              </div>
            )}

            {profile.status === 'Approved' && (
              <div className="btn-group">
                <button onClick={handleDelete} className="delete-button">Delete Profile</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
