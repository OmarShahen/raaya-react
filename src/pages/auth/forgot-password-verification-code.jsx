import { useState, useEffect } from 'react'
import './auth.css'
import zoomImage from '../../assets/zoom-image.png'
import { serverRequest } from '../../components/API/request'
import Loading from '../../components/loading/loading'
import { NavLink, useNavigate } from 'react-router-dom'


const ForgotPasswordVerificationCodePage = () => {

    const navigate = useNavigate()

    const pagePath = window.location.pathname
    const userEmail = pagePath.split('/')[3]
    
    const [isLoading, setIsLoading] = useState(false)

    const [code, setCode] = useState()

    const [codeError, setCodeError] = useState()

    useEffect(() => {
        scroll(0, 0)
    }, [])

    const handleSubmit = (e) => {
        e.preventDefault()

        if(!code) return setCodeError('Verification code is required')

        const verificationData = { email: userEmail, verificationCode: Number.parseInt(code) }

        setIsLoading(true)
        serverRequest.post(`/v1/auth/verify/reset-password/verifications-codes`, verificationData)
        .then(() => {
            setIsLoading(false)
            navigate(`/auth/reset-password/${userEmail}/${code}`)
        })
        .catch(error => {
            setIsLoading(false)
            console.error(error)
            try {

                const errorData = error.response.data

                if(errorData.field === 'verificationCode' || errorData.field === 'email') return setCodeError(errorData.message)

            } catch(erorr) {
                console.error(error)
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
                <h1>Verify Your Email</h1>
                <div>
                    <span className="fadded-black-text normal-font sub-header-text">
                        We sent a reset password verification code to <span className="main-color-text bold-text">{userEmail}</span>. Please enter the code to set your new password
                    </span>
                </div>
                <div className="margin-top-1">
                    <form onSubmit={handleSubmit}>
                        <div className="form-input-container">
                            <input 
                            type="number" 
                            placeholder="Verification Code" 
                            className="form-input"
                            onClick={() => setCodeError()}
                            onChange={e => setCode(e.target.value)}
                            value={code}
                            />
                            <div className="red-text align-left">
                                <span>{codeError}</span>
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
                                    Verify
                                </button>
                            }
                        </div>
                    
                    <div className="form-signup-container">
                        <span>
                            Didn't receive the email? <NavLink to="/auth/forgot-password" className="signup no-decoration"> Change email</NavLink>
                        </span>
                    </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
}

export default ForgotPasswordVerificationCodePage