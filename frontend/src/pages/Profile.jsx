import React from "react";
import ProfileCard from "../components/ProfileCard";
import "../styles/Profile.css"
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Profile = () => {
  const freelancer = {
    name: "Yashas",
    email: "yashas@gmail.com",
    phone: "9876543210",
    bio: "Hi al Yashas here, I am a full stack developer with 3 years of experience in building web applications. I have expertise in React, Node.js, MySQL, and Express.",
    portfolio: "portfolio.com/johndoe",
    resume: "../assets/AUYashas2025.pdf",
    skills: "Full Stack Developer",
    experience: "3 years",
    location: "Bangalore, India",
    profilePic: "src/assets/Yashas.jpg",
  };

  return (
    <>
      <div className="flex justify-center">
        <Navbar />
      </div>
      <div className="freelancer-container">
        <ProfileCard freelancer={freelancer} />
      </div>
      {/* <Footer /> */}
    </>
  );
};

export default Profile;
