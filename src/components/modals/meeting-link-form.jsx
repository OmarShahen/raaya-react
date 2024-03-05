import { useState } from 'react'
import './form-modal.css'
import { serverRequest } from '../API/request'
import { toast } from 'react-hot-toast'
import { TailSpin } from 'react-loader-spinner'
import { useSelector } from 'react-redux'
import { motion } from 'framer-motion'


const MeetingLinkFormModal = ({ setShowFormModal, reload, setReload, appointment }) => {

    const [isSubmit, setIsSubmit] = useState(false)

    const [meetingLink, setMeetingLink] = useState(appointment.meetingLink ? appointment.meetingLink : '')

    const [meetingLinkError, setMeetingLinkError] = useState()
    

    const handleUpdate = (e) => {
        e.preventDefault()
        
        if(!meetingLink) return setMeetingLinkError('Meeting link is required')

        const meetingLinkData = { meetingLink }

        setIsSubmit(true)
        serverRequest.patch(`/v1/appointments/${appointment._id}/meeting-link`, meetingLinkData)
        .then(response => {
            setIsSubmit(false)
            const data = response.data
            toast.success(data.message, { position: 'top-right', duration: 3000 })
            setReload(reload + 1)
            setShowFormModal(false)
        })
        .catch(error => {
            setIsSubmit(false)
            console.error(error)

            try {

                const errorResponse = error.response.data

                if(errorResponse.field === 'meetingLink') return setMeetingLinkError(errorResponse.message)

                toast.error(error.response.data.message, { position: 'top-right', duration: 3000 })

            } catch(error) {
                toast.error(error.message, { position: 'top-right', duration: 3000 })
            }
        })

    }

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
        animate={"visible" }
        exit="exit"
        variants={modalVariants}>
        <div className="modal-container modal-wide-width body-text">
            <div className="flex-space-between">
                <h2>Add Meeting Link</h2>
            </div>
            <div>
                <div className="modal-body-container">
                    <form 
                    id="opening-time-form" 
                    className="responsive-form body-text" 
                    onSubmit={handleUpdate}>
                        
                        <div className="form-input-container">
                            <label className="bold-text">Meeting Link</label>
                            <input 
                            type="url" 
                            className="form-input" 
                            value={meetingLink}
                            onChange={e => setMeetingLink(e.target.value)}
                            onClick={() => setMeetingLinkError()}
                            />
                            <span className="red-text">{meetingLinkError}</span>
                        </div>
                    </form>
                </div>
                <div className="modal-form-btn-container">
                    <div>
                        <button 
                        className="normal-button red-bg white-text"
                        onClick={e => {
                            e.preventDefault()
                            setShowFormModal(false)
                        }}
                        >{'Close'}</button>
                    </div>
                    <div>   
                        { 
                            isSubmit ?
                            <TailSpin
                            height="25"
                            width="25"
                            color="#4c83ee"
                            />
                            :
                            <button
                            form="opening-time-form"
                            className="normal-button main-color-bg white-text"
                            >Add</button>
                        } 
                    </div>
                </div>
            </div>            
        </div>
        </motion.div>
    </div>
}


export default MeetingLinkFormModal