import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Mail, X } from 'lucide-react';
import '../styles/Profile.css';
import Popup from '../components/Popup';
 // import your popup

const ClientFreelancerProfile = () => {
  const { id, freelancerid } = useParams();
  const [profile, setProfile] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const [popupMessage, setPopupMessage] = useState('');
  const [showPopup, setShowPopup] = useState(false);

  const [formData, setFormData] = useState({
    job_title: '',
    description: '',
    client_name: '',
    client_email: '',
    client_contact: ''
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/admin/profile/${freelancerid}`);
        setProfile(res.data);
      } catch (err) {
        console.error('Error fetching profile:', err);
      }
    };
    fetchProfile();
  }, [freelancerid]);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && showForm) setShowForm(false);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [showForm]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('http://localhost:3000/hire-freelancer', {
        freelancer_id: freelancerid,
        client_id: id,
        ...formData
      });

      setPopupMessage('Hire request sent successfully!');
      setShowPopup(true);

      setFormData({
        job_title: '',
        description: '',
        client_name: '',
        client_email: '',
        client_contact: ''
      });
      setShowForm(false);
    } catch (err) {
      console.error('Error sending hire request:', err);
      setPopupMessage('Failed to send hire request.');
      setShowPopup(true);
    } finally {
      setLoading(false);
    }
  };

  if (!profile) return <div className="loading-message">Loading...</div>;

  return (
    <div className="profile-containr">
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
            <button onClick={() => setShowForm(true)} className="hire-button">
              <Mail size={18} /> Hire Freelancer
            </button>
          </div>
        </div>
      </div>

      {showForm && (
        <div className="hire-form-backdrop">
          <form onSubmit={handleSubmit} className="hire-form">
            {loading && (
              <div className="loading-background">
                <div className="loading-bounce">
                  <div></div>
                  <div></div>
                  <div></div>
                </div>
              </div>
            )}

            <button type="button" onClick={() => !loading && setShowForm(false)} className="close-btn" disabled={loading}>
              <X size={20} />
            </button>

            <h3 className="form-title">Hire Freelancer</h3>

            <input type="text" name="job_title" value={formData.job_title} onChange={handleInputChange} placeholder="Job Title" required className="form-input" />
            <textarea name="description" value={formData.description} onChange={handleInputChange} placeholder="Job Description" required className="form-textarea" />
            <input type="text" name="client_name" value={formData.client_name} onChange={handleInputChange} placeholder="Your Name" required className="form-input" />
            <input type="email" name="client_email" value={formData.client_email} onChange={handleInputChange} placeholder="Your Email" required className="form-input" />
            <input type="text" name="client_contact" value={formData.client_contact} onChange={handleInputChange} placeholder="Your Contact" required className="form-input" />

            <button type="submit" disabled={loading} className={`submit-btn ${loading ? 'disabled' : ''}`}>
              {loading ? 'Sending Request...' : 'Send Request'}
            </button>
          </form>
        </div>
      )}

      {/* Popup Component */}
      {showPopup && (
        <Popup
          message={popupMessage}
          onClose={() => setShowPopup(false)}
          show={showPopup}
        />
      )}
    </div>
  );
};

export default ClientFreelancerProfile;
