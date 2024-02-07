import { NavLink } from "react-router-dom"
import './footer.css'


const Footer = () => {

    const SUPPORT_LINK = 'https://wa.me/201555415331'

    return <div>
    <div className="footer-container page-side-padding">
        <div>
            <div className="footer-logo-container">
                <strong>RA'AYA</strong>
                <p>
                Unlock the power of knowledge with our platform. Connect directly 
                with experts in various fields for personalized advice and insights. Empower yourself and achieve your goals with RA'AYA.
                </p>
            </div>
        </div>
        <div className="footer-links-container">
            <strong>Resources</strong>
            <div>
                <ul>
                    <li>
                        <NavLink to="/">
                            Home
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/find-expert">
                            Find Expert
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to={SUPPORT_LINK}>
                            Support
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/policies/refund">
                            Refund Policy
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/policies/experiences">
                            Session Experience
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/policies/privacy">
                            Privacy Policy
                        </NavLink>
                    </li>
                </ul>
            </div>
            <div className="footer-links-buttons-container">
                <NavLink to="/auth/signup" className="normal-button main-color-text main-color-border bold-text">Join as Client</NavLink>
                <NavLink to="/expert-verification" className="normal-button main-color-text main-color-border bold-text">Join as Expert</NavLink>
            </div>
        </div>
        <div id="contact-us">
            <div className="footer-links-container">
                <strong>Contact Us</strong>
                <p>
                    Email: raayaeg@gmail.com
                </p>
                <p className="no-space">
                    Phone: +201065630331
                </p>
            </div>
        </div>
    </div>
    <div className="home-rights-container center">
        <span>
            All rights reserved to <strong className="main-color-text">Agile</strong> 2023
        </span>
    </div>
</div>
}

export default Footer