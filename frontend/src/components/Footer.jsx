import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';
import './Footer.css';
import characterLogo from '../assets/character_logo.png';  // Import the image

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-left">
                <img src={characterLogo} alt="Portfolio-Pro Logo" className="footer-logo" /> {/* Use the imported image */}
                <span className="footer-divider">|</span>
                <span className="footer-text">© 2025 Portfolio-Pro — <a href="mailto:portfolio.pro.team@gmail.com">portfolio.pro.team@gmail.com</a></span>
            </div>

            <div className="footer-right">
                <a href="#" aria-label="Facebook"><FaFacebookF /></a>
                <a href="#" aria-label="Twitter"><FaTwitter /></a>
                <a href="#" aria-label="Instagram"><FaInstagram /></a>
                <a href="#" aria-label="LinkedIn"><FaLinkedinIn /></a>
            </div>
        </footer>
    );
};

export default Footer;
