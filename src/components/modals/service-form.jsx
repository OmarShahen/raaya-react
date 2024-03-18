import { useState } from 'react'
import './form-modal.css'
import { serverRequest } from '../API/request'
import { toast } from 'react-hot-toast'
import { TailSpin } from 'react-loader-spinner'
import { useSelector } from 'react-redux'
import { motion } from 'framer-motion'


const ServiceFormModal = ({ setShowFormModal, reload, setReload, isUpdate, setIsUpdate, service, setService }) => {

    const user = useSelector(state => state.user.user)

    const [isSubmit, setIsSubmit] = useState(false)

    const [title, setTitle] = useState(isUpdate ? service.title : '')
    const [description, setDescription] = useState(isUpdate ? service.description : '')
    const [duration, setDuration] = useState(isUpdate ? service.duration : '')
    const [price, setPrice] = useState(isUpdate ? service.price : '')
    const [internationalPrice, setInternationalPrice] = useState(isUpdate ? service.internationalPrice : '')

    const [titleError, setTitleError] = useState()
    const [descriptionError, setDescriptionError] = useState()
    const [durationError, setDurationError] = useState()
    const [priceError, setPriceError] = useState()
    const [internationalPriceError, setInternationalPriceError] = useState()

    
    const handleSubmit = (e) => {
        e.preventDefault()
        
        if(!title) return setTitleError('Title is required')

        if(!duration) return setDurationError('Duration is required')

        if(!price) return setPriceError('Price is required')

        if(!internationalPrice) return setInternationalPriceError('Outside Egypt Price is required')

        if(!description) return setDescriptionError('Description is required')

        const serviceData = {
            expertId: user._id,
            title,
            duration: Number.parseInt(duration),
            price: Number.parseInt(price),
            internationalPrice: Number.parseInt(internationalPrice),
            description
        }

        setIsSubmit(true)
        serverRequest.post(`/v1/services`, serviceData)
        .then(response => {
            setIsSubmit(false)
            const data = response.data
            toast.success(data.message, { position: 'top-right', duration: 3000 })
            reload ? setReload(reload + 1) : null
            setShowFormModal ? setShowFormModal(false) : null
        })
        .catch(error => {
            setIsSubmit(false)
            console.error(error)

            try {

                const errorResponse = error.response.data

                if(errorResponse.field === 'title') return setTitleError(errorResponse.message)

                if(errorResponse.field === 'duration') return setDurationError(errorResponse.message)

                if(errorResponse.field === 'price') return setPriceError(errorResponse.message)

                if(errorResponse.field === 'description') return setDescriptionError(errorResponse.message)

                toast.error(error.response.data.message, { position: 'top-right', duration: 3000 })

            } catch(error) {
                toast.error(error.message, { position: 'top-right', duration: 3000 })
            }
        })

    }

    const handleUpdate = (e) => {
        e.preventDefault()
        
        if(!title) return setTitleError('Title is required')

        if(!duration) return setDurationError('Duration is required')

        if(!price) return setPriceError('Price is required')

        if(!internationalPrice) return setInternationalPriceError('Outside Egypt Price is required')

        if(!description) return setDescriptionError('Description is required')

        const serviceData = {
            title,
            duration: Number.parseInt(duration),
            price: Number.parseInt(price),
            internationalPrice: Number.parseInt(internationalPrice),
            description
        }

        setIsSubmit(true)
        serverRequest.put(`/v1/services/${service._id}`, serviceData)
        .then(response => {
            setIsSubmit(false)
            const data = response.data
            toast.success(data.message, { position: 'top-right', duration: 3000 })
            reload ? setReload(reload + 1) : null
            setIsUpdate(false)
            setService()
            setShowFormModal ? setShowFormModal(false) : null
        })
        .catch(error => {
            setIsSubmit(false)
            console.error(error)

            try {

                const errorResponse = error.response.data

                if(errorResponse.field === 'title') return setTitleError(errorResponse.message)

                if(errorResponse.field === 'duration') return setDurationError(errorResponse.message)

                if(errorResponse.field === 'price') return setPriceError(errorResponse.message)

                if(errorResponse.field === 'description') return setDescriptionError(errorResponse.message)

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
                <h2>{isUpdate ? 'Update Service' : 'Create Service'}</h2>
            </div>
            <div>
                <div className="modal-body-container">
                    <form 
                    id="opening-time-form" 
                    className="modal-form-container responsive-form body-text" 
                    onSubmit={isUpdate ? handleUpdate : handleSubmit}>
                        
                        <div className="form-input-container">
                            <label className="bold-text">Title</label>
                            <input 
                            type="text" 
                            className="form-input" 
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            onClick={() => setTitleError()}
                            />
                            <span className="red-text">{titleError}</span>
                        </div>
                        <div className="form-input-container">
                            <label className="bold-text">Duration</label>
                            <input 
                            type="number" 
                            className="form-input" 
                            value={duration}
                            onChange={e => setDuration(e.target.value)}
                            onClick={() => setDurationError()}
                            />
                            <span className="red-text">{durationError}</span>
                        </div>
                        <div className="form-input-container">
                            <label className="bold-text">Price</label>
                            <input 
                            type="number" 
                            className="form-input" 
                            value={price}
                            onChange={e => setPrice(e.target.value)}
                            onClick={() => setPriceError()}
                            />
                            <span className="red-text">{priceError}</span>
                        </div>
                        <div className="form-input-container">
                            <label className="bold-text">Outside Egypt Price</label>
                            <input 
                            type="number" 
                            className="form-input" 
                            value={internationalPrice}
                            onChange={e => setInternationalPrice(e.target.value)}
                            onClick={() => setInternationalPriceError()}
                            />
                            <span className="red-text">{internationalPriceError}</span>
                        </div>
                    </form>
                </div>
                <div className="form-input-container">
                    <label className="bold-text">Description</label>
                    <textarea
                    className="form-textarea"
                    rows="5"
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    onClick={() => setDescriptionError()}
                    >

                    </textarea>
                    <span className="red-text">{descriptionError}</span>
                </div>
                <div className="modal-form-btn-container">
                    <div>
                        <button 
                        className="normal-button red-bg white-text"
                        onClick={e => {
                            e.preventDefault()
                            setIsUpdate ? setIsUpdate() : null
                            setService ? setService() : null
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
                            >{isUpdate ? 'Update' : 'Create'}</button>
                        } 
                    </div>
                </div>
            </div>            
        </div>
        </motion.div>
    </div>
}


export default ServiceFormModal