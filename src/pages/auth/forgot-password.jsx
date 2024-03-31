import { useState, useEffect } from 'react'
import './auth.css'
import zoomImage from '../../assets/zoom-image.png'
import { toast } from 'react-hot-toast'
import { serverRequest } from '../../components/API/request'
import Loading from '../../components/loading/loading'
import { NavLink, useNavigate } from 'react-router-dom'


const ForgotPasswordPage = () => {

    const navigate = useNavigate()
    
    const [isLoading, setIsLoading] = useState(false)

    const [email, setEmail] = useState()

    const [emailError, setEmailError] = useState()

    useEffect(() => {
        scroll(0, 0)
    }, [])

    const handleSubmit = (e) => {
        e.preventDefault()

        if(!email) return setEmailError('Email is required')

        setIsLoading(true)
        serverRequest.post('/v1/auth/forgot-password', { email })
        .then(() => {
            setIsLoading(false)
            navigate(`/auth/forgot-password/${email}/verification-code`)
        })
        .catch(error => {
            setIsLoading(false)
            console.error(error)

            if(error?.response?.data?.field === 'email') return setEmailError(error?.response?.data?.message)

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
                <h1>Forgot Password?</h1>
                <div>
                    <span className="fadded-black-text normal-font sub-header-text">
                        Don't worry. Resetting your password is easy, just tell us the email address you registered with us
                    </span>
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
                                                    
                        <div className="form-input-container">
                            {
                                isLoading ?
                                <div className="flex-center">
                                    <Loading width="30" height="30" />
                                </div>
                                :
                                <button className="normal-button main-color-bg white-text full-width">
                                    Send
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
            </div>
        </div>
    </div>
}

export default ForgotPasswordPage