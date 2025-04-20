// src/pages/admin/AdminProfile.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Use useNavigate
import axios from 'axios';
import '../styles/Profile.css';

const AdminProfile = () => {
  const { id } = useParams(); // This is the freelancer ID
  const navigate = useNavigate(); // Use useNavigate for routing
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
        navigate('/admin/applications'); // Redirect to the admin dashboard after rejection

    } catch (err) {
      console.error('Error rejecting profile:', err);
    }
  };

  const handleDelete = async () => {
    try {
      const res = await axios.delete(`http://localhost:3000/admin/profile/${id}`);
      alert(res.data.message);
      navigate('/admin/dashboard'); // Redirect to the admin dashboard after deletion
    } catch (err) {
      console.error('Error deleting profile:', err);
    }
  };

  if (!profile) return <div className="text-center mt-20 text-lg">Loading...</div>;

  return (
    <div className="flex justify-center p-10 min-h-screen">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-5xl flex gap-8">
        <div className="w-1/3 flex justify-center items-start">
          <img
            src={`http://localhost:3000/${profile.profile_pic_path}`}
            alt="Profile"
            className="rounded-xl w-48 h-48 object-cover shadow"
          />
        </div>

        <div className="w-2/3 space-y-6">
          <h2 className="text-3xl font-bold text-gray-800">{profile.first_name} {profile.last_name}</h2>

          <div className="border-b pb-4">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold text-gray-700">Personal Details</h3>
            </div>
            <div className="mt-2 text-gray-600 space-y-1">
              <p><strong>Bio:</strong> {profile.bio}</p>
              <p><strong>Email:</strong> {profile.email}</p>
              <p><strong>Contact:</strong> {profile.contact}</p>
              <p><strong>City:</strong> {profile.city}</p>
              <p><strong>Country:</strong> {profile.country}</p>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-gray-700">Professional Details</h3>
            <div className="mt-2 text-gray-600 space-y-1">
              <p><strong>Title:</strong> {profile.title}</p>
              <p><strong>Skills:</strong> {profile.skills}</p>
              <p><strong>Experience:</strong> {profile.experience}</p>
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

              {profile.status === 'Pending' && (
                <div className="mt-4 flex space-x-4">
                  <button
                    onClick={handleApprove}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    Approve
                  </button>
                  <button
                    onClick={handleReject}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  >
                    Reject
                  </button>
                </div>
              )}
              {profile.status === 'Approved' && (
                <div className="mt-4">
                  <button
                    onClick={handleDelete}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  >
                    Delete Profile
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
