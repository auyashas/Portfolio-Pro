import './Hero.css';
import image2 from '../assets/image2.png';  // Import the image correctly
import searchIcon from '../icons/search.png';  // Import icons
import contactIcon from '../icons/contact.png';
import accountIcon from '../icons/account.png';
import { Link, useParams } from 'react-router-dom';

export default function Hero() {
    const role = location.pathname.includes('/admin') ? 'admin' :
                 location.pathname.includes('/freelancer') ? 'freelancer' :
                 location.pathname.includes('/client') ? 'client' : null;
    const { id } = useParams();  // Get the client ID from the URL
    const option=()=>{
        if (role === 'freelancer') {
            return "View Freelancers";
        } else if (role === 'client') {
            return "Hire a Freelancer";
        } else if (role === 'admin') {
            return "View All Freelancers";
        }
    }
    const url=()=>{
        if (role === 'admin') {
            return `/${role}/all`;
        }{
            return `/${role}/${id}/all`;
        }
    }
    return (
        <>
            <div className="top">
                <div className="flex justify-center"></div>
                <div className="info">
                    <div className="info-text">
                        <h1>Are you looking for <span className="highlight">Freelancer?</span></h1>
                        <p>Finding the right talent has never been easier! Connect with skilled freelancers who can bring your ideas to life. Whether you need a designer, developer, or writer, we've got you covered. Explore top professionals and get your work done effortlessly!</p>
                        {role?(<Link to={url()}>
                            <button className="hire-btn">{option()}</button>
                        </Link>):(<Link to={`/login`}>
                            <button className="hire-btn">Login to Hire</button>
                        </Link>)}
                        
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
