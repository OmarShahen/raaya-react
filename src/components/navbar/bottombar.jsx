import { NavLink, useNavigate } from 'react-router-dom'
import './bottombar.css'
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined'
import ScheduleOutlinedIcon from '@mui/icons-material/ScheduleOutlined'
import DuoOutlinedIcon from '@mui/icons-material/DuoOutlined'
import ExitToAppOutlinedIcon from '@mui/icons-material/ExitToAppOutlined'
import { setIsLogged } from '../../redux/slices/userSlice'
import { useDispatch } from 'react-redux'
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined'


const BottomBar = () => {

    const navigate = useNavigate()
    const dispatch = useDispatch()


    return <div className="bottom-bar-container show-mobile">
        <ul>
            <li>
                <NavLink to="/users/services">
                    <ReceiptLongOutlinedIcon />
                    Services
                </NavLink>
            </li>
            <li>
                <NavLink to="/users/opening-times">
                    <ScheduleOutlinedIcon />
                    Schedule
                </NavLink>
            </li>
            <li>
                <NavLink to="/appointments/status/upcoming">
                    <DuoOutlinedIcon />
                    Sessions
                </NavLink>
            </li>
            <li>
                <NavLink to="/users/profile">
                    <AccountCircleOutlinedIcon />
                    Account
                </NavLink>
            </li>
            <li>
                <NavLink to="/logout" onClick={e => {
                    e.preventDefault()
                    localStorage.setItem('user', null)
                    dispatch(setIsLogged(false))
                    navigate('/auth/login')
                }}>
                    <ExitToAppOutlinedIcon />
                    Logout
                </NavLink>
            </li>
        </ul>
    </div>
}

export default BottomBar