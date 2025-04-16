import './Hero.css';
import image2 from '../assets/image2.png';  // Import the image correctly
import searchIcon from '../icons/search.png';  // Import icons
import contactIcon from '../icons/contact.png';
import accountIcon from '../icons/account.png';

export default function Hero() {
    return (
        <>
            <div className="top">
                <div className="flex justify-center"></div>  
                <div className="info">
                    <div className="info-text">
                        <h1>Are you looking for <span className="highlight">Freelancer?</span></h1>
                        <p>Finding the right talent has never been easier! Connect with skilled freelancers who can bring your ideas to life. Whether you need a designer, developer, or writer, we've got you covered. Explore top professionals and get your work done effortlessly!</p>
                    </div>
                    <div className="info-img"><img src={image2} alt="Freelancer" /></div>  {/* Updated */}
                </div>
            </div>
            <div className="service">
                <div className="service-card">
                    <div className="circle"></div>
                    <img src={searchIcon} alt="Search" />  {/* Updated */}
                    <h3>Find Best Freelancer</h3>
                    <p>Search and hire the best freelancers for your work.</p>
                </div>
                <div className="service-card">
                    <div className="circle"></div>
                    <img src={contactIcon} alt="Contact" />  {/* Updated */}
                    <h3>Contact</h3>
                    <p>Connect with freelancers and collaborate directly.</p>
                </div>
                <div className="service-card">
                    <div className="circle"></div>
                    <img src={accountIcon} alt="Account" />  {/* Updated */}
                    <h3>Create Account</h3>
                    <p>Sign up as a freelancer and showcase your skills.</p>
                </div>
            </div>
        </>
    );
}
