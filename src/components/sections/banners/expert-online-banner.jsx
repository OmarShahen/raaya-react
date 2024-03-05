import './expert-online-banner.css'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'


const ExpertOnlineBanner = ({ redirectURL }) => {

    const navigate = useNavigate()

    const animationVariants = {
        initial: {
          opacity: 0,
          x: -100, // Starting position (move from left)
        },
        animate: {
          opacity: 1,
          x: 0, // Ending position (move to the right)
        },
    }

    return <motion.div
        initial="initial"
        animate="animate"
        variants={animationVariants}
        transition={{ duration: .4 }} // You can adjust the duration
    >
    <div className="expert-online-banner-container">
        <span>
            This Expert is online, start in 20 minutes from now!
        </span>
        <div>
            <button 
            onClick={() => navigate(redirectURL)}
            className="normal-button bold-text main-color-text main-color-border">
                Start your session
            </button>
        </div>
    </div>
    </motion.div>
}

export default ExpertOnlineBanner