import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Profile.css';
import ConfirmPopup from '../components/ConfirmPopup';
import Popup from '../components/Popup'; // <-- Importing the basic popup

const AdminProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [showMessagePopup, setShowMessagePopup] = useState(false);
  const [action, setAction] = useState(null);

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

  const handleAction = async () => {
    try {
      if (action === 'approve') {
        await axios.post(`http://localhost:3000/admin/application/${profile.id}`, { status: 'approve' });
        setPopupMessage('Freelancer approved!');
      } else if (action === 'reject') {
        await axios.post(`http://localhost:3000/admin/application/${profile.id}`, { status: 'reject' });
        setPopupMessage('Freelancer Account deleted.');
      } else if (action === 'delete') {
        await axios.delete(`http://localhost:3000/admin/profile/${id}`);
        setPopupMessage('Profile deleted successfully!');
      }
      setShowMessagePopup(true); // Show success popup
    } catch (err) {
      console.error(`Error performing ${action} action:`, err);
    } finally {
      setShowPopup(false);
    }
  };

  const handleApprove = () => {
    setAction('approve');
    setShowPopup(true);
  };

  const handleReject = () => {
    setAction('reject');
    setShowPopup(true);
  };

  const handleDelete = () => {
    setAction('delete');
    setShowPopup(true);
  };

  const handlePopupClose = () => {
    setShowMessagePopup(false);
    navigate('/admin/applications');
  };

  if (!profile) return <div className="loading-text">Loading...</div>;

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-pic-wrapper">
          <img
            src={`http://localhost:3000/${profile.profile_pic_path}`}
            alt="Profile"
            className="profile-pic"
          />
        </div>

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

      {showPopup && (
        <ConfirmPopup
          message={`Are you sure you want to ${action} this freelancer?`}
          onConfirm={handleAction}
          onCancel={() => setShowPopup(false)}
        />
      )}

      {showMessagePopup && (
        <Popup
          message={popupMessage}
          onClose={handlePopupClose}
        />
      )}
    </div>
  );
};

export default AdminProfile;
