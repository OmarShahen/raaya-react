import '../modal.css'
import { TailSpin } from 'react-loader-spinner'
import ErrorIcon from '@mui/icons-material/Error'
import './confirmation-modal.css'
import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'


const DeleteConfirmationModal = ({ 
    isShowModal, 
    setIsShowModal, 
    isLoading, 
    deleteFunction,
    title,
    description
}) => {   

    const modalVariants = {
        hidden: {
          y: '100%',
          opacity: 0,
        },
        visible: {
          y: 0,
          opacity: 1,
          transition: {
            type: 'spring',
            damping: 15,
            stiffness: 100,
          },
        },
        exit: {
          y: '100%',
          opacity: 0,
          transition: {
            type: 'spring',
            damping: 15,
            stiffness: 100,
          },
        }
    }

    return <div className="modal">
        <motion.div
        initial="hidden"
        animate={isShowModal ? "visible" : "hidden"}
        exit="exit"
        variants={modalVariants}>
            <div className="confirmation-modal-container body-text styled-container">
                <div className="confirmation-modal-header">
                    <h3 className="very-large-font bold-text">
                        <ErrorIcon />
                        {
                            title ?
                            title
                            :
                            'Cancel Appointment'
                        }
                    </h3>
                </div>  
                {
                    description ?
                    <div className="normal-font confirmation-modal-body">
                        <p>
                            Are you sure you want to perform this action ?
                        </p>
                        <p>
                            {description}
                        </p>
                    </div>  
                    :
                    <div className="normal-font confirmation-modal-body">
                    <p>
                        Are you sure you want to cancel this appointment?
                    </p>

                        <p>
                            Please note that deleting this appointment will result in a refund of the applicable amount according to our refunding policy.
                        </p>

                        <p>
                            To learn more about our refunding policy, please visit our <NavLink className="no-decoration main-color-text bold-text" to="/policies/refund" target="_blank">refund policy page</NavLink>.
                        </p>

                        <p>
                            By proceeding with the deletion, you acknowledge and accept the refunding terms outlined in our policy.
                        </p>
                    </div>  
                } 
                  
                <div className="confirmation-modal-buttons-container">
                    <button 
                    className="normal-button abort-button"
                    onClick={() => setIsShowModal(false)}
                    >Cancel</button>
                     {
                        isLoading ?
                        <TailSpin width="25" height="25" color="#DE350B" />
                        :
                        <button 
                        className="normal-button delete-button" 
                        onClick={() => {
                            deleteFunction()
                        }}
                        >Delete</button>
                    }
                </div>        
            </div>
        </motion.div>
    </div>
}

export default DeleteConfirmationModal