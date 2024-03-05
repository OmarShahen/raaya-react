import { formatNumber } from '../../utils/numbers'
import { format } from 'date-fns'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'


const AppointmentCard = ({ appointment }) => {

    const navigate = useNavigate()

    const user = useSelector(state => state.user.user)

    const renderAppointmentStatus = (reservationTime) => {

        const todayDate = new Date()
        reservationTime = new Date(reservationTime)

        todayDate.setHours(0, 0, 0, 0);
        reservationTime.setHours(0, 0, 0, 0)

        if (reservationTime.getTime() < todayDate.getTime()) {
            return <span className="status-btn grey-bg bold-text white-text">Expired</span>
        } else if (reservationTime.getTime() > todayDate.getTime()) {
            return <span className="status-btn pending bold-text">Upcoming</span>
        } else {
            return <span className="status-btn done bold-text">Today</span>
        }
    }

    const renderAppointmentVerification = (verification) => {

        if (verification === 'REVIEW') {
            return 'Reviewing'
        } else if (verification === 'ACCEPTED') {
            return 'Accepted'
        } else if (verification === 'REJECTED') {
            return 'Rejected'
        }
    }

    return <div 
    onClick={() => navigate(`/appointments/${appointment._id}`)} 
    className="doctor-review-container hoverable"
    >
        <div className="doctor-review-info">
            <span className="doctor-review-date-container bold-text">{format(new Date(appointment.startTime), 'eee, MMM dd yyyy')}</span>
            <span>
                {user.type === 'EXPERT' ? appointment?.seeker?.firstName : appointment?.expert?.firstName}
            </span>
            { 
                appointment.verification ?
                <span className="flex-space-between-center bold-text">
                    {renderAppointmentVerification(appointment.verification)}
                </span>
                : 
                null 
            }
            <span>{format(new Date(appointment.startTime), 'hh:mm a')} - {format(new Date(appointment.endTime), 'hh:mm a')}</span>
        </div>
        <div className="doctor-review-status-container">
            {
                appointment.status === 'CANCELLED' ?
                <span className="status-btn declined bold-text">Cancelled</span>
                :
                renderAppointmentStatus(appointment.startTime)   
            }
            <br />
            <span className="doctor-review-status-number flex-end">#{formatNumber(appointment?.appointmentId)}</span>
        </div>
    </div>
}

export default AppointmentCard