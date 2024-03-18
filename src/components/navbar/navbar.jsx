import { useState } from 'react'
import './navbar.css'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, NavLink } from 'react-router-dom'
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined'
import ScheduleOutlinedIcon from '@mui/icons-material/ScheduleOutlined'
import DuoOutlinedIcon from '@mui/icons-material/DuoOutlined'
import ExitToAppOutlinedIcon from '@mui/icons-material/ExitToAppOutlined'
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined'
import { setIsLogged } from '../../redux/slices/userSlice'
import ClassOutlinedIcon from '@mui/icons-material/ClassOutlined'
import SearchQuestionsSection from '../search/search-questions'
import { serverRequest } from '../API/request'
import SearchIcon from '@mui/icons-material/Search'
import MenuIcon from '@mui/icons-material/Menu'
import MobileMenu from './mobile-menu'


const Navbar = () => {

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const user = useSelector(state => state.user.user)

    const [searchName, setSearchName] = useState()
    const [results, setResults] = useState([])
    const [isShow, setIsShow] = useState(false)
    const [isShowMobileMenu, setIsShowMobileMenu] = useState(false)

    const searchQuestions = (value) => {
        if(!value) {
            setResults([])
            return
        }
        serverRequest.get(`/v1/issues`, { params: { name: value, limit: 10 } })
        .then(response => {
            setResults(response.data.issues)
        })
        .catch(error => {
            console.error(error)
        })
    }

    return <div className="navbar-parent-container">
        <div className="navbar-container border-line">
            <div className="flex-start">
                <h2 
                className="hoverable no-space" 
                onClick={() => navigate('/')}>
                    RA'AYA
                </h2>
            </div>
            <div className="navbar-search-container">
                <input
                type="search"
                placeholder="Write your challenge to find the right expert..."
                className="form-input"
                value={searchName}
                onClick={() => setIsShow(true)}
                onChange={e => {
                    setSearchName(e.target.value)
                    searchQuestions(e.target.value)
                }}
                />
                <SearchIcon />
            </div>
            <div className="hide-mobile">
                <div className="flex-end">
                    {
                        user.isLogged ?
                        <div className="navbar-profile-container hide-mobile">
                            <ul>
                                <li className="hide-mobile">
                                    <NavLink to="/users/profile">
                                        <AccountCircleOutlinedIcon />
                                        <span>My Profile</span>
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
                        <div className="navbar-links-container hide-mobile">
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
            </div>
            <div onClick={() => setIsShowMobileMenu(!isShowMobileMenu)} className="show-mobile burger-menu-container hoverable">
                <MenuIcon style={{ fontSize: '1.5rem' }} />
            </div>
        </div>
        {
            isShow ?
            <SearchQuestionsSection 
            searchName={searchName} 
            setSearchName={setSearchName}
            results={results} 
            setIsShow={setIsShow}
            />
            :
            null
        }
        {
            isShowMobileMenu ?
            <MobileMenu 
            isShowMobileMenu={isShowMobileMenu} 
            setIsShowMobileMenu={setIsShowMobileMenu}
            />
            :
            null
        }
    </div>
}

export default Navbar