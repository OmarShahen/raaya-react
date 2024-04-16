import { NavLink, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from 'react-redux'
import { setIsLogged } from "../../redux/slices/userSlice"
import { motion } from 'framer-motion'


const MobileMenu = ({ isShowMobileMenu, setIsShowMobileMenu }) => {

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const user = useSelector(state => state.user.user)

    return <div className="mobile-menu-container">
        <motion.div
            className="sidebar-content"
            initial={{ x: -300 }}
            animate={{ x: isShowMobileMenu ? 0 : -300 }}
            transition={{ type: 'spring', stiffness: 200, damping: 25 }}
        >
        <ul className="mobile-menu-list-container">
            {
                user.isLogged ?
                null
                :
                <li>
                    <NavLink to="/auth/login" onClick={() => setIsShowMobileMenu(false)}>
                        Login
                    </NavLink>
                </li>
            }
            {
                user.isLogged ?
                null
                :
                <li>
                    <NavLink to="/auth/signup" onClick={() => setIsShowMobileMenu(false)}>
                        Signup
                    </NavLink>
                </li>
            }
            {
                user.isLogged ?
                <li>
                    <NavLink to="/appointments/status/upcoming" onClick={() => setIsShowMobileMenu(false)}>
                        Sessions
                    </NavLink>
                </li>
                :
                null
            }
            {
                user.isLogged ?
                <li>
                    <NavLink to="/users/opening-times" onClick={() => setIsShowMobileMenu(false)}>
                        Schedule
                    </NavLink>
                </li>
                :
                null
            }
            {
                user.isLogged ?
                <li>
                    <NavLink to="/users/services" onClick={() => setIsShowMobileMenu(false)}>
                        Services
                    </NavLink>
                </li>
                :
                null
            }
            {
                user.isLogged ?
                <li>
                    <NavLink to="/users/profile" onClick={() => setIsShowMobileMenu(false)}>
                        My Profile
                    </NavLink>
                </li>
                :
                null
            }
            {
                user.isLogged && user.type === 'EXPERT' ?
                <li>
                    <NavLink to="/analytics/views" onClick={() => setIsShowMobileMenu(false)}>
                        Views Analytics
                    </NavLink>
                </li>
                :
                null
            }
            {
                user.isLogged && user.type === 'EXPERT' ?
                <li>
                    <NavLink to="/analytics/feedback" onClick={() => setIsShowMobileMenu(false)}>
                        Feedback Analytics
                    </NavLink>
                </li>
                :
                null
            }
            {
                user.isLogged ?
                <li>
                    <NavLink to="/logout" onClick={e => {
                        e.preventDefault()
                        localStorage.setItem('user', null)
                        dispatch(setIsLogged(false))
                        navigate('/auth/login')
                        setIsShowMobileMenu(false)
                    }}>
                        Logout
                    </NavLink>
                </li>
                :
                null
            }
        </ul>
        </motion.div>
    </div>
}

export default MobileMenu