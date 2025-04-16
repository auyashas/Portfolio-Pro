import React from "react";
import { FaFilter, FaMapMarkerAlt, FaRegCalendarAlt } from "react-icons/fa";

const ProfileCard = ({ freelancer }) => {
    return (
        <>
            <div className="sub-container flex justify-center align-middle">
                <div className="profile-left">
                    <img src={freelancer.profilePic} alt="Profile Image" />
                </div>
                <div className="profile-right">
                    <h3 className="name">{freelancer.name}</h3>
                    <p className="flex gap-5"><FaFilter /><span className="">{freelancer.skills}</span></p>
                    <p className="flex gap-5"><FaMapMarkerAlt /> {freelancer.location}</p>
                    <p className="flex gap-5"><FaRegCalendarAlt /> {freelancer.experience} Experience</p>

                    <h4>Bio</h4>
                    <p>{freelancer.bio}</p>

                    <h4>Contact info</h4>
                    <p>{freelancer.email}</p>
                    <p>{freelancer.phone}</p>
                    {freelancer.portfolio && (
                        <p>Portfolio: <a href={freelancer.portfolio} target="_blank" rel="noopener noreferrer">{freelancer.portfolio}</a></p>
                    )}
                    
                    <button className="resume-btn">Download Resume</button>
                </div>
            </div>
        </>
    );
};

export default ProfileCard;
