import CountUp from 'react-countup'
import './stats-card.css'
import { NorthOutlined } from '@mui/icons-material'


const Card = ({ cardHeader, icon, iconColor, number, isMoney=false }) => {

    return <div className="card-container body-text disable-hover cards-white-bg">
        <div className="card-header-container">
            <div>
                <strong className="grey-text">{cardHeader}</strong>
            </div>
            <div>
                <span className="pending stats-card-icon-container">
                    {icon}
                </span>
            </div>
        </div>
        <div className="card-number-container">
            { 
                isMoney ? 
                number
                :
                <CountUp 
                end={number}
                duration={1.5}
                />
            }
        </div>
        {/*<div className="card-footer">
            <div>
            <   span className="status-btn done"><NorthOutlined /> 12%</span>
            </div>
            <span className="grey-text">since last week</span>
        </div>*/}
    </div>
}

export default Card