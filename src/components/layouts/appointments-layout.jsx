import { Outlet } from 'react-router-dom'
import './layout.css'
import { NavLink } from 'react-router-dom'

const AppointmentLayout = () => {

    return <div className="min-height-100">
        <br />
        <div className="styled-container">
            <div className="mini-nav-container">
                <NavLink to="/appointments/status/upcoming" className="main-tag main-color-text">
                    Upcoming
                </NavLink>
                <NavLink to="/appointments/status/previous" className="main-tag main-color-text">
                    Previous
                </NavLink>
            </div>
            <Outlet />
        </div>
        <br />
    </div>
}

export default AppointmentLayout