import { useState, useEffect } from 'react'
import './expert.css'
import Star from '../../components/stars/star'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar'
import { useNavigate } from 'react-router-dom'
import { serverRequest } from '../../components/API/request'
import { integrateTimeToDate, getTimeRange, WEEK_DAYS, mergeDateAndTime } from '../../utils/time'
import dayjs from 'dayjs'
import Loading from '../../components/loading/loading'
import { useSelector } from 'react-redux'
import { toast } from 'react-hot-toast'
import CardImage from '../../components/images/image'
import { formatNumber } from '../../utils/numbers'
import ServiceCard from '../../components/cards/service'
import TranslateOutlinedIcon from '@mui/icons-material/TranslateOutlined'
import PublicOutlinedIcon from '@mui/icons-material/PublicOutlined'
import EventAvailableOutlinedIcon from '@mui/icons-material/EventAvailableOutlined'
import { formatDistance  } from 'date-fns'
import MaleIcon from '@mui/icons-material/Male'
import FemaleIcon from '@mui/icons-material/Female'
import { capitalizeFirstLetter } from '../../utils/formatString'
import EmptySection from '../../components/sections/empty-section'


const ExpertBookingPage = () => {

    const navigate = useNavigate()

    const pagePath = window.location.pathname
    const expertId = pagePath.split('/')[2]

    const user = useSelector(state => state.user.user)

    const [weekday, setWeekday] = useState(WEEK_DAYS[new Date().getDay()])
    const [duration, setDuration] = useState()
    const [price, setPrice] = useState()

    const [reload] = useState(1)

    const [services, setServices] = useState([])

    const [isProfileLoading, setIsProfileLoading] = useState(true)
    const [isServicesLoading, setIsServicesLoading] = useState(true)
    const [isTimesLoading, setIsTimesLoading] = useState(false)
    const [isBookingLoading, setIsBookingLoading] = useState(false)

    const [bookingDate, setBookingDate] = useState(new Date())
    const [bookingTime, setBookingTime] = useState()
    const [expert, setExpert] = useState({})
    const [openingTimes, setOpeningTimes] = useState([])
    const [service, setService] = useState()

    useEffect(() => {
        scroll(0, 0)
        document.title = `${expert.firstName}-Booking`
    }, [expert])

    useEffect(() => {
        serverRequest.get(`/v1/users/${expertId}/experts`)
        .then(response => {
            setIsProfileLoading(false)
            setExpert(response.data.user)
        })
        .catch(error => {
            setIsProfileLoading(false)
            console.error(error)
        })
    }, [])

    useEffect(() => {
        setIsServicesLoading(true)
        serverRequest.get(`/v1/services/experts/${expertId}?status=ACTIVE`)
        .then(response => {
            setIsServicesLoading(false)
            setServices(response.data.services)
        })
        .catch(error => {
            setIsServicesLoading(false)
            console.error(error)
        })
    }, [reload])


    useEffect(() => {
        if(!service) {
            return
        }
        setIsTimesLoading(true)
        serverRequest.get(`/v1/opening-times/experts/${expertId}/week-days/${weekday}`)
        .then(response => {
            setIsTimesLoading(false)
            const openingTimeList = response.data.openingTime
            if(openingTimeList.length === 0) {
                return setOpeningTimes([])
            }

            const openingTime = openingTimeList[0]
            const startDate = integrateTimeToDate(openingTime.openingTime.hour, openingTime.openingTime.minute)
            const endDate = integrateTimeToDate(openingTime.closingTime.hour, openingTime.closingTime.minute)

            const timeRanges = getTimeRange(startDate, endDate, duration)

            setOpeningTimes(timeRanges)
        })
        .catch(error => {
            setIsTimesLoading(false)
            console.error(error)
        })
    }, [weekday, service])

    const selectService = (service) => {
        setBookingTime()
        setService(service)
        setDuration(service.duration)
        setPrice(service.price)
    }
    
    const bookAppointment = () => {

        if(!user.isLogged) {
            navigate('/auth/login?back=true')
            return
        }

        if(!service) {
            return toast.error('Please select a service', { duration: 3000, position: 'top-right' })
        }

        if(!bookingDate) {
            return toast.error('Please select a date', { duration: 3000, position: 'top-right' })
        }

        if(!bookingTime) {
            return toast.error('Please select a time slot', { duration: 3000, position: 'top-right' })
        }

        const startTime = mergeDateAndTime(bookingDate, bookingTime)

        const appointmentData = {
            expertId,
            serviceId: service._id,
            seekerId: user._id,
            status: 'UPCOMING',
            startTime,
            price: Number.parseFloat(price),
            duration: Number.parseInt(duration)
        }

        setIsBookingLoading(true)
        serverRequest.post('/v1/appointments', appointmentData)
        .then(response => {
            setIsBookingLoading(false)
            navigate(`/appointments/${response.data.appointment._id}/checkout`)
        })
        .catch(error => {
            setIsBookingLoading(false)
            console.error(error)
            toast.error(error?.response?.data?.message, { duration: 3000, position: 'top-right' })
        })

    }

    return <div>
        {
            isProfileLoading ?
            <div className="page-loading-container">
                <Loading width="50" height="50" />
            </div>
            :
            <div className="doctor-page-container">
                <div>
                    <div className="styled-container">
                    <div className="doctor-info-container">
                        <div className="doctor-image-container">
                            <CardImage 
                            name={expert?.firstName} 
                            imageURL={expert?.profileImageURL}
                            />
                        </div>
                        <div className="doctor-details-container margin-left-1">
                            <div>
                                <strong>{expert?.firstName}</strong>
                                <span className="bold-text main-color-text">{expert?.title}</span>
                            </div>
                            <div className="ratings-start-container flex-space-between">
                                <div className="ratings-stars-container">
                                    {[1, 2, 3, 4, 5].map((rate, index) => {
                                    return <Star key={index} isBright={expert?.rating >= (index+1) ? true : false} />
                                    })}
                                    <span>({expert?.rating.toFixed(2)})</span>
                                </div>
                                <span className="small-font fadded-black-color">{expert?.rating.toFixed(2)} ({formatNumber(expert?.totalReviews)} Reviews)</span>
                            </div>
                            {/*<div className="tags-container">
                                {expert?.speciality?.map((special, index) => <span key={index} className="status-btn done">{special?.name}</span>)}
                            </div>*/}
                        </div>
                    </div>
                    <div> 
                        <div className="tags-container">
                            {
                                expert?.languages?.map(language => <span key={language.code} className="status-btn pending flex-center bold-text icon-tag">
                                    <TranslateOutlinedIcon />
                                    {language.name}
                                </span>)
                            }    
                        </div>
                        <div className="tags-container">
                            <span className="status-btn pending flex-center bold-text icon-tag">
                                <PublicOutlinedIcon />
                                {expert.nationality ? expert.nationality : 'Egypt'}
                            </span>
                            {
                                expert.gender === 'MALE' ?
                                <span className="status-btn pending flex-center bold-text icon-tag">
                                    <MaleIcon />
                                    {capitalizeFirstLetter(expert?.gender)}
                                </span>
                                :
                                <span className="status-btn pending flex-center bold-text icon-tag">
                                    <FemaleIcon />
                                    {capitalizeFirstLetter(expert?.gender)}
                                </span>
                            }
                        </div>
                        <div className="tags-container">
                            <span className="status-btn pending flex-center bold-text icon-tag">
                                <EventAvailableOutlinedIcon />
                                Joining Date: {formatDistance(new Date(expert.createdAt), new Date(), { addSuffix: true })}
                            </span>
                        </div>
                    </div>
                    <div className="doctor-appointment-buttons-container">
                        <div></div>
                        {
                            isBookingLoading ?
                            <div className="flex-center">
                                <Loading />
                            </div>
                            :
                            <div>
                                <button 
                                onClick={() => bookAppointment()} 
                                className="normal-button main-color-bg white-text bold-text">
                                    {service ? `Confirm!` : 'Book Session'}
                                </button>
                            </div>
                        }
                    </div>
                            
                    </div>
                    <div className="margin-top-1">
                        {
                            isServicesLoading ?
                            <div className="styled-container flex-center">
                                <Loading />
                            </div>
                            :
                            services.length === 0 ?
                            <div className="styled-container">
                                <EmptySection text={'There is no service registered with the expert yet :('} />
                            </div>
                            :
                            
                            services.map(tempService => <div className="margin-bottom-1" key={tempService._id}>
                                <ServiceCard
                                service={tempService}
                                buttonText={tempService._id === service?._id ? 'Selected!' : 'Select'}
                                buttonAction={selectService}
                                />
                            </div>)
                        }
                    </div>
                </div>
                <div>
                <div className="doctor-date-container styled-container">
                    <div className="doctor-clinic-locations-container">
                        <h4>Select Date</h4>
                        
                    </div>
                    <div className="calender-container">
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DateCalendar 
                        onChange={value => {
                            setWeekday(WEEK_DAYS[value.$W])
                            setBookingDate(value.$d)
                        }} 
                        defaultValue={dayjs(new Date())} 
                        />
                    </LocalizationProvider>
                    </div>
                    <div className="doctor-available-slots-container">
                        <div className="available-slots-container">
                            <h4 className="align-right">Select Time Slots</h4>
                            <span className="main-color-text bold-text">{openingTimes.length} Available Time Slots</span>
                        </div>
                        {
                            isTimesLoading ?
                            <div className="flex-center">
                                <Loading width="40" height="40" />
                            </div>
                            :
                            <div>
                                {
                                    openingTimes.length === 0 ?
                                    <EmptySection text={'There is no time slots available :('} />
                                    :
                                    <div className="doctor-available-slots">
                                    {
                                        service && bookingDate ?
                                        openingTimes.map((openingTime, index) => <span 
                                        className={bookingTime === openingTime ? 'active-booking-time normal-border-radius center' : 'normal-border-radius center'} 
                                        key={index}
                                        onClick={() => setBookingTime(openingTime)
                                        }
                                        >
                                            {openingTime}
                                        </span>)
                                        :
                                        null
                                    }
                                </div>
                                }
                                
                            </div>
                            
                        }
                    </div>
                </div>
                </div>
            </div>
        }
        <br />
        <br />
    </div>
}

export default ExpertBookingPage