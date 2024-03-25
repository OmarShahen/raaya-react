import { useState, useEffect } from 'react'
import './auth.css'
import zoomImage from '../../assets/zoom-image.png'
import { useDispatch } from 'react-redux'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import { toast } from 'react-hot-toast'
import { serverRequest } from '../../components/API/request'
import Loading from '../../components/loading/loading'
import { getTimeZone } from '../../utils/time'
import { setUser, setIsLogged } from '../../redux/slices/userSlice'
import { NavLink, useNavigate, useSearchParams } from 'react-router-dom'
import { GoogleLogin } from '@react-oauth/google'
import axios from 'axios'
import { motion } from 'framer-motion'
import { onAnalytics } from '../../../google-analytics/analytics'


const SignupPage = () => {

    const [searchParams] = useSearchParams()

    const [isExpert] = useState(searchParams.get('type') === 'EXPERT' ? true : false)
    const expertVerificationId = searchParams.get('expertVerification')

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [isShowPassword, setIsShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [isShowVerificationCode, setIsShowVerificationCode] = useState(false)

    const [userId, setUserId] = useState()
    const [userEmail, setUserEmail] = useState()

    const [verifiedEmail, setVerifiedEmail] = useState()

    const [name, setName] = useState()
    const [gender, setGender] = useState()
    const [dateOfBirth, setDateOfBirth] = useState()
    const [email, setEmail] = useState()
    const [phone, setPhone] = useState()
    const [password, setPassword] = useState()
    const [verificationCode, setVerificationCode] = useState()
    const [profileImageURL, setProfileImageURL] = useState()
    const [nationality, setNationality] = useState('EGYPT')
    const [nationCode, setNationCode] = useState('EG')
    const [currency, setCurrency] = useState('EGP')
    const [currencyName, setCurrencyName] = useState('POUND')

    const [emailError, setEmailError] = useState()
    const [phoneError, setPhoneError] = useState()
    const [passwordError, setPasswordError] = useState()
    const [nameError, setNameError] = useState()
    const [genderError, setGenderError] = useState()
    const [dateOfBirthError, setDateOfBirthError] = useState()
    const [verificationCodeError, setVerificationCodeError] = useState()

    const divAnimation = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0 },
    }

    useEffect(() => {
        scroll(0, 0)
        document.title = 'Sign up'
        localStorage.setItem('user', null)
        dispatch(setIsLogged(false))
    }, [])

    useEffect(() => {
        axios.get('https://ipapi.co/json')
        .then(response => {
            setCurrencyName(response.data.currency_name.toUpperCase())
            setCurrency(response.data.currency)
            setNationCode(response.data.country)
            setNationality(response.data.country_name.toUpperCase())
        })
        .catch(error => {
            console.error(error)
        })
    }, [])

    const handleSubmit = (e) => {
        e.preventDefault()

        if(!name) return setNameError('Name is required')

        if(!email) return setEmailError('Email is required')

        if(!phone) return setPhoneError('Phone is required')

        if(phone.length !== 11) return setPhoneError('Phone number must be 11 digits')

        if(phone[0] !== '0' && phone[1] !== '1') return setPhoneError('Phone number must be in this format: 01*********')

        if(!password) return setPasswordError('Password is required')

        if(!gender) return setGenderError('Gender is required')

        if(!dateOfBirth) return setDateOfBirthError('Date of birth is required')

        const signupData = {
            firstName: name,
            email: email.toLowerCase(),
            phone: Number.parseInt(phone),
            password,
            gender,
            dateOfBirth,
            countryCode: 20,
            timeZone: getTimeZone(),
            type: 'SEEKER',
            nationality,
            nationCode,
            currency,
            currencyName
        }

        setIsLoading(true)
        serverRequest.post('/v1/auth/seekers/signup', signupData)
        .then(response => {
            setIsLoading(false)
            setUserId(response.data.user._id)
            setUserEmail(response.data.user.email)
            setIsShowVerificationCode(true)
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

    const handleExpertSubmit = (e) => {
        e.preventDefault()

        if(!name) return setNameError('Name is required')

        if(!email) return setEmailError('Email is required')

        if(!phone) return setPhoneError('Phone is required')

        if(phone.length !== 11) return setPhoneError('Phone number must be 11 digits')

        if(phone[0] !== '0' && phone[1] !== '1') return setPhoneError('Phone number must be in this format: 01*********')

        if(!password) return setPasswordError('Password is required')

        const signupData = {
            firstName: name,
            email: email.toLowerCase(),
            phone: Number.parseInt(phone),
            password,
            countryCode: 20,
            timeZone: getTimeZone(),
            expertVerificationId
        }

        setIsLoading(true)
        serverRequest.post('/v1/auth/experts/signup', signupData)
        .then(response => {
            setIsLoading(false)
            setUserId(response.data.user._id)
            setUserEmail(response.data.user.email)
            setIsShowVerificationCode(true)
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

    const handleGoogleSubmit = (e) => {
        e.preventDefault()

        if(!name) return setNameError('Name is required')

        if(!email) return setEmailError('Email is required')

        if(!phone) return setPhoneError('Phone is required')

        if(phone.length !== 11) return setPhoneError('Phone number must be 11 digits')

        if(phone[0] !== '0' && phone[1] !== '1') return setPhoneError('Phone number must be in this format: 01*********')

        if(!password) return setPasswordError('Password is required')

        if(!gender) return setGenderError('Gender is required')

        if(!dateOfBirth) return setDateOfBirthError('Date of birth is required')

        const signupData = {
            firstName: name,
            email: email.toLowerCase(),
            phone: Number.parseInt(phone),
            password,
            gender,
            dateOfBirth,
            countryCode: 20,
            timeZone: getTimeZone(),
            profileImageURL,
            nationality,
            nationCode,
            currency,
            currencyName
        }

        setIsLoading(true)
        serverRequest.post('/v1/auth/seekers/google/signup', signupData)
        .then(response => {
            setIsLoading(false)
            const data = response.data
            let user = data.user
            user.accessToken = data.token
            localStorage.setItem('user', JSON.stringify({ ...user, isLogged: true }))
            dispatch(setUser({ ...user, isLogged: true }))
            onAnalytics('seeker_google_registered', { event_category: 'Authentication', event_label: 'Seeker Google Registered' })
            navigate('/find-expert')
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

    const handleVerificationCode = (e) => {

        e.preventDefault()

        if(!verificationCode) return setVerificationCodeError('Verification code is required')

        setIsLoading(true)
        serverRequest.post(`/v1/auth/verify/users/${userId}/verification-codes/${verificationCode}`)
        .then(response => {
            setIsLoading(false)
            const data = response.data
            let user = data.user
            user.accessToken = data.token
            localStorage.setItem('user', JSON.stringify({ ...user, isLogged: true }))
            dispatch(setUser({ ...user, isLogged: true }))

            const eventName = isExpert ? 'expert_registered' : 'seeker_registered'
            const eventLabel = isExpert ? 'Expert Registered' : 'Seeker Registered'
            onAnalytics(eventName, { event_category: 'Authentication', event_label: eventLabel })
            
            isExpert ? navigate('/users/profile') : navigate('/find-expert')

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

    const onGoogleSuccess = (credentialResponse) => {

        const { credential } = credentialResponse

        axios.get(`https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${credential}`)
        .then(response => {
            const data = response.data

            const { name, email, picture } = data

            setName(name)
            setVerifiedEmail(email)
            setEmail(email)
            setProfileImageURL(picture)
            setIsShowVerificationCode(false)
            
        })
        .catch(error => {
            console.error(error)
            toast.error(error?.response?.data?.message, { duration: 3000, position: 'top-right' })
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
                <h1>Sign Up</h1>
                <div>
                    <span className="fadded-black-text normal-font sub-header-text">
                    {
                        isExpert ?
                        'Unlock your expertise - Join our expert community!'
                        :
                        'Book sessions with knowledgeable experts and receive personalized advice and guidance'
                    } 
                    </span>
                </div>
                <div className="margin-top-1">
                    
                    {
                        isShowVerificationCode ?
                        <form onSubmit={handleVerificationCode} className="auth-verification-code-container">
                            <motion.div
                            initial="hidden"
                            animate="visible"
                            variants={divAnimation}
                            transition={{ duration: 0.5 }}
                            >
                                <div>
                                    
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
                                        <div className="red-text align-left">
                                            <span>{verificationCodeError}</span>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                {
                                    isLoading ?
                                    <div className="flex-center">
                                        <Loading width="30" height="30" />
                                    </div>
                                    :
                                    <button className="normal-button main-color-bg white-text full-width">
                                        Submit
                                    </button>
                                }
                                <div>
                                    <button onClick={() => setIsShowVerificationCode(false)} className="normal-button full-width">Back</button>
                                </div>
                                </div>
                            </motion.div>
                        </form>
                        :
                        <form onSubmit={isExpert ? handleExpertSubmit : verifiedEmail === email ? handleGoogleSubmit : handleSubmit}>
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
                                <div className="red-text align-left">
                                    <span>{passwordError}</span>
                                </div>
                            </div>                         
                            {
                                isExpert ?
                                null
                                :
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
                                    <div className="red-text align-left">
                                        <span>{genderError}</span>
                                    </div>
                                </div>
                            }   
                            
                            {
                                isExpert ?
                                null
                                :
                                <div className="form-input-container">
                                    <input 
                                    type="date" 
                                    className="form-input"
                                    onClick={() => setDateOfBirthError()}
                                    onChange={e => setDateOfBirth(e.target.value)}
                                    value={dateOfBirth}
                                    />
                                    <div className="red-text align-left">
                                        <span>{dateOfBirthError}</span>
                                    </div>
                                </div>
                            } 
                            
                            
                        <div className="form-input-container margin-top-1">
                            {
                                isLoading ?
                                <div className="flex-center">
                                    <Loading width="30" height="30" />
                                </div>
                                :
                                <button className="bold-text normal-button main-color-bg white-text full-width">
                                    Create Account
                                </button>
                            }
                        </div>
                        
                        <div className="form-signup-container">
                            <span>
                                Already a member?<NavLink to="/auth/login" className="no-decoration bold-text main-color-text"> Signin</NavLink>
                            </span>
                        </div>
                        </form>
                    }
                </div>
                {
                    isExpert ?
                    null
                    :
                    <div className="margin-top-1">
                        <GoogleLogin
                        onSuccess={onGoogleSuccess}
                        onError={() => {
                            setEmailError('There was a problem login to your account')
                        }}
                        shape={'pill'}
                        text={'continue_with'}
                        size={'large'}
                        theme={'filled_blue'}
                        useOneTap
                        />
                    </div>
                }
                
            </div>
        </div>
    </div>
}

export default SignupPage