import { useState, useEffect } from 'react'
import './modal.css'
import { motion } from 'framer-motion'
import CloseIcon from '@mui/icons-material/Close'
import { useDispatch } from 'react-redux'
import { setIsShowExpertModal } from '../../redux/slices/modalSlice'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import { toast } from 'react-hot-toast'
import { serverRequest } from '../API/request'
import Loading from '../loading/loading'
import { getTimeZone } from '../../utils/time'
import { setUser } from '../../redux/slices/userSlice'
import { useNavigate } from 'react-router-dom'

const ExpertSignupFormModal = () => {

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [formNavigation, setFormNavigation] = useState(1)

    const [isShowPassword, setIsShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const [userId, setUserId] = useState()
    const [userEmail, setUserEmail] = useState()

    const [name, setName] = useState()
    const [title, setTitle] = useState()
    const [description, setDescription] = useState()
    const [targetSpeciality, setTargetSpeciality] = useState()
    const [specialities, setSpecialities] = useState([])
    const [halfHourPrice, setHalfHourPrice] = useState()
    const [hourPrice, setHourPrice] = useState()
    const [gender, setGender] = useState()
    const [dateOfBirth, setDateOfBirth] = useState()
    const [email, setEmail] = useState()
    const [phone, setPhone] = useState()
    const [password, setPassword] = useState()
    const [verificationCode, setVerificationCode] = useState()

    const [titleError, setTitleError] = useState()
    const [descriptionError, setDescriptionError] = useState()
    const [specialitiesError, setSpecialitiesError] = useState([])
    const [halfHourPriceError, setHalfHourPriceError] = useState()
    const [hourPriceError, setHourPriceError] = useState()
    const [emailError, setEmailError] = useState()
    const [phoneError, setPhoneError] = useState()
    const [passwordError, setPasswordError] = useState()
    const [nameError, setNameError] = useState()
    const [genderError, setGenderError] = useState()
    const [dateOfBirthError, setDateOfBirthError] = useState()
    const [verificationCodeError, setVerificationCodeError] = useState()


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

    useEffect(() => {
        serverRequest.get('/v1/specialities')
        .then(response => {
            setSpecialities(response.data.specialities)
        })
        .catch(error => {
            console.error(error)
        })
    }, [])

    const handleName = () => {
        if(!name) return setNameError('Name is required')

        return setFormNavigation(formNavigation + 1)
    }

    const handleDescription = () => {

        if(!title) return setTitleError('Title is required')

        if(!description) return setDescriptionError('Description is required')

        return setFormNavigation(formNavigation + 1)
    }

    const handleSpecialities = () => {

        if(!targetSpeciality) return setSpecialitiesError('Speciality is required')

        return setFormNavigation(formNavigation + 1)
    }

    const handlePricing = () => {

        if(!halfHourPrice) return setHalfHourPriceError('30 min session price is required')

        if(!hourPrice) return setHourPriceError('60 min session price is required')

        return setFormNavigation(formNavigation + 1)
    }

    const handleDemographics = () => {

        if(!gender) return setGenderError('Gender is required')

        if(!dateOfBirth) return setDateOfBirthError('Date of birth is required')

        return setFormNavigation(formNavigation + 1)
    }

    const handleAuth = () => {

        if(!email) return setEmailError('Email is required')

        if(!phone) return setPhoneError('Phone is required')

        if(!password) return setPasswordError('Password is required')

        const signupData = {
            firstName: name,
            title,
            description,
            speciality: [targetSpeciality],
            pricing: [{ duration: 30, price: Number.parseInt(halfHourPrice) }, { duration: 60, price: Number.parseInt(hourPrice) }],
            gender,
            dateOfBirth,
            email,
            countryCode: 20,
            phone: Number.parseInt(phone),
            password,
            timeZone: getTimeZone(),
        }

        setIsLoading(true)
        serverRequest.post('/v1/auth/experts/signup', signupData)
        .then(response => {
            setIsLoading(false)
            setUserId(response.data.user._id)
            setUserEmail(response.data.user.email)
            toast.success(response.data.message, { duration: 3000, position: 'top-right' })
            setFormNavigation(formNavigation + 1)
        })
        .catch(error => {
            setIsLoading(false)

            console.log(error?.response)

            const responseError = error?.response?.data

            if(responseError?.field === 'email') return setEmailError(responseError?.message)

            if(responseError?.field === 'phone') return setPhoneError(responseError?.message)

            if(responseError?.field === 'password') return setPasswordError(responseError?.message)

            toast.error(responseError.message, { position: 'top-right', duration: 3000 })
            
        })

    }

    const handleVerificationCode = () => {

        if(!verificationCode) return setVerificationCodeError('Verification code is required')

        setIsLoading(true)
        serverRequest.post(`/v1/auth/verify/users/${userId}/verification-codes/${verificationCode}`)
        .then(response => {
            setIsLoading(false)
            const data = response.data
            let user = data.user
            user.accessToken = data.token
            sessionStorage.setItem('user', JSON.stringify({ ...user, isLogged: true }))
            dispatch(setUser({ ...user, isLogged: true }))
            dispatch(setIsShowExpertModal({ isShowExpertModal: false }))
            toast.success(response.data.message, { duration: 3000, position: 'top-right' })
            navigate(`/users/opening-times`)
        })
        .catch(error => {
            setIsLoading(false)
            console.error(error)
            try {

                const errorData = error?.response?.data

                if(errorData.field === 'code') return setVerificationCodeError(errorData.message)

            } catch(erorr) {
                console.error(error)
            }
        })
    }

    const resendEmailVerificationCode = () => {
        setIsLoading(true)
        serverRequest.post(`/v1/auth/users/${userId}/send/verification-codes`)
        .then(response => {
            setIsLoading(false)
            toast.success(response.data.message, { duration: 3000, position: 'top-right' })
        })
        .catch(error => {
            setIsLoading(false)
            console.error(error)
            toast.error(error?.response?.data?.message, { duration: 3000, position: 'top-right' })
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        if(formNavigation === 1) {
            handleName()
        } else if(formNavigation === 2) {
            handleDescription()
        } else if(formNavigation === 3) {
            handleSpecialities()
        } else if(formNavigation === 4) {
            handlePricing()
        } else if(formNavigation === 5) {
            handleDemographics()
        } else if(formNavigation === 6) {
            handleAuth()
        } else if(formNavigation === 7) {
            handleVerificationCode()
        }
    }

    return <div className="modal">
        <motion.div
        initial="hidden"
        animate={'visible'}
        exit="exit"
        variants={modalVariants}>
            <div className="modal-container">
                <div className="modal-close-container">
                    <span onClick={() => dispatch(setIsShowExpertModal({ isShowExpertModal: false }))}>
                        <CloseIcon />
                    </span>
                </div>
                <div className="modal-header">
                    <h1 className="logo-header-container">RA'AYA</h1>
                    <div className="modal-header-description">
                        <span>Share your knowledge and start consulting</span>
                    </div>
                </div>
                <div className="signup-progress-bar-container">
                    <div className={formNavigation >= 1 ? "signup-acheived-container" : '' }>1</div>
                    <div className={formNavigation >= 2 ? "signup-acheived-container" : '' }>2</div>
                    <div className={formNavigation >= 3 ? "signup-acheived-container" : '' }>3</div>
                    <div className={formNavigation >= 4 ? "signup-acheived-container" : '' }>4</div>
                    <div className={formNavigation >= 5 ? "signup-acheived-container" : '' }>5</div>
                    <div className={formNavigation >= 6 ? "signup-acheived-container" : '' }>6</div>
                    <div className={formNavigation >= 7 ? "signup-acheived-container" : '' }>7</div>

                </div>
                <div className="modal-body">
                    <form onSubmit={handleSubmit}>
                        {
                            formNavigation === 1 ?
                            <div>
                                <div className="form-input-container">
                                    <input 
                                    type="text" 
                                    placeholder="Name" 
                                    className="form-input"
                                    onClick={() => setNameError()}
                                    onChange={e => setName(e.target.value)}
                                    value={name}
                                    />
                                    <div className="red-text">
                                        <span>{nameError}</span>
                                    </div>
                                </div>
                            </div>
                            :
                            null
                        }
                        {
                            formNavigation === 2 ?
                            <div>
                                <div className="form-input-container">
                                    <input 
                                    type="text" 
                                    placeholder="Title" 
                                    className="form-input"
                                    onClick={() => setTitleError()}
                                    onChange={e => setTitle(e.target.value)}
                                    value={title}
                                    />
                                    <div className="red-text">
                                        <span>{titleError}</span>
                                    </div>
                                </div>
                                <div className="form-input-container">
                                    <textarea
                                    className="form-textarea"
                                    rows='10'
                                    cols='10'
                                    style={{ height: '8rem' }}
                                    onClick={() => setDescriptionError()}
                                    onChange={e => setDescription(e.target.value)}
                                    value={description}
                                    placeholder='write about your experience'
                                    >
                                    </textarea>
                                    <div className="red-text">
                                        <span>{descriptionError}</span>
                                    </div>
                                </div>
                            </div>
                            :
                            null
                        }
                        {
                            formNavigation === 3 ?
                            <div className="form-input-container">
                                <span className="bold-text small-font fadded-black-text">Select Speciality</span>
                                {
                                    specialities.length !== 0 ?
                                    <div className="tags-container margin-top-1">
                                        {specialities.map(special => <span 
                                        key={special._id} 
                                        className={targetSpeciality === special._id ? 'main-tag active-main-tag' : 'main-tag'}
                                        onClick={() => {
                                            setSpecialitiesError()
                                            targetSpeciality === special._id ? setTargetSpeciality() : setTargetSpeciality(special._id)
                                        }}
                                        >
                                            {special.name}
                                        </span>)}
                                    </div>
                                    :
                                    null
                                }
                                <div className="red-text margin-top-1">
                                    <span>{specialitiesError}</span>
                                </div>
                            </div>
                            :
                            null
                        }
                        {
                            formNavigation === 4 ?
                            <div>
                                <div className="form-input-container">
                                    <input 
                                    type="number" 
                                    placeholder="30 minutes session price" 
                                    className="form-input"
                                    onClick={() => setHalfHourPriceError()}
                                    onChange={e => setHalfHourPrice(e.target.value)}
                                    value={halfHourPrice}
                                    />
                                    <div className="red-text">
                                        <span>{halfHourPriceError}</span>
                                    </div>
                                </div>
                                <div className="form-input-container">
                                    <input 
                                    type="number" 
                                    placeholder="60 minutes session price" 
                                    className="form-input"
                                    onClick={() => setHourPriceError()}
                                    onChange={e => setHourPrice(e.target.value)}
                                    value={hourPrice}
                                    />
                                    <div className="red-text">
                                        <span>{hourPriceError}</span>
                                    </div>
                                </div>
                            </div>
                            :
                            null
                        }
                        {
                            formNavigation === 5 ?
                            <div className="form-input-container">
                                <select 
                                className="form-select"
                                onClick={() => setGenderError()}
                                onChange={e => setGender(e.target.value)}
                                >
                                    <option disabled selected>Select Gender</option>
                                    <option selected={gender === 'MALE' ? true : false} value="MALE">Male</option>
                                    <option selected={gender === 'FEMALE' ? true : false} value="FEMALE">Female</option>
                                </select>
                                <div className="red-text">
                                    <span>{genderError}</span>
                                </div>
                            </div>
                            :
                            null
                        }
                        {
                            formNavigation === 5 ?
                            <div className="form-input-container">
                                <input 
                                type="date" 
                                className="form-input"
                                onClick={() => setDateOfBirthError()}
                                onChange={e => setDateOfBirth(e.target.value)}
                                value={dateOfBirth}
                                />
                                <div className="red-text">
                                    <span>{dateOfBirthError}</span>
                                </div>
                            </div>
                            :
                            null
                        }
                        {
                            formNavigation === 6 ?
                            <div className="form-input-container">
                                <input 
                                type="email" 
                                placeholder="Email" 
                                className="form-input"
                                onClick={() => setEmailError()}
                                onChange={e => setEmail(e.target.value)}
                                value={email}
                                />
                                <div className="red-text">
                                    <span>{emailError}</span>
                                </div>
                            </div>
                            :
                            null
                        }
                        {
                            formNavigation === 6 ?
                            <div className="form-input-container">
                                <input 
                                type="tel" 
                                placeholder="Phone" 
                                className="form-input"
                                onClick={() => setPhoneError()}
                                onChange={e => setPhone(e.target.value)}
                                value={phone}
                                />
                                <div className="red-text">
                                    <span>{phoneError}</span>
                                </div>
                            </div>
                            :
                            null
                        }
                        {
                            formNavigation === 6 ?
                            <div className="form-input-container password-container">
                                <input 
                                type={isShowPassword ? 'text' : 'password'}
                                placeholder="Password" 
                                className="form-input"
                                onClick={() => setPasswordError()}
                                onChange={e => setPassword(e.target.value)}
                                value={password}
                                />
                                {
                                    isShowPassword ?
                                    <span onClick={() => setIsShowPassword(!isShowPassword)} className="password-icon">
                                        <VisibilityIcon />
                                    </span>
                                    :
                                    <span onClick={() => setIsShowPassword(!isShowPassword)} className="password-icon">
                                        <VisibilityOffIcon />
                                    </span>
                                }
                                <div className="red-text">
                                    <span>{passwordError}</span>
                                </div>
                            </div>
                            :
                            null
                        }

                        {
                            formNavigation === 7 ?
                            <div className="margin-top-1">
                                <div>
                                    <span className="verification-code-note-container">
                                        verification code is sent to <span className="main-color-text bold-text">{userEmail}</span>
                                    </span>
                                </div>
                                <div className="form-input-container">
                                    <input 
                                    type="text" 
                                    placeholder="Verification Code" 
                                    className="form-input"
                                    onClick={() => setVerificationCodeError()}
                                    onChange={e => setVerificationCode(e.target.value)}
                                    value={verificationCode}
                                    />
                                    <div className="resend-code-container">
                                        <span>code will expire in 2 minutes</span>
                                        <span 
                                        className="code-button bold-text"
                                        onClick={() => resendEmailVerificationCode()}
                                        >Resend code</span>
                                    </div>
                                    <div className="red-text">
                                        <span>{verificationCodeError}</span>
                                    </div>
                                </div>
                            </div>
                            :
                            null
                        }
                        <div className="form-input-container margin-top-1">
                            {
                                isLoading ?
                                <div className="flex-center">
                                    <Loading width="30" height="30" />
                                </div>
                                :
                                <button className="normal-button main-color-bg white-text full-width">
                                    { formNavigation === 7 ? 'Create Account' : 'Next' }
                                </button>
                            }
                        </div>
                        {
                            formNavigation !== 1 ?
                            <button 
                            className="normal-button full-width"
                            onClick={e => {
                                e.preventDefault()
                                if(formNavigation === 1) {
                                    return
                                }

                                setFormNavigation(formNavigation - 1)
                                return
                            }}
                            >Back</button>
                            :
                            null
                        }
                        <div className="form-signup-container">
                            <span>
                            Already a expert?<span className="signup"> Signin</span>
                            </span>
                        </div>
                    </form>
                </div>
            </div>
        </motion.div>
    </div>
}

export default ExpertSignupFormModal