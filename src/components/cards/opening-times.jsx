import CardDate from './components/date'
import CardActions from './components/actions'
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined'
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined'
import { capitalizeFirstLetter } from './../../utils/formatString'
import { useNavigate } from 'react-router-dom'
import { WEEK_DAYS } from './../../utils/time'
import CardTransition from '../transitions/card-transitions'
import './row-card.css'

const OpeningTimeCard = ({ 
    openingTime,
    setOpeningTime,
    setIsUpdate,
    setIsShowUpdate,
    setIsShowDelete,
}) => {

    const navigate = useNavigate()

    const cardActionsList = [
        {
            name: 'Delete Opening Time',
            icon: <DeleteOutlineOutlinedIcon />,
            onAction: (e) => {
                e.stopPropagation()
                setOpeningTime(openingTime)
                setIsShowDelete(true)
            }
        },
        {
            name: 'Update Opening Time',
            icon: <CreateOutlinedIcon />,
            onAction: (e) => {
                e.stopPropagation()
                setIsUpdate(true)
                setOpeningTime(openingTime)
                setIsShowUpdate(true)
            }
        }
    ]

    const formatHour = (hour) => {
        if(hour <= 12) {
            return hour
        }

        return hour - 12
    }

    const formatTimeNumber = (time) => {
        const strTime = String(time)
        if(strTime.length > 1) {
            return String(time)
        }

        return '0' + strTime
    }

    const getTimePeriod = (hour) => {
        return hour >= 12 ? 'PM' : 'AM'
    }
    
    const getOpeningTimeStatus = (openingTime) => {
        const todayDate = new Date()
        const openingDate = new Date()
        const closingDate = new Date()

        
        const todayDay = WEEK_DAYS[todayDate.getDay()]

        openingDate.setHours(openingTime.openingTime.hour)
        openingDate.setMinutes(openingTime.openingTime.minute)

        closingDate.setHours(openingTime.closingTime.hour)
        closingDate.setMinutes(openingTime.closingTime.minute)

        if(todayDay === openingTime.weekday && openingDate < todayDate && closingDate > todayDate) {
            return <span className="status-btn pending bold-text">Opened</span>
        }

        return <span className="status-btn bold-text grey-bg">Closed</span>

    }

    return <CardTransition>
        <div 
        onClick={e => {
            e.stopPropagation()
            setIsUpdate(true)
            setOpeningTime(openingTime)
            setIsShowUpdate(true)
        }}
        className="patient-card-container body-text">
                <CardActions actions={cardActionsList} />
            <div className="patient-card-body">
                <ul>
                    <li>
                        <strong>Day</strong>
                        <span>{capitalizeFirstLetter(openingTime?.weekday)}</span>
                    </li>
                    <li>
                        <strong>Opening</strong>
                        <span>
                            {`${formatHour(openingTime?.openingTime?.hour)}:${formatTimeNumber(openingTime?.openingTime?.minute)} ${getTimePeriod(openingTime?.openingTime?.hour)}`}
                        </span>
                    </li>
                    <li>
                        <strong>Closing</strong>
                        <span>
                            {`${formatHour(openingTime?.closingTime?.hour)}:${formatTimeNumber(openingTime?.closingTime?.minute)} ${getTimePeriod(openingTime?.closingTime?.hour)}`}
                        </span>
                    </li>
                    <li>
                        <strong>Status</strong>
                        {getOpeningTimeStatus(openingTime)}
                    </li>
                </ul>
            </div>
            <CardDate 
            creationDate={openingTime.createdAt} 
            updateDate={openingTime.updatedAt} 
            />
        </div>
    </CardTransition>
}

export default OpeningTimeCard