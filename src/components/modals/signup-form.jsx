import { useState } from 'react'
import './modal.css'
import { motion } from 'framer-motion'
import CloseIcon from '@mui/icons-material/Close'
import { useDispatch } from 'react-redux'
import { setIsShowSigninModal } from '../../redux/slices/modalSlice'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import { toast } from 'react-hot-toast'
import { serverRequest } from '../API/request'
import Loading from '../loading/loading'
import { getTimeZone } from '../../utils/time'
import { setUser } from '../../redux/slices/userSlice'


const SignupFormModal = () => {

    const dispatch = useDispatch()

    const [formNavigation, setFormNavigation] = useState(1)

    const [isShowPassword, setIsShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const [userId, setUserId] = useState()
    const [userEmail, setUserEmail] = useState()

    const [name, setName] = useState()
    const [gender, setGender] = useState()
    const [dateOfBirth, setDateOfBirth] = useState()
    const [email, setEmail] = useState()
    const [phone, setPhone] = useState()
    const [password, setPassword] = useState()
    const [verificationCode, setVerificationCode] = useState()

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

    const handleName = () => {
        if(!name) return setNameError('Name is required')

        return setFormNavigation(2)
    }

    const handleDemographics = () => {

        if(!gender) return setGenderError('Gender is required')

        if(!dateOfBirth) return setDateOfBirthError('Date of birth is required')

        return setFormNavigation(3)
    }

    const handleAuth = () => {

        if(!email) return setEmailError('Email is required')

        if(!phone) return setPhoneError('Phone is required')

        if(!password) return setPasswordError('Password is required')

        const signupData = {
            firstName: name,
            gender,
            dateOfBirth,
            email,
            countryCode: 20,
            phone: Number.parseInt(phone),
            password,
            timeZone: getTimeZone(),
            type: 'PATIENT'
        }

        setIsLoading(true)
        serverRequest.post('/v1/auth/seekers/signup', signupData)
        .then(response => {
            setIsLoading(false)
            setUserId(response.data.user._id)
            setUserEmail(response.data.user.email)
            toast.success(response.data.message, { duration: 3000, position: 'top-right' })
            setFormNavigation(4)
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

    const handleSubmit = (e) => {
        e.preventDefault()

        if(formNavigation === 1) {
            handleName()
        } else if(formNavigation === 2) {
            handleDemographics()
        } else if(formNavigation === 3) {
            handleAuth()
        } else if(formNavigation === 4) {
            handleVerificationCode()
        }
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
            dispatch(setIsShowSigninModal({ isShowSigninModal: false }))
            toast.success(response.data.message, { duration: 3000, position: 'top-right' })
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

    return <div className="modal">
        <motion.div
        initial="hidden"
        animate={'visible'}
        exit="exit"
        variants={modalVariants}>
            <div className="modal-container">
                <div className="modal-close-container">
                    <span onClick={() => dispatch(setIsShowSigninModal({ isShowSigninModal: false }))}>
                        <CloseIcon />
                    </span>
                </div>
                <div className="modal-header">
                    <h1 className="logo-header-container">RA'AYA</h1>
                    <div className="modal-header-description">
                        <span>Find Expert For Your Problem</span>
                    </div>
                </div>
                <div className="signup-progress-bar-container">
                    <div className={formNavigation >= 1 ? "signup-acheived-container" : '' }>1</div>
                    <div className={formNavigation >= 2 ? "signup-acheived-container" : '' }>2</div>
                    <div className={formNavigation >= 3 ? "signup-acheived-container" : '' }>3</div>
                    <div className={formNavigation >= 4 ? "signup-acheived-container" : '' }>4</div>
                </div>
                <div className="modal-body">
                    <form onSubmit={handleSubmit}>
                        {
                            formNavigation === 1 ?
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
                            :
                            null
                        }
                        {
                            formNavigation === 2 ?
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
                            formNavigation === 2 ?
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
                            formNavigation === 3 ?
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
                            formNavigation === 3 ?
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
                            formNavigation === 3 ?
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
                            formNavigation === 4 ?
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
                                    { formNavigation === 4 ? 'Create Account' : 'Next' }
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
                            Already a member?<span className="signup"> Signin</span>
                            </span>
                        </div>
                    </form>
                </div>
            </div>
        </motion.div>
    </div>
}

export default SignupFormModal