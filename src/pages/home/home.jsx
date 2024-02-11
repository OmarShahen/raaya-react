import { useEffect } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import './home.css'
import languageImage from '../../assets/Bilingual.svg'
import securityImage from '../../assets/security.svg'
import answersImage from '../../assets/answers.svg'
import paymentImage from '../../assets/payments.svg'
import supportImage from '../../assets/support.svg'
import followImage from '../../assets/follow.svg'
import helpImage from '../../assets/help.svg'
import homeImage from '../../assets/home.svg'
import ScreenSearchDesktopOutlinedIcon from '@mui/icons-material/ScreenSearchDesktopOutlined'
import BookOnlineOutlinedIcon from '@mui/icons-material/BookOnlineOutlined'
import MarkUnreadChatAltOutlinedIcon from '@mui/icons-material/MarkUnreadChatAltOutlined'
import DuoOutlinedIcon from '@mui/icons-material/DuoOutlined'
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined'
import { motion } from 'framer-motion'

const HomePage = () => {

    const navigate = useNavigate()

    useEffect(() => {
        scroll(0, 0)
        document.title = 'Home'
    }, [])

    const SUPPORT_LINK = 'https://wa.me/201555415331'

    return <div>
        <div className="">
            <div className="home-header-container page-side-padding">
                <div className="home-header-wrapper">
                <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: .5, delay: 0.1 }}
                >
                    <span className="top-header-text">FIND YOUR EXPERT</span>
                    <h1>
                        Talk <strong className="main-color-text">to experts online privately</strong> anytime anywhere!
                    </h1>
                    <div className="bottom-header-text small-font">
                        <span>RA'AYA Connects You With Licensed Experts All Over Egypt Across Diffrerent Specialities</span>
                    </div>
                    <div>
                        <button onClick={() => navigate('/find-expert')} className="normal-button main-color-bg white-text full-width bold-text large-font">Explore Our Experts</button>
                        <button 
                        onClick={() => navigate('/auth/signup')} 
                        className="margin-top-1 normal-button main-color-text main-color-border full-width bold-text large-font"
                        >
                            Signup, It's Free
                        </button>
                    </div>
                    </motion.div>
                </div>
                <div className="home-page-image-container">
                    <img src={homeImage} alt="home-image" />
                </div>
            </div>
            <div className="bg-main-color home-why-container">
                <div className="page-side-padding">
                    <h2>Why RA'AYA ?</h2>
                    <div className="home-why-grid-container">
                        <div>
                            <img src={languageImage} />
                            <span>
                                Billingual Experience
                            </span>
                        </div>
                        <div>
                            <img src={securityImage} />
                            <span>Full confidentiality</span>
                        </div>
                        <div>
                            <img src={answersImage} />
                            <span>Personalized answers</span>
                        </div>
                        <div>
                            <img src={supportImage} />
                            <span>Full support</span>
                        </div>
                        <div>
                            <img src={followImage} />
                            <span>Follow-ups</span>
                        </div>
                        <div>
                            <img src={paymentImage} />
                            <span>Online payments</span>
                        </div>
                    </div>
                </div>
            </div>
           
            <div className="home-works-wrapper">
                <div className="home-works-container page-side-padding">
                    <h2>How It Works?</h2>
                    <div className="home-benefits-reasons-container">
                            <div className="styled-container">
                                <div className="flex-space-between-center main-color-text">
                                    <strong>
                                        Browse Experts
                                    </strong>
                                    <ScreenSearchDesktopOutlinedIcon />
                                </div>
                                <p className="fadded-black-text">
                                    Explore our diverse range of experts and their areas of expertise.  
                                </p>
                            </div>
                            <div className="styled-container">
                                <div className="main-color-text flex-space-between-center">
                                    <strong>Book Appointment</strong>
                                    <BookOnlineOutlinedIcon />
                                </div>
                                <p className="fadded-black-text">
                                Select an expert, choose a convenient date and time, and confirm your appointment.
                                </p>

                            </div>
                            <div className="styled-container">
                                <div className="main-color-text flex-space-between-center">
                                    <strong className="main-color-text">Receive Confirmation</strong>
                                    <MarkUnreadChatAltOutlinedIcon />
                                </div>
                                <p className="fadded-black-text">
                                    Get a confirmation of your appointment via Email or on the platform.
                                </p>
                            </div>
                            <div className="styled-container">
                                <div className="main-color-text flex-space-between-center">
                                    <strong>Join Video Call</strong>
                                    <DuoOutlinedIcon />
                                </div>
                                <p className="fadded-black-text">
                                At the scheduled time, click on the provided video call link or access code.
                                </p>
                            </div>
                            <div className="styled-container">
                                <div className="main-color-text flex-space-between-center">
                                    <strong className="main-color-text">Engage and Learn</strong>
                                    <SchoolOutlinedIcon />
                                </div>
                                <p className="fadded-black-text">
                                    Have a productive video call with the expert, seeking guidance, advice, or solutions to your queries or challenges.  
                                </p> 
                            </div>      
                        </div>
                </div>
            </div>
            
            <div className="home-help-container">
                <div className="page-side-padding">
                    <div className="margin-top-1">
                        <h2>Still Need Help?</h2>
                        <div className="home-help-grid-container">
                            <div className="home-help-image-container">
                                <img src={helpImage} />
                            </div>
                            <div>
                                <strong>Our customer support team is always here to answer your questions</strong>
                                <p>
                                    Contact them anytime anywhere to get the desired help, use the button below
                                </p>
                                <NavLink to={SUPPORT_LINK} className="large-font normal-button main-color-text main-color-border bold-text full-width support-button">
                                    Chat with Support Team
                                </NavLink>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
}

export default HomePage