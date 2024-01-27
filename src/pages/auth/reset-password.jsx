import { useState, useEffect } from 'react'
import './auth.css'
import zoomImage from '../../assets/zoom-image.png'
import { serverRequest } from '../../components/API/request'
import Loading from '../../components/loading/loading'
import { useNavigate } from 'react-router-dom'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import { toast } from 'react-hot-toast'


const ResetPasswordPage = () => {

    const navigate = useNavigate()

    const pagePath = window.location.pathname
    const userEmail = pagePath.split('/')[3]
    const verificationCode = pagePath.split('/')[4]
    
    const [isLoading, setIsLoading] = useState(false)
    const [isShowPassword, setIsShowPassword] = useState(false)
    const [isShowConfirmPassword, setIsShowConfirmPassword] = useState(false)

    const [password, setPassword] = useState()
    const [confirmPassword, setConfirmPassword] = useState()

    const [passwordError, setPasswordError] = useState()
    const [confirmPasswordError, setConfirmPasswordError] = useState()

    useEffect(() => {
        scroll(0, 0)
    }, [])

    const handleSubmit = (e) => {
        e.preventDefault()

        if(!password) return setPasswordError('Password is required')

        if(password.length < 8) return setPasswordError('Password length must be at least 8 characters') 

        if(!confirmPassword) return setConfirmPasswordError('Confirm password is required')

        if(password != confirmPassword) return setConfirmPasswordError('Not the same new password')

        const verificationData = { 
            email: userEmail, 
            verificationCode: Number.parseInt(verificationCode),
            password
        }

        setIsLoading(true)
        serverRequest.post(`/v1/auth/reset-password`, verificationData)
        .then(() => {
            setIsLoading(false)
            navigate('/auth/login')
        })
        .catch(error => {
            setIsLoading(false)
            console.error(error)
            try {

                const errorData = error.response.data

                setPasswordError(errorData.message)

            } catch(erorr) {
                console.error(error)
                toast.error(error?.response?.data?.message, { duration: 3000, position: 'top-right' })
            }
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
                <h1>Reset Password</h1>
                <div>
                    <span className="fadded-black-text normal-font sub-header-text">
                        Create new password for your account
                    </span>
                </div>
                <div className="margin-top-1">
                    <form onSubmit={handleSubmit}>
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
                        <div className="form-input-container password-container">
                            <input 
                            type={isShowConfirmPassword ? 'text' : 'password'}
                            placeholder="Confirm Password" 
                            className="form-input"
                            onClick={() => setConfirmPasswordError()}
                            onChange={e => setConfirmPassword(e.target.value)}
                            value={confirmPassword}
                            />
                            {
                                isShowConfirmPassword ?
                                <span onClick={() => setIsShowConfirmPassword(!isShowConfirmPassword)} className="password-icon">
                                    <VisibilityIcon />
                                </span>
                                :
                                <span onClick={() => setIsShowConfirmPassword(!isShowConfirmPassword)} className="password-icon">
                                    <VisibilityOffIcon />
                                </span>
                            }
                            <div className="red-text align-left">
                                <span>{confirmPasswordError}</span>
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
                                    Confirm
                                </button>
                            }
                        </div>
                    
                    
                    </form>
                </div>
            </div>
        </div>
    </div>
}

export default ResetPasswordPage