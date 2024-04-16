import { Outlet, NavLink } from "react-router-dom"
import { useSelector } from "react-redux"


const AnalyticsLayout = () => {

    return <div className="min-height-100">
        <br />
        <div className="analytics-layout-container">
            <div className="hide-mobile">
                <div className="styled-container">
                    <h6 className="no-space large-font">Analytics</h6>
                    <div>
                        <ul className="user-profile-navigation-links">
                            <li>
                                <NavLink to="/analytics/views" className="fadded-black-text">Views Analytics</NavLink>
                            </li>

                            <li>
                                <NavLink to="/analytics/feedback" className="fadded-black-text">Feedback Analytics</NavLink>
                            </li>
                        </ul>
                    </div>
                </div> 
            </div>
            <Outlet />
        </div>
        <br />
    </div>
}

export default AnalyticsLayout