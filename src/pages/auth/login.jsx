import { useState, useEffect } from 'react'
import './auth.css'
import zoomImage from '../../assets/zoom-image.png'
import { useDispatch } from 'react-redux'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import { toast } from 'react-hot-toast'
import { serverRequest } from '../../components/API/request'
import Loading from '../../components/loading/loading'
import { setUser, setIsLogged } from '../../redux/slices/userSlice'
import { NavLink, useNavigate } from 'react-router-dom'
import { GoogleLogin } from '@react-oauth/google'
import { useSearchParams } from "react-router-dom"
import { onAnalytics } from '../../../google-analytics/analytics'


const LoginPage = () => {

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [searchParams, setSearchParams] = useSearchParams()
    const [isReturnBack, setIsReturnBack] = useState(searchParams.get('back') === 'true' ? true : false)
    
    const [isLoading, setIsLoading] = useState(false)
    const [isShowPassword, setIsShowPassword] = useState(false)

    const [email, setEmail] = useState()
    const [password, setPassword] = useState()

    const [emailError, setEmailError] = useState()
    const [passwordError, setPasswordError] = useState()

    useEffect(() => {
        scroll(0, 0)
        document.title = 'Sign in'
        localStorage.setItem('user', null)
        dispatch(setIsLogged(false))
    }, [])

    const handleSubmit = (e) => {
        e.preventDefault()

        if(!email) return setEmailError('Email is required')

        if(!password) return setPasswordError('Password is required')

        const loginData = { email: email.toLowerCase(), password }

        setIsLoading(true)
        serverRequest.post('/v1/auth/login', loginData)
        .then(response => {
            setIsLoading(false)
            const data = response.data
            let user = data.user
            user.accessToken = data.token
            localStorage.setItem('user', JSON.stringify({ ...user, isLogged: true }))
            dispatch(setUser({ ...user, isLogged: true }))
            onAnalytics('user_login', { event_category: 'Authentication', event_label: 'User Login' })
            isReturnBack ? navigate(-1) : navigate('/appointments/status/upcoming')
        })
        .catch(error => {
            setIsLoading(false)
            console.error(error)

            if(error?.response?.data?.field === 'email') return setEmailError(error?.response?.data?.message)

            if(error?.response?.data?.field === 'password') return setPasswordError(error?.response?.data?.message)

            return toast.error(error?.response?.data?.message, { position: 'top-right', duration: 3000 })

        })
    }

    const onGoogleSuccess = (credentialResponse) => {

        const { credential } = credentialResponse

        serverRequest.post(`/v1/auth/google/login?accessToken=${credential}`)
        .then(response => {
            const data = response.data
            let user = data.user
            user.accessToken = data.token
            localStorage.setItem('user', JSON.stringify({ ...user, isLogged: true }))
            dispatch(setUser({ ...user, isLogged: true }))
            onAnalytics('google_login', { event_category: 'Authentication', event_label: 'Google Login' })
            isReturnBack ? navigate(-1) : navigate('/appointments/status/upcoming')
        })
        .catch(error => {
            console.error(error)
            setEmailError(error?.response?.data?.message)
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
                <h1>Sign In</h1>
                <div>
                    <span className="fadded-black-text normal-font sub-header-text">Book sessions with knowledgeable experts and receive personalized advice and guidance</span>
                </div>
                <div className="margin-top-1">
                    <form onSubmit={handleSubmit}>
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
                        <div className="align-left">
                            <NavLink to="/auth/forgot-password" className="no-decoration bold-text main-color-text small-font">Forgot password?</NavLink>  
                        </div>                                 
                        <div className="form-input-container">
                            {
                                isLoading ?
                                <div className="flex-center">
                                    <Loading width="30" height="30" />
                                </div>
                                :
                                <button className="bold-text normal-button main-color-bg white-text full-width">
                                    Sign In
                                </button>
                            }
                        </div>
                    
                    <div className="form-signup-container">
                        <span>
                            Doesn't have an account?<NavLink to="/auth/signup" className="signup no-decoration"> Signup</NavLink>
                        </span>
                    </div>
                    </form>
                </div>
                <div className="margin-top-1">
                <GoogleLogin
                onSuccess={onGoogleSuccess}
                onError={() => {
                    setEmailError('There was a problem login to your account')
                }}
                shape={'pill'}
                size={'large'}
                theme={'filled_blue'}
                text={'continue_with'}
                useOneTap
                />
                </div>
            </div>
        </div>
    </div>
}

export default LoginPage