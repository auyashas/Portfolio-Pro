import { useEffect } from 'react';
import Footer from '../components/Footer';

const About = () => {
    useEffect(() => {
        document.title = "Portfolio-Pro | About Us";
    }, []);

    return (
        <>
            <div className="center">
            </div>
            <div className="terms-container">
                <div className="center">
                    <h1>About Portfolio Pro</h1>
                    <p>Empowering Freelancers, Enabling Businesses.</p>
                </div>





                <h2>Our Vision</h2>
                <p>
                    At Portfolio Pro, our vision is to create a thriving environment where talented freelancers
                    can showcase their skills, and businesses can connect with the right individuals to achieve
                    their goals. We believe in empowering individuals with a platform that fosters growth, trust,
                    and collaboration.
                </p>



                <h2>Our Mission</h2>
                <p>
                    We are committed to simplifying the freelancing journey by providing a streamlined
                    platform that makes registration, profile creation, and client communication seamless
                    and efficient. Whether you're a designer, developer, writer, or marketer, Portfolio Pro
                    helps you build your professional identity and connect with potential clients.
                </p>



                <h2>Key Features</h2>
                <ul>
                    <li>📂 Freelancer Profiles with Detailed Information — Showcase your skills, experience, and portfolio.</li>
                    <li>✅ Admin Approval for Verified Profiles — Ensures only authentic profiles are available for clients.</li>
                    <li>📥 Easy Resume Upload & Download — Freelancers can easily share their resumes, and clients can download them hassle-free.</li>
                    <li>🔍 Direct Client-Freelancer Interaction — Clients can directly connect with freelancers for quick collaboration.</li>
                </ul>



                <h2>Why Choose Portfolio Pro?</h2>
                <ul>
                    <li>- 🌐 User-Friendly Interface: Easy navigation for both freelancers and clients. <br /></li>
                    <li>- 🔒 Security First: We prioritize data privacy with secure profile management. <br /></li>
                    <li>- 🚀 Growth-Focused: Designed to help freelancers gain visibility and expand their client base.</li>
                </ul>



                <h2>Our Commitment</h2>
                <p>
                    Portfolio Pro is committed to fostering a supportive environment for freelancers by
                    providing tools that enhance their profiles and simplify their professional journey.
                    Our team constantly works on improving the platform to deliver the best experience possible.
                </p>


                <p className='terms-container-footer'>
                    For any concerns, feel free to contact us at
                    <a href='mailto:portfolio.pro.team@gmail.com'> portfolio.pro.team@gmail.com</a>
                </p>
            </div>

            <Footer />
        </>
    );
};

export default About;
