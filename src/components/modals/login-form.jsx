import { useState } from 'react'
import './modal.css'
import { motion } from 'framer-motion'
import CloseIcon from '@mui/icons-material/Close'
import { useDispatch, useSelector } from 'react-redux'
import { setIsShowLoginModal } from '../../redux/slices/modalSlice'
import Loading from '../loading/loading'
import { serverRequest } from '../API/request'
import { setUser } from '../../redux/slices/userSlice'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import { toast } from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'


const LoginFormModal = () => {

    const dispatch = useDispatch()
    const navigate = useNavigate()
    
    const modal = useSelector(state => state.modal)

    const [isLoading, setIsLoading] = useState(false)
    const [isShowPassword, setIsShowPassword] = useState(false)

    const [email, setEmail] = useState()
    const [password, setPassword] = useState()

    const [emailError, setEmailError] = useState()
    const [passwordError, setPasswordError] = useState()

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

    const handleSubmit = (e) => {
        e.preventDefault()

        if(!email) return setEmailError('البريد مطلوب')

        if(!password) return setPasswordError('كلمة المرور مطلوبة')

        const loginData = { email, password }

        setIsLoading(true)
        serverRequest.post('/v1/auth/login', loginData)
        .then(response => {
            setIsLoading(false)
            const data = response.data
            let user = data.user
            user.accessToken = data.token
            sessionStorage.setItem('user', JSON.stringify({ ...user, isLogged: true }))
            dispatch(setUser({ ...user, isLogged: true }))
            dispatch(setIsShowLoginModal({ isShowLoginModal: false }))

            if(user.type === 'EXPERT') {
                navigate(`/appointments/status/upcoming`)
            }
        })
        .catch(error => {
            setIsLoading(false)
            console.error(error)

            if(error?.response?.data?.field === 'email') return setEmailError(error?.response?.data?.message)

            if(error?.response?.data?.field === 'password') return setPasswordError(error?.response?.data?.message)

            return toast.error(error?.response?.data?.message, { position: 'top-right', duration: 3000 })

        })
    }

    return <div className="modal">
        <motion.div
        initial="hidden"
        animate={modal.isShowLoginModal ? 'visible' : 'hidden'}
        exit="exit"
        variants={modalVariants}>
            <div className="modal-container">
                <div className="modal-close-container">
                    <span onClick={() => dispatch(setIsShowLoginModal({ isShowLoginModal: false }))}>
                        <CloseIcon />
                    </span>
                </div>
                <div className="modal-header">
                    <h1 className="logo-header-container">RA'AYA</h1>
                    <div className="modal-header-description">
                        <span>Find Expert For Your Problem</span>
                    </div>
                </div>
                <div className="modal-body">
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
                            <div> 
                                <span className="red-text">{emailError}</span>
                            </div>
                        </div>
                        <div className="form-input-container password-container">
                            <input 
                            type={isShowPassword ? 'text' : 'password' }
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
                        </div>
                        <div> 
                            <span className="red-text">{passwordError}</span>
                        </div>
                        <div>
                            <span className="main-color-text small-font bold-text hoverable">Forgot password?</span>
                        </div>
                        {
                            isLoading ?
                            <div className="flex-center">
                            <Loading height='35' width='35' />
                            </div>
                            :
                            <div className="form-input-container">
                                <button className="normal-button main-color-bg white-text full-width">
                                    Signin 
                                </button>
                            </div>
                        }
                        <div className="form-signup-container">
                            <span>
                            Don't have an account?<span className="signup hoverable"> Signup</span>
                            </span>
                        </div>
                    </form>
                </div>
            </div>
        </motion.div>
    </div>
}

export default LoginFormModal