import React, { useState } from "react";
import { useParams } from "react-router-dom";

const ProfileCompletion = () => {
    const { id } = useParams();
    const [formData, setFormData] = useState({
        title: '',
        bio: '',
        skills: '',
        resume: null,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleFileChange = (e) => {
        setFormData((prevData) => ({
            ...prevData,
            resume: e.target.files[0]
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formDataToSend = new FormData();
        formDataToSend.append('title', formData.title);
        formDataToSend.append('bio', formData.bio);
        formDataToSend.append('skills', formData.skills);
        formDataToSend.append('resume', formData.resume);

        try {
            const response = await fetch(`http://localhost:3000/freelancer/${id}/complete-profile`, {
                method: 'POST',
                body: formDataToSend,
            });

            const data = await response.json();
            if (data.success) {
                alert("Profile completed successfully!");
            } else {
                alert("Something went wrong. Please try again.");
            }
        } catch (error) {
            console.error("Error completing profile:", error);
        }
    };

    return (
        <div>
            <h1>Complete Your Profile</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="title"
                    placeholder="Title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                />
                <textarea
                    name="bio"
                    placeholder="Bio"
                    value={formData.bio}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="skills"
                    placeholder="Skills"
                    value={formData.skills}
                    onChange={handleChange}
                    required
                />
                <input
                    type="file"
                    name="resume"
                    accept=".pdf, .doc, .docx"
                    onChange={handleFileChange}
                    required
                />
                <button type="submit">Submit</button>
            </form>
        </div>
    );
};

export default ProfileCompletion;
