import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import axios from 'axios';
import '../styles/Auth.css';
import defaultProfilePic from '../assets/user.png';
import editIcon from '../assets/edit_icon.png';

const FreelancerApplication = () => {
    useEffect(() => {
        document.title = "Portfolio-Pro | Registration";
    }, []);

    const navigate = useNavigate();
    const { id } = useParams();

    const [formData, setFormData] = useState({
        profilePicture: null,
        bio: '',
        social_links: '',
        skill: '',
        experience: '',
        resume: null,
        termsAccepted: false,
        title: ''
    });

    const [profilePreview, setProfilePreview] = useState(defaultProfilePic);
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, checked, files } = e.target;

        if (name === 'profilePicture') {
            const file = files[0];
            setProfilePreview(file ? URL.createObjectURL(file) : defaultProfilePic);
            setFormData(prev => ({ ...prev, profilePicture: file || null }));
        } else if (name === 'resume') {
            setFormData(prev => ({ ...prev, resume: files[0] }));
        } else if (name === 'bio') {
            if (value.length > 350) {
                alert("Bio cannot exceed 350 characters.");
                return;
            }
            setFormData(prev => ({ ...prev, bio: value }));
        } else if (name === 'experience') {
            if (value && isNaN(value)) {
                alert("Experience must be a number.");
                return;
            }
            setFormData(prev => ({ ...prev, experience: value }));
        } else if (type === 'checkbox') {
            setFormData(prev => ({ ...prev, [name]: checked }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate before FormData creation
        const { title, bio, skill, resume, termsAccepted } = formData;

        if (!title || !bio.trim() || !skill.trim() || !resume || !termsAccepted) {
            alert("Please fill all required fields and accept the Terms & Conditions.");
            return;
        }

        const formDataToSend = new FormData();
        formDataToSend.append('user_id', id);
        formDataToSend.append('profilePicture', formData.profilePicture || 'default-user.png');
        formDataToSend.append('resume', resume);
        formDataToSend.append('bio', bio.trim());
        formDataToSend.append('social_links', formData.social_links.trim());
        formDataToSend.append('skills', skill.trim());
        formDataToSend.append('experience', formData.experience);
        formDataToSend.append('title', title);

        try {
            setIsLoading(true);
            const response = await axios.post('http://localhost:3000/freelancer/submit', formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.status === 200) {
                alert("Application submitted for approval.");
                navigate(`/freelancer/${id}`);
            }
        } catch (error) {
            console.error('Submission failed:', error);
            alert("Failed to submit application. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className='flex-col center'>
            <div className="auth-box">
                <div className="auth-header">
                    <header>Freelancer Application</header>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="profile-container">
                        <img src={profilePreview} alt="Profile Preview" className="profile-preview" />
                        <label htmlFor="profile-upload" className="edit-icon">
                            <img src={editIcon} alt="Edit Icon" />
                        </label>
                        <input
                            type="file"
                            id="profile-upload"
                            className="hidden-input"
                            name="profilePicture"
                            accept="image/*"
                            onChange={handleChange}
                        />
                    </div>

                    <div className="input-box">
                        <select
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            className="input-field"
                            required
                        >
                            <option value="" disabled>Select your job role*</option>
                            <option value="Web Developer">Web Developer</option>
                            <option value="Mobile App Developer">Mobile App Developer</option>
                            <option value="UI/UX Designer">UI/UX Designer</option>
                            <option value="Data Analyst">Data Analyst</option>
                            <option value="Digital Marketer">Digital Marketer</option>
                            <option value="Graphic Designer">Graphic Designer</option>
                            <option value="Content Writer">Content Writer</option>
                            <option value="Video Editor">Video Editor</option>
                            <option value="SEO Specialist">SEO Specialist</option>
                            <option value="Cybersecurity Specialist">Cybersecurity Specialist</option>
                            <option value="Cloud Engineer">Cloud Engineer</option>
                            <option value="DevOps Engineer">DevOps Engineer</option>
                            <option value="Game Developer">Game Developer</option>
                            <option value="Software Tester">Software Tester</option>
                            <option value="IT Support Specialist">IT Support Specialist</option>

                        </select>

                        <textarea
                            name="bio"
                            placeholder="Bio (max 350 characters)*"
                            rows="3"
                            value={formData.bio}
                            onChange={handleChange}
                            className="input-field"
                            required
                        ></textarea>

                        <input
                            type="text"
                            name="skill"
                            placeholder="Skills (comma separated)*"
                            value={formData.skill}
                            onChange={handleChange}
                            className="input-field"
                            required
                        />

                        <input
                            type="text"
                            name="experience"
                            placeholder="Experience (in years)"
                            value={formData.experience}
                            onChange={handleChange}
                            className="input-field"
                        />

                        <div className="resume-container">
                            <label htmlFor="resume-upload" className="input-field resume-label">
                                Upload Resume (PDF/DOCX)*
                            </label>
                            <input
                                type="file"
                                id="resume-upload"
                                name="resume"
                                accept=".pdf,.docx"
                                onChange={handleChange}
                                className="file-input"
                                required
                            />
                            {formData.resume && <p className="file-name">Selected File: {formData.resume.name}</p>}
                        </div>

                        <input
                            type="text"
                            name="social_links"
                            placeholder="Social Links (comma separated)"
                            value={formData.social_links}
                            onChange={handleChange}
                            className="input-field"
                        />
                    </div>

                    <label className="terms-container">
                        <div className="terms-link">
                            <input
                                type="checkbox"
                                name="termsAccepted"
                                checked={formData.termsAccepted}
                                onChange={handleChange}
                            />
                            <p>By signing in, you agree to our <Link to="/terms">Terms & Conditions</Link>.</p>
                        </div>
                    </label>
                    <div className="input-submit load">
                        <button className="submit-btn" disabled={isLoading}>
                            {isLoading ? "Registering..." : "Register"}
                        </button>
                        {isLoading && <div className="spinner"></div>}
                    </div>
                    <div className="form-warning">
                        ⚠️ <strong>Note:</strong> The following fields cannot be changed once submitted:
                        <span style={{ color: 'darkred' }}> Title, Skills, Resume, and Experience.</span>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default FreelancerApplication;
