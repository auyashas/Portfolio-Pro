// src/pages/admin/AdminProfile.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; // Use useNavigate
import axios from 'axios';
import '../styles/Profile.css';

const AdminProfile = () => {
  const { freelancerid } = useParams(); // This is the freelancer ID
  const [profile, setProfile] = useState(null);

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
                    href={`http://localhost:3000/download-resume/${profile.resume_path.replace(/\\/g, '/').split('/').pop()}`}
                    target="_blank"
                    rel="noopener noreferrer"
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

export default AdminProfile;
