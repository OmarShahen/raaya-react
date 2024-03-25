import { useState, useEffect } from 'react'
import './appointments.css'
import { serverRequest } from '../../components/API/request'
import { format } from 'date-fns'
import Loading from '../../components/loading/loading'
import { toast } from 'react-hot-toast'
import { formatNumber } from '../../utils/numbers'
import { getMinutesBetweenDates } from '../../utils/time'
import DeleteConfirmationModal from '../../components/modals/confirmation/delete-confirmation'
import { useSelector } from 'react-redux'
import { textShortener } from '../../utils/formatString'
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined'
import MeetingLinkFormModal from '../../components/modals/meeting-link-form'
import { onAnalytics } from '../../../google-analytics/analytics'


const AppointmentPage = () => {

    const pagePath = window.location.pathname
    const appointmentId = pagePath.split('/')[2]

    const user = useSelector(state => state.user.user)

    const [isShowDeleteModal, setIsShowDeleteModal] = useState(false)
    const [isDeleteLoading, setIsDeleteLoading] = useState(false)

    const [appointment, setAppointment] = useState({})
    const [isLoading, setIsLoading] = useState(true)
    const [isShowMeetingForm, setIsShowMeetingForm] = useState(false)
    const [reload, setReload] = useState(1)

    useEffect(() => {
        //scroll(0, 0)
        document.title = 'Appointment Details'
    }, [])


    useEffect(() => {
        serverRequest.get(`/v1/appointments/${appointmentId}`)
        .then(response => {
            setIsLoading(false)
            setAppointment(response.data.appointment)
        })
        .catch(error => {
            setIsLoading(false)
            console.error(error)
        })
    }, [reload])

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

    const cancelAppointment = () => {
        setIsDeleteLoading(true)
        serverRequest.post(`/v1/payments/refund/appointments/${appointmentId}`)
        .then(response => {
            setIsDeleteLoading(false)
            setIsShowDeleteModal(false)
            toast.success(response.data.message, { duration: 3000, position: 'top-right' })
            setReload(reload + 1)
            onAnalytics('appointment_cancelled', { event_category: 'Appointment', event_label: 'Appointment Cancelled' })
        })
        .catch(error => {
            setIsDeleteLoading(false)
            console.error(error)
            toast.error(error?.response?.data?.message, { duration: 3000, position: 'top-right' })
        })
    }

    const cancelFreeAppointment = () => {
        setIsDeleteLoading(true)
        serverRequest.patch(`/v1/appointments/${appointmentId}/status/cancellation/free`)
        .then(response => {
            setIsDeleteLoading(false)
            setIsShowDeleteModal(false)
            toast.success(response.data.message, { duration: 3000, position: 'top-right' })
            setReload(reload + 1)
            onAnalytics('appointment_cancelled', { event_category: 'Appointment', event_label: 'Appointment Cancelled' })
        })
        .catch(error => {
            setIsDeleteLoading(false)
            console.error(error)
            toast.error(error?.response?.data?.message, { duration: 3000, position: 'top-right' })
        })
    }

    return <div>
        {
            isShowMeetingForm ?
            <MeetingLinkFormModal 
            setShowFormModal={setIsShowMeetingForm}
            reload={reload}
            setReload={setReload}
            appointment={appointment}
            />
            :
            null
        }
        {
            isShowDeleteModal ?
            <DeleteConfirmationModal
            isShowModal={isShowDeleteModal}
            setIsShowModal={setIsShowDeleteModal}
            isLoading={isDeleteLoading}
            deleteFunction={appointment.price === 0 ? cancelFreeAppointment : cancelAppointment}
            />
            :
            null
        }
        
        {
            isLoading ?
            <div className="page-loading-container">
                <Loading width="50" height="50" />
            </div>
            :
            <div className="appointment-page-container">
                <div className="styled-container">
                    <div className="appointment-header-container">
                        <h2>Appointment Details</h2>
                    </div>  
                    <div>
                        <div className="appointment-body-container">
                        <ul>
                            <li>
                                <strong>Appointment ID</strong>
                                <span>#{appointment?.appointmentId}</span>
                            </li>
                            <li>
                                <strong>Expert</strong>
                                <span>{appointment?.expert?.firstName}</span>
                            </li>
                            <li>
                                <strong>User</strong>
                                <span>{appointment?.seeker?.firstName}</span>
                            </li>
                            {
                                appointment?.service ?
                                <li>
                                    <strong>Service</strong>
                                    <span>{appointment?.service?.title}</span>
                                </li>
                                :
                                null
                            }
                            <li>
                                <strong>Price</strong>
                                <span>{formatNumber(appointment.price ? appointment.price/appointment.currencyPrice : 0)} {appointment.currency}</span>
                            </li>
                            <li>
                                <strong>Payment</strong>
                                {
                                    appointment.isPaid ?
                                    <span className="status-btn done bold-text">Paid</span>
                                    :
                                    <span className="status-btn pending bold-text">Pending</span>
                                }
                            </li>
                            <li>
                                <strong>Start</strong>
                                <span>{appointment?.startTime ? format(new Date(appointment?.startTime), 'dd/MM/yyyy hh:mm a') : 'Not Registered'}</span>
                            </li>
                            <li>
                                <strong>End</strong>
                                <span>{appointment?.endTime ? format(new Date(appointment?.endTime), 'dd/MM/yyyy hh:mm a') : 'Not Registered'}</span>
                            </li>
                            {
                                appointment?.startTime && appointment?.endTime ?
                                <li>
                                    <strong>Duration</strong>
                                    <span>{getMinutesBetweenDates(new Date(appointment?.startTime), new Date(appointment?.endTime))} minutes</span>
                                </li>
                                :
                                null
                            }
                            <li>
                                <strong>Status</strong>
                                { 
                                    appointment.status === 'CANCELLED' ? 
                                    <span className="status-btn declined bold-text">Cancelled</span>
                                    :  
                                    renderAppointmentStatus(appointment.startTime)
                                }
                            </li>
                            {
                                user.type === 'EXPERT' ?
                                <li>
                                    <strong className="flex-center">
                                        Meeting Link
                                        <span onClick={() => setIsShowMeetingForm(true)} style={{ marginLeft: '.5rem' }} className="hoverable">
                                            <CreateOutlinedIcon />
                                        </span>
                                    </strong>
                                    <span>{appointment.meetingLink ? textShortener(appointment.meetingLink, 20) : 'No meeting link yet'}</span>
                                </li>
                                :
                                null
                            }
                            
                        </ul>
                        </div>
                    </div>
                    <div className="margin-top-1 flex-end">
                        {
                            appointment?.status === 'CANCELLED' || new Date() > new Date(appointment.startTime) || !appointment.isPaid ?
                            null
                            :
                            <button 
                            className="normal-button red-text bold-text"
                            onClick={() => setIsShowDeleteModal(true)}
                            >Cancel</button>
                        }
                        {
                            appointment?.status === 'CANCELLED' || new Date() > new Date(appointment.endTime) || !appointment.isPaid ?
                            null
                            :
                            <a 
                            disabled={appointment.meetingLink ? false : true}
                            href={appointment.meetingLink}
                            onClick={() => onAnalytics('video_call_started', { event_category: 'Interaction', event_label: 'Video Call Started' })}
                            target="_blank"
                            rel="noreferrer"
                            className="normal-button main-color-bg white-text flex-space-between-center">
                                {appointment.meetingLink ? 'Start Meeting' : 'No Meeting Link Yet!'}
                            </a>
                        }
                    </div>
                </div>
            </div>
        }
        <br />
    </div>
}

export default AppointmentPage