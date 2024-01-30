import { useState, useEffect } from 'react'
import './auth.css'
import zoomImage from '../../assets/zoom-image.png'
import { useDispatch } from 'react-redux'
import { toast } from 'react-hot-toast'
import { serverRequest } from '../../components/API/request'
import Loading from '../../components/loading/loading'
import { setIsLogged } from '../../redux/slices/userSlice'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import FavoriteIcon from '@mui/icons-material/Favorite'
import { motion } from 'framer-motion'


const ExpertVerificationPage = () => {

    const dispatch = useDispatch()
    
    const [isLoading, setIsLoading] = useState(false)
    const [isSubmitted, setIsSubmitted] = useState(false)

    const [specialties, setSpecialties] = useState([])

    const [name, setName] = useState()
    const [email, setEmail] = useState()
    const [phone, setPhone] = useState()
    const [speciality, setSpeciality] = useState()
    const [description, setDescription] = useState()
    const [facebookURL, setFacebookURL] = useState()
    const [instagramURL, setInstagramURL] = useState()
    const [youtubeURL, setYoutubeURL] = useState()
    const [linkedInURL, setLinkedInURL] = useState()

    const [socialError, setSocialError] = useState()
    const [emailError, setEmailError] = useState()
    const [phoneError, setPhoneError] = useState()
    const [nameError, setNameError] = useState()
    const [specialityError, setSpecialityError] = useState()
    const [descriptionError, setDescriptionError] = useState()
    const [facebookURLError] = useState()
    const [instagramURLError] = useState()
    const [youtubeURLError] = useState()
    const [linkedInURLError] = useState()

    const divAnimation = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0 },
    }

    useEffect(() => {
        scroll(0, 0)
        localStorage.setItem('user', null)
        dispatch(setIsLogged(false))
    }, [])

    useEffect(() => {
        serverRequest.get('/v1/specialities')
        .then(response => {
            setSpecialties(response.data.specialities)
        })
        .catch(error => {
            console.error(error)
            toast.error(error?.response?.data?.message, { duration: 3000, position: 'top-right' })
        })
    }, [])

    const handleSubmit = (e) => {
        e.preventDefault()

        if(!name) return setNameError('Name is required')

        if(!email) return setEmailError('Email is required')

        if(!phone) return setPhoneError('Phone is required')

        if(!speciality) return setSpecialityError('Speciality is required')

        if(!facebookURL && !linkedInURL && !instagramURL && !youtubeURL) return setSocialError('One social media profile is needed atleast') 

        if(!description) return setDescriptionError('Description is required')

        const expertVerificationData = {
            name,
            email,
            phone,
            specialityId: speciality,
            description,
            facebookURL,
            linkedInURL,
            instagramURL,
            youtubeURL
        }

        setIsLoading(true)
        serverRequest.post('/v1/experts-verifications', expertVerificationData)
        .then(() => {
            setIsLoading(false)
            setIsSubmitted(true)
        })
        .catch(error => {
            setIsLoading(false)
            console.error(error)

            if(error?.response?.data?.field === 'name') return setNameError(error?.response?.data?.message)

            if(error?.response?.data?.field === 'email') return setEmailError(error?.response?.data?.message)

            if(error?.response?.data?.field === 'phone') return setPhoneError(error?.response?.data?.message)

            if(error?.response?.data?.field === 'specialityId') return setSpecialityError(error?.response?.data?.message)

            if(error?.response?.data?.field === 'description') return setDescriptionError(error?.response?.data?.message)

            if(error?.response?.data?.field === 'websiteURL') return setSocialError(error?.response?.data?.message)

            return toast.error(error?.response?.data?.message, { position: 'top-right', duration: 3000 })

        })
    }

    return <div>
        <div className="auth-page-container">
            <div className="auth-image-container">
                <div>
                    <img src={zoomImage} alt="signup image" />
                </div>
            </div>
            <div className="auth-form-container">
            <h1>Join as a Expert</h1>
                <div>
                    <span className="fadded-black-text normal-font sub-header-text">
                        Submit your data for review and start offering online sessions
                    </span>
                </div>
                {
                    isSubmitted ?
                    <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={divAnimation}
                    transition={{ duration: 0.5 }}
                    >
                        <div>
                            <br />
                            <br />
                            <CheckCircleIcon 
                            htmlColor="#20c997" 
                            style={{ fontSize: '4rem' }}
                            />
                            <div>
                                <strong className="large-font">Submitted Successfully!</strong>
                                <p className="align-left normal-font fadded-black-text">
                                We are currently reviewing it. You will receive an email with 
                                the decision soon. If accepted, you'll gain access to the platform. 
                                If rejected, you'll receive feedback. Thank you for your patience. 
                                </p>
                                <p className="align-left normal-font fadded-black-text">
                                In the meantime, we invite you to watch a tutorial about our platform to familiarize yourself
                                with its features and functionalities. You can access the tutorial by clicking on the 
                                following link: <a className="main-color-text bold-text" rel="noreferrer" target="_blank" href="https://youtu.be/4K00hlANF-E?si=YcIATz4te_2PscIL">Click Here</a>
                                </p>
                                <p className="align-left normal-font fadded-black-text flex-center align-left">
                                Thank you for your patience  <FavoriteIcon style={{ color: 'red', fontSize: '1.5rem' }} />
                                </p>
                            </div> 
                        </div>
                    </motion.div>
                    :
                    <div className="margin-top-1">
                    <form onSubmit={handleSubmit}>
                        <div className="form-input-container">
                            <input 
                            type="text" 
                            placeholder="Name" 
                            className="form-input"
                            onClick={() => setNameError()}
                            onChange={e => setName(e.target.value)}
                            value={name}
                            />
                            <div className="red-text align-left">
                                <span>{nameError}</span>
                            </div>
                        </div>
                        <div className="grid-2-columns">
                            <div className="form-input-container">
                                <input 
                                type="email" 
                                placeholder="Email" 
                                className="form-input"
                                onClick={() => setEmailError()}
                                onChange={e => setEmail(e.target.value)}
                                value={email}
                                />
                                <div className="red-text align-left">
                                    <span>{emailError}</span>
                                </div>
                            </div>
                            <div className="form-input-container">
                                <input 
                                type="tel" 
                                placeholder="Phone" 
                                className="form-input"
                                onClick={() => setPhoneError()}
                                onChange={e => setPhone(e.target.value)}
                                value={phone}
                                />
                                <div className="red-text align-left">
                                    <span>{phoneError}</span>
                                </div>
                            </div> 
                        </div>  
                        <div className="form-input-container">
                            <select
                            className="form-select"
                            onClick={() => setSpecialityError()}
                            onChange={e => setSpeciality(e.target.value)}
                            >
                                <option selected disabled>Choose your area of expertise</option>
                                {specialties.map(special => <option key={special._id} value={special._id}>{special.name}</option>)}
                            </select>
                            <div className="red-text align-left">
                                <span>{specialityError}</span>
                            </div>
                        </div>  
                        <div className="grid-2-columns">
                            <div className="form-input-container">
                                <input 
                                type="url" 
                                placeholder="Facebook Profile" 
                                className="form-input"
                                onClick={() => setSocialError()}
                                onChange={e => setFacebookURL(e.target.value)}
                                value={facebookURL}
                                />
                                <div className="red-text align-left">
                                    <span>{facebookURLError}</span>
                                </div>
                            </div>   
                            <div className="form-input-container">
                                <input 
                                type="url" 
                                placeholder="LinkedIn Profile" 
                                className="form-input"
                                onClick={() => setSocialError()}
                                onChange={e => setLinkedInURL(e.target.value)}
                                value={linkedInURL}
                                />
                                <div className="red-text align-left">
                                    <span>{linkedInURLError}</span>
                                </div>
                            </div> 
                            <div className="form-input-container">
                                <input 
                                type="url" 
                                placeholder="Instagram Profile" 
                                className="form-input"
                                onClick={() => setSocialError()}
                                onChange={e => setInstagramURL(e.target.value)}
                                value={instagramURL}
                                />
                                <div className="red-text align-left">
                                    <span>{instagramURLError}</span>
                                </div>
                            </div>   
                            
                            <div className="form-input-container">
                                <input 
                                type="url" 
                                placeholder="Youtube Profile" 
                                className="form-input"
                                onClick={() => setSocialError()}
                                onChange={e => setYoutubeURL(e.target.value)}
                                value={youtubeURL}
                                />
                                <div className="red-text align-left">
                                    <span>{youtubeURLError}</span>
                                </div>
                            </div> 
                        </div>    
                        <div>
                            <span className="red-text">{socialError}</span>
                        </div>
                        <div className="form-input-container">
                            <textarea
                            className="form-textarea"
                            rows='7'
                            placeholder="Write a brief about yourself"
                            onClick={() => setDescriptionError()}
                            onChange={e => setDescription(e.target.value)}
                            value={description}
                            >

                            </textarea>
                            <span className="red-text">{descriptionError}</span>
                        </div>                            
                        <div className="form-input-container">
                            {
                                isLoading ?
                                <div className="flex-center">
                                    <Loading width="30" height="30" />
                                </div>
                                :
                                <button className="normal-button main-color-bg white-text full-width">
                                    SUBMIT
                                </button>
                            }
                        </div>
                    </form>
                </div>
                }
                
            </div>
        </div>
    </div>
}

export default ExpertVerificationPage