import { useEffect } from 'react'
import './policy.css'


const PrivacyPage = () => {

    useEffect(() => {
        scroll(0, 0)
    }, [])

    
    return <div className="min-height-100">
        <br />
        <div className="center large-font margin-bottom-1">
            <h1>Privacy Policy</h1>
        </div>
        <div className="styled-container policies-container">
        <p>
            Effective Date: 2024/02/07
        </p>
        <p>
            Welcome to RA'AYA! This Privacy Policy describes how we collect, use, and protect your personal information when you access and use our platform. By using RA'AYA, you consent to the practices outlined in this policy.
        </p>
        <p className="bold-text">
            Information We Collect
        </p>
        <p>
            We may collect various types of personally identifiable information (PII) from you, including but not limited to:
            <ol>
                <li>
                    Name, email address, and contact information
                </li>
                <li>
                    Profile information, such as your expertise, qualifications, and professional background
                </li>
                <li>
                    Communications and interactions with other users
                </li>
                <li>
                    Usage data, including IP address, browser type, device information, and log data
                </li>
                <li>
                    Payment and transaction details (if applicable)
                </li>
                
            </ol>
        </p>
        <p className="bold-text">
            Use of Information
        </p>
        <p>
            We use the collected information for the following purposes:
            <ol>
                <li>
                    Creating and managing your account
                </li>
                <li>
                    Providing our services and facilitating interactions between experts and seekers
                </li>
                <li>
                    Personalizing your experience and improving our platform
                </li>
                <li>
                    Sending you relevant notifications, updates, and communications
                </li>
                <li>
                    Processing payments and maintaining financial records (if applicable)
                </li>
                <li>
                    Complying with legal obligations and protecting our rights and the rights of our users
                </li>
            </ol>
        </p>
        <p className="bold-text">
            Information Sharing
        </p>
        <p>
            We may share your information in the following circumstances:
            <ol>
                <li>
                    With seekers who are interested in your expertise and seek your services
                </li>
                <li>
                    With third-party service providers who assist us in delivering our platform and its features  
                </li>
                <li>
                    When required by law or to protect our legal rights or the safety of our users
                </li>
            </ol>
        </p>
        <p className="bold-text">
            Data Security
        </p>
        <p>
            We implement reasonable security measures to protect your personal information from unauthorized access, disclosure, alteration, or destruction. These measures include encryption, access controls, regular security audits, and employee training.
        </p>
        <p className="bold-text">
            Your Rights and Choices
        </p>
        <p>
            You have certain rights regarding your personal information, including the right to access, modify, or delete your data. You can manage your preferences and communication settings through your account settings on RA'AYA.
        </p>

        <p className="bold-text">
            Cookies and Tracking Technologies
        </p>
        <p>
            RA'AYA may use cookies and similar tracking technologies to enhance your user experience, analyze usage patterns, and gather information about our users' interactions with our platform.
        </p>

        <p className="bold-text">
            Third-Party Links
        </p>
        <p>
            Our platform may contain links to third-party websites or services. We are not responsible for the privacy practices or content of these third-party sites. We encourage you to review their privacy policies before providing any personal information.
        </p>
        <p className="bold-text">
            Updates to this Privacy Policy
        </p>
        <p>
            We may update this Privacy Policy from time to time. The updated version will be effective as of the date indicated at the beginning of the policy. We will notify you of any material changes through a prominent notice on our platform or by email.
        </p>
        <p className="bold-text">
            Contact Us
        </p>
        <p>
            If you have any questions, concerns, or requests regarding this Privacy Policy or the handling of your personal information, please contact us at raayaeg@gmail.com.
        </p>
        <p>
            Thank you for choosing RA'AYA. Your privacy is important to us, and we are committed to protecting your personal information and providing a secure and trusted platform for experts and seekers.
        </p>
        <p>
            Last Updated: 2024/02/07    
        </p>
        
        </div>
        <br />
    </div>
}

export default PrivacyPage