import './Hero.css';

export default function Hero() {
    return (
        <>
            <div className="top">
                <div className='flex justify-center'>
                </div>  
                <div className="info">
                    <div className="info-text">
                        <h1>Are you looking for <span className="highlight">Freelancer?</span></h1>
                        <p>Finding the right talent has never been easier! Connect with skilled freelancers who can bring your ideas to life. Whether you need a designer, developer, or writer, we've got you covered. Explore top professionals and get your work done effortlessly!</p>
                    </div>
                    <div className="info-img"><img src="src/assets/image2.png" alt="" /></div>
                </div>
            </div>
            <div className="service">
                <div className="service-card">
                    <div className="circle"></div>
                    <img src="src/icons/search.png" alt="" />
                    <h3>Find Best Freelancer</h3>
                    <p>Search and hire the best freelancers for your work.</p>
                </div>
                <div className="service-card">
                    <div className="circle"></div>
                    <img src="src/icons/contact.png" alt="" />
                    <h3>Contact</h3>
                    <p>Connect with freelancers and collaborate directly.</p>
                </div>
                <div className="service-card">
                    <div className="circle"></div>
                    <img src="src/icons/account.png" alt="" />
                    <h3>Create Account</h3>
                    <p>Sign up as a freelancer and showcase your skills.</p>
                </div>
            </div>
        </>
    );
}
