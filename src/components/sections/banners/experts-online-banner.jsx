import './expert-online-banner.css'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import CircleIcon from '@mui/icons-material/Circle'


const ExpertsOnlineBanner = ({ totalExperts=0, actionFunction }) => {

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
        transition={{ duration: .4 }}
    >
    <div className="experts-online-banner-container">
        <strong>
            If you need to talk now, we are here to help you
        </strong>
        <div className="experts-online-banner-info-container margin-top-1">
            <div className="flex-center">
                <CircleIcon style={{ fontSize: '1rem', color: '#62C936' }} />
                {
                    totalExperts === 1 ?
                    <span>{totalExperts} Expert is ready to start now within 20 minutes</span>
                    :
                    <span>{totalExperts} Experts are ready to start now within 20 minutes</span>
                }
            </div>
            <button 
            onClick={actionFunction}
            className="normal-button bold-text main-color-bg white-text">
                Learn More
            </button>
        </div>
    </div>
    </motion.div>
}

export default ExpertsOnlineBanner