import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import '../styles/Profile.css';

const Profile = () => {
  const { id } = useParams(); // This is the freelancer ID
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedProfile, setUpdatedProfile] = useState({});

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/profile/${id}`);
        setProfile(res.data);
        setUpdatedProfile(res.data); // Set the initial profile state for editing
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };

    fetchProfile();
  }, [id]);

  // Handle input changes in the edit form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedProfile((prevProfile) => ({
      ...prevProfile,
      [name]: value,
    }));
  };

  // Handle profile update form submission
  const handleProfileUpdate = async () => {
    try {
      const res = await axios.put(`http://localhost:3000/profile/${id}/update`, updatedProfile);
      alert(res.data.message);
      setIsEditing(false); // Exit edit mode
      setProfile(updatedProfile); // Update profile state with the new values
    } catch (err) {
      console.error("Error updating profile:", err);
    }
  };

  if (!profile) return <div className="text-center mt-20 text-lg">Loading...</div>;

  return (
    <div className="flex justify-center p-10 min-h-screen">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-5xl flex gap-8">
        
        {/* Profile Picture */}
        <div className="w-1/3 flex justify-center items-start">
          <img
            src={`http://localhost:3000/${profile.profile_pic_path}`}
            alt="Profile"
            className="rounded-xl w-48 h-48 object-cover shadow"
          />
        </div>

        {/* Right Side */}
        <div className="w-2/3 space-y-6">
          {/* Name */}
          <h2 className="text-3xl font-bold text-gray-800">
            {profile.first_name} {profile.last_name}
          </h2>

          {/* Personal Details */}
          <div className="border-b pb-4">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold text-gray-700">Personal Details</h3>
              {/* Conditionally render the Edit button */}
              {profile.status === "Approved" && !isEditing && (
                <button
                  className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
                  onClick={() => setIsEditing(true)}
                >
                  Edit Profile
                </button>
              )}
            </div>
            <div className="mt-2 text-gray-600 space-y-1">
              {isEditing ? (
                <>
                  {/* Editable fields for name, bio, contact, city, and country */}
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <label htmlFor="first_name" className="w-1/3 text-gray-700">First Name</label>
                      <input
                        type="text"
                        name="first_name"
                        value={updatedProfile.first_name}
                        onChange={handleInputChange}
                        className="w-2/3 px-4 py-2 border border-gray-300 rounded"
                        placeholder="First Name"
                      />
                    </div>
                    <div className="flex items-center">
                      <label htmlFor="last_name" className="w-1/3 text-gray-700">Last Name</label>
                      <input
                        type="text"
                        name="last_name"
                        value={updatedProfile.last_name}
                        onChange={handleInputChange}
                        className="w-2/3 px-4 py-2 border border-gray-300 rounded"
                        placeholder="Last Name"
                      />
                    </div>
                    <div className="flex items-center">
                      <label htmlFor="bio" className="w-1/3 text-gray-700">Bio</label>
                      <textarea
                        name="bio"
                        value={updatedProfile.bio}
                        onChange={handleInputChange}
                        className="w-2/3 px-4 py-2 border border-gray-300 rounded"
                        rows="4"
                        placeholder="Bio"
                      />
                    </div>
                    <div className="flex items-center">
                      <label htmlFor="contact" className="w-1/3 text-gray-700">Contact</label>
                      <input
                        type="text"
                        name="contact"
                        value={updatedProfile.contact}
                        onChange={handleInputChange}
                        className="w-2/3 px-4 py-2 border border-gray-300 rounded mt-2"
                        placeholder="Contact"
                      />
                    </div>
                    <div className="flex items-center">
                      <label htmlFor="city" className="w-1/3 text-gray-700">City</label>
                      <input
                        type="text"
                        name="city"
                        value={updatedProfile.city}
                        onChange={handleInputChange}
                        className="w-2/3 px-4 py-2 border border-gray-300 rounded mt-2"
                        placeholder="City"
                      />
                    </div>
                    <div className="flex items-center">
                      <label htmlFor="country" className="w-1/3 text-gray-700">Country</label>
                      <input
                        type="text"
                        name="country"
                        value={updatedProfile.country}
                        onChange={handleInputChange}
                        className="w-2/3 px-4 py-2 border border-gray-300 rounded mt-2"
                        placeholder="Country"
                      />
                    </div>
                  </div>
                  <button
                    onClick={handleProfileUpdate}
                    className="bg-green-500 text-white px-4 py-2 rounded mt-4"
                  >
                    Save Changes
                  </button>
                </>
              ) : (
                <>
                  {/* Non-editable fields */}
                  <p><strong>Bio:</strong> {profile.bio}</p>
                  <p><strong>Email:</strong> {profile.email}</p>
                  <p><strong>Contact:</strong> {profile.contact}</p>
                  <p><strong>City:</strong> {profile.city}</p>
                  <p><strong>Country:</strong> {profile.country}</p>
                </>
              )}
            </div>
          </div>

          {/* Professional Details */}
          <div>
            <h3 className="text-xl font-semibold text-gray-700">Professional Details</h3>
            <div className="mt-2 text-gray-600 space-y-1">
              <p><strong>Title:</strong> {profile.title}</p>
              <p><strong>Skills:</strong> {profile.skills}</p>
              <p><strong>Experience:</strong> {profile.experience}</p>

              {/* Display Application Status */}
              <div className="mt-4">
                <p><strong>Application Status:</strong> {profile.status}</p>
              </div>

              {profile.social_links && (
                <p>
                  <strong>Portfolio:</strong>{" "}
                  <a
                    href={profile.social_links}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 underline"
                  >
                    {profile.social_links}
                  </a>
                </p>
              )}

              {profile.resume_path && (
                <p>
                  <a
                    href={`http://localhost:3000/${profile.resume_path}`}
                    download
                    className="inline-block mt-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
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
