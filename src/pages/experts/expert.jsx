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
import ReviewCard from '../../components/cards/review'
import AddIcon from '@mui/icons-material/Add'
import ReviewFormModal from '../../components/modals/review-modal'
import { formatNumber } from '../../utils/numbers'

const ExpertPage = () => {

    const navigate = useNavigate()

    const pagePath = window.location.pathname
    const expertId = pagePath.split('/')[2]

    const user = useSelector(state => state.user.user)

    const [weekday, setWeekday] = useState(WEEK_DAYS[new Date().getDay()])
    const [duration, setDuration] = useState(30)

    const [reload, setReload] = useState(1)
    const [isShowReviewModal, setIsShowReviewModal] = useState(false)

    const [isProfileLoading, setIsProfileLoading] = useState(true)
    const [isReviewLoading, setIsReviewLoading] = useState(true)
    const [isTimesLoading, setIsTimesLoading] = useState(true)
    const [isBookingLoading, setIsBookingLoading] = useState(false)

    const [bookingDate, setBookingDate] = useState(new Date())
    const [bookingTime, setBookingTime] = useState()
    const [expert, setExpert] = useState({})
    const [reviews, setReviews] = useState([])
    const [openingTimes, setOpeningTimes] = useState([])

    useEffect(() => {
        scroll(0, 0)
    }, [])

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
        setIsReviewLoading(true)
        serverRequest.get(`/v1/reviews/experts/${expertId}`)
        .then(response => {
            setIsReviewLoading(false)
            setReviews(response.data.reviews)
        })
        .catch(error => {
            setIsReviewLoading(false)
            console.error(error)
        })
    }, [reload])


    useEffect(() => {
        setBookingTime()
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
    }, [weekday, duration])

    
    const bookAppointment = () => {

        if(!user.isLogged) {
            navigate('/auth/login?back=true')
            return
        }


        const startTime = mergeDateAndTime(bookingDate, bookingTime)

        const pricingList = expert.pricing.filter(price => price.duration === duration)

        const appointmentData = {
            expertId,
            seekerId: user._id,
            status: 'UPCOMING',
            startTime,
            price: pricingList[0].price,
            duration: pricingList[0].duration
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
            isShowReviewModal ?
            <ReviewFormModal 
            expert={expert}
            setReload={setReload}
            reload={reload}
            setShowFormModal={setIsShowReviewModal}
            />
            :
            null
        }
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
                                <span>{expert?.title}</span>
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
                        </div>
                    </div>
                        <div className="tags-container">
                                {expert?.speciality?.map((special, index) => <span key={index} className="status-btn done">{special?.name}</span>)}
                            </div>
                            <div className="flex-space-between margin-top-1 expert-price-container">
                                    {
                                        expert?.pricing?.map((price, index) => <span key={index} className="fadded-black-text">
                                            <span className="action-color-text bold-text">{price?.price} EGP</span> / {price?.duration} minutes
                                            </span>)
                                    }
                            </div>
                            {
                                bookingTime ?
                                <div className="doctor-appointment-buttons-container">
                                    <div>
                                        <button onClick={() => setBookingTime()} className="normal-button">Cancel</button>
                                    </div>
                                    {
                                        isBookingLoading ?
                                        <div className="flex-center">
                                            <Loading />
                                        </div>
                                        :
                                        <div>
                                            <button onClick={() => bookAppointment()} className="normal-button main-color-bg white-text">Book Session</button>
                                        </div>
                                    }
                                </div>
                                :
                                null
                            }
                    </div>
                    <div className="styled-container margin-top-1">
                        <h4 className="remove-spacing">Specialities</h4>
                        <div className="tags-container margin-top-1">
                            {expert?.speciality?.map((special, index) => <span key={index} className="status-btn done">{special.name}</span>)}
                            {expert?.subSpeciality?.map((special, index) => <span key={index} className="status-btn done">{special?.name}</span>)}
                        </div>
                    </div>
                    <div className="styled-container margin-top-1">
                        <h4 className="remove-spacing">Description</h4>
                        <div className="margin-top-1 paragraph-color small-font">
                            {expert?.description}
                        </div>
                    </div>
                    <div className="styled-container margin-top-1">
                        <div className="flex-space-between">
                            <h4 className="remove-spacing">Reviews</h4>
                            {
                                user.isLogged ?
                                <button 
                                onClick={() => setIsShowReviewModal(true)}
                                className="normal-button main-color-bg white-text flex-space-between-center">
                                    <AddIcon />
                                    <span>Add Review</span>
                                </button>
                                :
                                null
                            }
                        </div>
                        <div className="margin-top-1 paragraph-color small-font">
                            
                            {   
                                !isReviewLoading ?
                                reviews.map(review => <ReviewCard 
                                setReload={setReload} 
                                reload={reload} 
                                key={review._id} 
                                review={review} 
                                />)
                                :
                                <div className="center">
                                    <Loading />
                                </div>
                            }
                        </div>
                    </div>
                </div>
                <div>
                <div className="doctor-date-container styled-container">
                    <div className="doctor-clinic-locations-container">
                        <h4>Select Session Duration</h4>
                        <div className="flex-space-around margin-top-1">
                            <button 
                            className={duration === 30 ? "normal-button main-color-bg white-text" : "normal-button main-color-text main-color-border" }
                            onClick={() => setDuration(30) }
                            >30 Min Duration</button>
                            <button 
                            className={duration === 60 ? "normal-button main-color-bg white-text" : "normal-button main-color-text main-color-border" }
                            onClick={() => setDuration(60) }
                            >60 Min Duration</button>
                        </div>
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
                            <span className="main-color-text">{openingTimes.length} Available Time Slots</span>
                        </div>
                        {
                            isTimesLoading ?
                            <div className="flex-center">
                                <Loading width="40" height="40" />
                            </div>
                            :
                            <div className="doctor-available-slots">
                                {openingTimes.map((openingTime, index) => <span 
                                className={bookingTime === openingTime ? 'active-booking-time normal-border-radius center' : 'normal-border-radius center'} 
                                key={index}
                                onClick={() => setBookingTime(openingTime)}
                                >
                                    {openingTime}
                                </span>)}
                            </div>
                        }
                    </div>
                </div>
                </div>
                {
                    bookingTime ?
                    <div className="show-mobile loading-center">
                        <button 
                        onClick={() => bookAppointment()} 
                        className="normal-button main-color-bg white-text full-width center">
                            {
                                isBookingLoading ?
                                <Loading color={'white'} />
                                :
                                'Book Session'
                            }                            
                        </button>
                    </div>
                    :
                    null
                }
            </div>
        }
        <br />
        <br />
    </div>
}

export default ExpertPage