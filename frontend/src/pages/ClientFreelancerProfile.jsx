import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Mail, Phone, MapPin, Globe, X } from 'lucide-react';

const ClientFreelancerProfile = () => {
  const { id, freelancerid } = useParams(); // client id and freelancer id from URL
  const [profile, setProfile] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false); // loading state for form submission

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
        client_name: formData.client_name,
        ...formData
      });

      alert('Hire request sent successfully!');
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
      alert('Failed to send hire request.');
    } finally {
      setLoading(false);
    }
  };

  if (!profile) return <div className="text-center mt-20 text-lg">Loading...</div>;

  return (
    <div className="flex justify-center p-10 min-h-screen relative">
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

          <div className="border-b pb-4">
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Professional Details</h3>
            <div className="text-gray-600 space-y-1">
              <p><strong>Title:</strong> {profile.title}</p>
              <p><strong>Skills:</strong> {profile.skills}</p>
              <p><strong>Experience:</strong> {profile.experience} years</p>
              <p><strong>Status:</strong> {profile.status}</p>

              {profile.social_links && (
                <p className="flex items-center gap-2 mt-2">
                  <Globe size={18} />
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
            </div>
          </div>

          {profile.resume_path && (
            <div>
              <a
                href={`http://localhost:3000/download-resume/${profile.resume_path.replace(/\\/g, '/').split('/').pop()}`}
                target="_blank"
                rel="noopener noreferrer"
                download
                className="inline-block mt-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Download Resume
              </a>
            </div>
          )}

          <div className="mt-6">
            <button
              onClick={() => setShowForm(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded text-lg inline-flex items-center gap-2"
            >
              <Mail size={18} /> Hire Freelancer
            </button>
          </div>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-transparent flex items-center justify-center z-50 backdrop-blur-sm">
          <form
            onSubmit={handleSubmit}
            className="bg-white p-6 rounded-xl shadow-md w-full max-w-md space-y-4 relative"
          >
            {loading && (
              <div className="absolute top-0 left-0 w-full h-full bg-white/60 rounded-xl flex items-center justify-center z-10">
                <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-indigo-600 border-solid"></div>
              </div>
            )}

            <button
              type="button"
              onClick={() => !loading && setShowForm(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
              disabled={loading}
            >
              <X size={20} />
            </button>

            <h3 className="text-xl font-semibold text-gray-800 mb-2">Hire Freelancer</h3>

            <input
              type="text"
              name="job_title"
              value={formData.job_title}
              onChange={handleInputChange}
              placeholder="Job Title"
              required
              className="w-full px-4 py-2 border rounded"
            />

            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Job Description"
              required
              className="w-full px-4 py-2 border rounded h-24"
            />

            <input
              type="text"
              name="client_name"
              value={formData.client_name}
              onChange={handleInputChange}
              placeholder="Your Name"
              required
              className="w-full px-4 py-2 border rounded"
            />

            <input
              type="email"
              name="client_email"
              value={formData.client_email}
              onChange={handleInputChange}
              placeholder="Your Email"
              required
              className="w-full px-4 py-2 border rounded"
            />

            <input
              type="text"
              name="client_contact"
              value={formData.client_contact}
              onChange={handleInputChange}
              placeholder="Your Contact"
              required
              className="w-full px-4 py-2 border rounded"
            />

            <button
              type="submit"
              disabled={loading}
              className={`bg-indigo-600 text-white px-4 py-2 rounded w-full ${
                loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-indigo-700'
              }`}
            >
              {loading ? 'Sending Request...' : 'Send Request'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ClientFreelancerProfile;
