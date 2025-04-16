import { useEffect } from 'react';
import Footer from '../components/Footer';

const Terms = () => {
    useEffect(() => {
        document.title = "Portfolio-Pro | Terms & Conditions";
    }, []);

    return (
        <>
            <div className="terms-container">
                <h1>Terms and Conditions</h1>
                <p>Welcome to Portfolio-Pro. By using our platform, you agree to the following terms:</p>

                <ul>
                    <li>Freelancers must submit genuine information during registration.</li>
                    <li>Admins reserve the right to approve or reject freelancer profiles.</li>
                    <li>Clients are responsible for contacting freelancers directly; Portfolio-Pro does not facilitate transactions.</li>
                    <li>Uploaded resumes must not contain inappropriate content.</li>
                    <li>Freelancers are responsible for ensuring their work meets client expectations and deadlines.</li>
                    <li>Portfolio-Pro does not provide dispute resolution services; users must resolve issues independently.</li>
                    <li>Spam, harassment, or unethical behavior towards other users is strictly prohibited.</li>
                    <li>Users must not upload or share content that is offensive, abusive, or harmful.</li>
                    <li>Portfolio-Pro reserves the right to modify or update these terms without prior notice.</li>
                    <li>Users are encouraged to maintain backup copies of their uploaded content and resumes.</li>
                    <li>Any attempt to manipulate ratings, reviews, or profile visibility may result in a ban.</li>
                    <li>Freelancers must comply with local laws and regulations while providing services.</li>
                    <li>Portfolio-Pro does not guarantee project opportunities for registered freelancers.</li>
                    <li>By using our website, you agree to abide by these conditions.</li>
                    <li>By continuing to use Portfolio-Pro, users consent to our data handling and privacy policies.</li>
                </ul>


                <p className='terms-container-footer'>For any concerns, feel free to contact us <a href='mailto:portfolio.pro.team@gmail.com'>portfolio.pro.team@gmail.com</a></p>
            </div>
            <Footer />
        </>
    );
};

export default Terms;
