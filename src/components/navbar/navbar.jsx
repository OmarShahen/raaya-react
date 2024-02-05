import './navbar.css'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, NavLink } from 'react-router-dom'
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined'
import ScheduleOutlinedIcon from '@mui/icons-material/ScheduleOutlined'
import DuoOutlinedIcon from '@mui/icons-material/DuoOutlined'
import ExitToAppOutlinedIcon from '@mui/icons-material/ExitToAppOutlined'
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined'
import { setIsLogged } from '../../redux/slices/userSlice'
import PermContactCalendarOutlinedIcon from '@mui/icons-material/PermContactCalendarOutlined'
import ClassOutlinedIcon from '@mui/icons-material/ClassOutlined'
import CardImage from '../images/image'


const Navbar = () => {

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const user = useSelector(state => state.user.user)

    return <div>
        <div className="navbar-container border-line">
            <div className="flex-space-between-center">
                <h2 
                className="hoverable no-space" 
                onClick={() => navigate('/')}>
                    RA'AYA
                </h2>
                <span className="status-btn pending margin-left-1 bold-text small-font">
                    BETA
                </span>
            </div>
            <div>
                {
                    user.isLogged ?
                    <div className="navbar-profile-container hide-mobile">
                        <ul>
                            <li className="hide-mobile">
                                <NavLink to="/users/profile">
                                    <AccountCircleOutlinedIcon />
                                    <span>{user.firstName}</span>
                                </NavLink>
                            </li>
                            
                            {
                                user.type === 'EXPERT' ?
                                <li className="hide-mobile">
                                    <NavLink to="/users/services">
                                        <ReceiptLongOutlinedIcon />
                                        <span>Services</span>
                                    </NavLink>
                                </li>
                                :
                                null
                            }
                            {
                                user.type === 'EXPERT' ?
                                <li className="hide-mobile">
                                    <NavLink to="/users/opening-times">
                                        <ScheduleOutlinedIcon />
                                        <span>Schedule</span>
                                    </NavLink>
                                </li>
                                :
                                null
                            }
                            <li className="hide-mobile">
                                <NavLink to="/appointments/status/upcoming">
                                    <DuoOutlinedIcon />
                                    <span>Sessions</span>
                                </NavLink>
                            </li>
                            {
                                user.type === 'SEEKER' ?
                                <li className="hide-mobile">
                                    <NavLink to="/find-expert">
                                        <ClassOutlinedIcon />
                                        <span>Find Expert</span>
                                    </NavLink>
                                </li>
                                :
                                null
                            }
                            <li className="hide-mobile">
                                <NavLink to="/logout" onClick={e => {
                                    e.preventDefault()
                                    localStorage.setItem('user', null)
                                    dispatch(setIsLogged(false))
                                    navigate('/auth/login')
                                }}>
                                    <ExitToAppOutlinedIcon />
                                    <span>Logout</span>
                                </NavLink>
                            </li>
                        </ul>
                    </div>
                    :
                    <div className="navbar-links-container">
                        <ul>
                            <li>
                                <NavLink className="normal-button black-text" to="/auth/login">Login</NavLink>
                            </li>
                            <li>
                                <NavLink className="normal-button main-color-bg white-text" to="/auth/signup">Signup</NavLink>
                            </li>
                        </ul>
                    </div>
                }
            </div>
            {
                user.isLogged ?
                <div className="show-mobile">
                    <CardImage 
                    name={user.firstName}
                    imageURL={user.profileImageURL} 
                    borderRadius={'50%'}
                    height={'3rem'}
                    width={'3rem'}
                    />
                </div>
                :
                null
            }
        </div>
    </div>
}

export default Navbar