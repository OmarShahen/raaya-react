import { formatNumber } from '../../utils/numbers'
import { format } from 'date-fns'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { serverRequest } from '../API/request'
import { toast } from 'react-hot-toast'


const AppointmentCard = ({ appointment, setReload, reload }) => {

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

   const updateAppointmentPaymentStatus = (isPaid) => {
        toast.loading('updating...', { duration: 1000, position: 'top-right' })
        serverRequest.patch(`/v1/appointments/${appointment._id}/payment`, { isPaid })
        .then(response => {
            setReload(reload + 1)
            toast.success(response.data.message, { duration: 3000, position: 'top-right' })
        })
        .catch(error => {
            console.error(error)
            toast.error(error?.response?.data?.message, { duration: 3000, position: 'top-right' })
        })
   }

    return <div 
    onClick={() => navigate(`/appointments/${appointment._id}`)} 
    className="doctor-review-container hoverable"
    >
        <div className="doctor-review-info">
            <span className="doctor-review-date-container bold-text">{format(new Date(appointment.startTime), 'eee, MMM dd yyyy')} - #{appointment.appointmentId}</span>
            <span>
                {user.type === 'EXPERT' ? appointment?.seeker?.firstName : appointment?.expert?.firstName} (+{appointment.seeker.countryCode}{appointment.seeker.phone})
            </span>
            <span className="flex-start bold-text">
                {formatNumber(appointment.price/appointment.currencyPrice)} {appointment.currency}
                {
                    appointment.isPaid ?
                    <strong className="status-btn done margin-left-1">Paid</strong>
                    :
                    <strong className="status-btn grey-bg white-text margin-left-1">Unpaid</strong>
                }
            </span> 
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
            {
                !appointment.isPaid ?
                <button 
                onClick={e => {
                    e.stopPropagation()
                    updateAppointmentPaymentStatus(!appointment.isPaid)
                }} 
                className="normal-button main-color-bg white-text bold-text">confirm</button>
                :
                <button 
                onClick={e => {
                    e.stopPropagation()
                    updateAppointmentPaymentStatus(!appointment.isPaid)
                }} 
                className="normal-button red-bg white-text bold-text">cancel</button>
            }
        </div>
    </div>
}

export default AppointmentCard