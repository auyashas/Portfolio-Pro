import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Profile.css";

const Profile = () => {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedProfile, setUpdatedProfile] = useState({});
  const hasCheckedProfile = useRef(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (hasCheckedProfile.current) return;
    hasCheckedProfile.current = true;

    const checkProfile = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/freelancer/check/${id}`);
        if (!response.data.exists) {
          alert("Please complete your profile to continue.");
          navigate(`/freelancer/${id}/freelancer-application`);
        }
      } catch (error) {
        console.error("Error checking freelancer profile:", error);
      }
    };

    const fetchProfile = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/profile/${id}`);
        setProfile(res.data);
        setUpdatedProfile(res.data);
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };

    checkProfile();
    fetchProfile();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfileUpdate = async () => {
    try {
      const res = await axios.put(`http://localhost:3000/profile/${id}/update`, updatedProfile);
      alert(res.data.message);
      setIsEditing(false);
      setProfile(updatedProfile);
    } catch (err) {
      console.error("Error updating profile:", err);
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
            <div className="section-header">
              <h3 className="personal-detail">Personal Details</h3>
              {profile.status === "Approved" && !isEditing && (
                <button className="edit-btn" onClick={() => setIsEditing(true)}>Edit Profile</button>
              )}
            </div>

            <div className="section-body">
              {isEditing ? (
                <div className="edit-form">
                  {["first_name", "last_name", "bio", "contact", "city", "country"].map((field) => (
                    <div className="form-group" key={field}>
                      <label htmlFor={field}>{field.replace('_', ' ').replace(/^\w/, c => c.toUpperCase())}</label>
                      {field === "bio" ? (
                        <textarea
                          name={field}
                          value={updatedProfile[field]}
                          onChange={handleInputChange}
                          rows="4"
                        />
                      ) : (
                        <input
                          type="text"
                          name={field}
                          value={updatedProfile[field]}
                          onChange={handleInputChange}
                          maxLength={field === "contact" ? 10 : undefined}
                        />
                      )}
                    </div>
                  ))}
                  <button className="save-btn" onClick={handleProfileUpdate}>Save Changes</button>
                </div>
              ) : (
                <>
                  <p><strong>Bio:</strong> {profile.bio}</p>
                  <p><strong>Email:</strong> {profile.email}</p>
                  <p><strong>Contact:</strong> {profile.contact}</p>
                  <p><strong>City:</strong> {profile.city}</p>
                  <p><strong>Country:</strong> {profile.country}</p>
                </>
              )}
            </div>
          </div>

          <div className="section">
            <div className="section-header">
              <h3>Professional Details</h3>
            </div>
            <div className="section-body">
              <p><strong>Title:</strong> {profile.title}</p>
              <p><strong>Skills:</strong> {profile.skills}</p>
              <p><strong>Experience:</strong> {profile.experience}</p>
              <p><strong>Application Status:</strong> {profile.status}</p>

              {profile.social_links && (
                <p><strong>Portfolio:</strong> <a href={profile.social_links} target="_blank" rel="noopener noreferrer">{profile.social_links}</a></p>
              )}
              {profile.resume_path && (
                <p>
                  <a
                    href={`http://localhost:3000/download-resume/${profile.resume_path.replace(/\\/g, '/').split('/').pop()}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    download
                    className="download-resume-btn"
                  >
                    Download Resume
                  </a>
                </p>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Profile;
