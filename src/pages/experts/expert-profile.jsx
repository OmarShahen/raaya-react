import { useState, useEffect } from 'react'
import './expert.css'
import Star from '../../components/stars/star'
import { useNavigate } from 'react-router-dom'
import { serverRequest } from '../../components/API/request'
import Loading from '../../components/loading/loading'
import { useSelector } from 'react-redux'
import { toast } from 'react-hot-toast'
import CardImage from '../../components/images/image'
import ReviewCard from '../../components/cards/review'
import AddIcon from '@mui/icons-material/Add'
import ReviewFormModal from '../../components/modals/review-modal'
import { formatNumber } from '../../utils/numbers'
import TranslateOutlinedIcon from '@mui/icons-material/TranslateOutlined'
import PublicOutlinedIcon from '@mui/icons-material/PublicOutlined'
import EventAvailableOutlinedIcon from '@mui/icons-material/EventAvailableOutlined'
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined'
import { formatDistance  } from 'date-fns'
import MaleIcon from '@mui/icons-material/Male'
import FemaleIcon from '@mui/icons-material/Female'
import { capitalizeFirstLetter } from '../../utils/formatString'
import ExpertOnlineBanner from '../../components/sections/banners/expert-online-banner'
import { onAnalytics } from '../../../google-analytics/analytics'


const ExpertPage = () => {

    const navigate = useNavigate()

    const pagePath = window.location.pathname
    const expertId = pagePath.split('/')[2]

    const user = useSelector(state => state.user.user)

    const [reload, setReload] = useState(1)
    const [isShowReviewModal, setIsShowReviewModal] = useState(false)

    const [isProfileLoading, setIsProfileLoading] = useState(true)
    const [isReviewLoading, setIsReviewLoading] = useState(true)

    const [reviewsStats, setReviewsStats] = useState({})

    const [expert, setExpert] = useState({})
    const [reviews, setReviews] = useState([])

    useEffect(() => {
        scroll(0, 0)
        document.title = `${expert.firstName}-Profile`
    }, [expert])

    useEffect(() => {
        serverRequest.get(`/v1/users/${expertId}/experts`)
        .then(response => {
            setIsProfileLoading(false)
            setExpert(response.data.user)
            onAnalytics('expert_profile_viewed', { event_category: 'Interaction', event_label: 'Expert Profile Viewed' })
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
        serverRequest.get(`/v1/reviews/experts/${expertId}/stats`)
        .then(response => {
            setReviewsStats(response.data)
        })
        .catch(error => {
            console.error(error)
        })
    }, [reload])

    

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
            <div>
                {
                    expert.isOnline ?
                    <div>
                        <br />
                        <ExpertOnlineBanner redirectURL={`/experts/${expertId}/booking?isOnlineBooking=TRUE`} />
                    </div>
                    :
                    null
                }
                <div className="doctor-page-container">
                    <div>
                        <div className="styled-container">
                        <div className="doctor-info-container">
                            <div className="doctor-image-container">
                                <CardImage 
                                name={expert?.firstName} 
                                imageURL={expert?.profileImageURL}
                                isOnline={expert.isOnline}
                                />
                            </div>
                            <div className="doctor-details-container margin-left-1">
                                <div>
                                    <strong>{expert?.firstName}</strong>
                                    <span className="main-color-text bold-text">{expert?.title}</span>
                                </div>
                                <div className="ratings-start-container flex-space-between">
                                <div className="ratings-stars-container">
                                    {[1, 2, 3, 4, 5].map((rate, index) => {
                                    return <Star key={index} isBright={expert?.rating >= (index+1) ? true : false} />
                                    })}
                                    <span>({expert?.rating.toFixed(1)})</span>
                                </div>
                                <span className="small-font fadded-black-color">{expert?.rating.toFixed(1)} ({formatNumber(expert?.totalReviews)} Reviews)</span>
                            </div>
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
                                    {expert.nationality ? capitalizeFirstLetter(expert.nationality) : 'Egypt'}
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
                            <button 
                            className="normal-button main-color-text main-color-border bold-text flex-center icon-tag"
                            onClick={() => {
                                navigator.clipboard.writeText(`https://${window.location.hostname}/experts/${expertId}`)
                                .then(() => toast.success('Copied to clipboard', { duration: 3000, position: 'top-right' }))
                                .catch(error => {
                                    toast.error(error.message)
                                })
                            }}
                            >
                                <ContentCopyOutlinedIcon style={{ fontWeight: 'bold' }}/>
                                Copy Profile Link
                            </button>
                            <button onClick={() => navigate(`/experts/${expertId}/booking`)} className="normal-button main-color-bg white-text bold-text">
                                Book Session
                            </button>
                        </div>

                        </div>
                        <div className="styled-container margin-top-1">
                            <h4 className="remove-spacing">Description</h4>
                            <div className="margin-top-1 paragraph-color small-font expert-description-container">
                                <div dangerouslySetInnerHTML={{ __html: expert?.description }}></div>
                            </div>
                        </div>
                        
                    </div>
                    <div>
                        <div className="styled-container">
                            <h4 className="remove-spacing">Specialities</h4>
                            <div className="tags-container margin-top-1">
                                {expert?.speciality?.map((special, index) => <span key={index} className="status-btn done bold-text">{special.name}</span>)}
                                {expert?.subSpeciality?.map((special, index) => <span key={index} className="status-btn done bold-text">{special?.name}</span>)}
                            </div>
                        </div>
                        <div className="styled-container margin-top-1">
                        <h4 className="remove-spacing">Ratings</h4>
                        <div className="ratings-start-container flex-space-between margin-top-1">
                            <div className="ratings-stars-container">
                                {[1, 2, 3, 4, 5].map((rate, index) => {
                                return <Star key={index} isBright={expert?.rating >= (index+1) ? true : false} />
                                })}
                                <span>({expert?.rating.toFixed(1)})</span>
                            </div>
                            <span className="small-font fadded-black-color">{expert?.rating.toFixed(1)} ({formatNumber(expert?.totalReviews)} Reviews)</span>
                        </div>
                            <div className="margin-top-1">
                                <span className="bold-text fadded-black-text">Communication</span>
                                <div className="expert-progress-rating-container">
                                    <progress className="full-width main-color-bg" max="5" value={reviewsStats.reviewsCommunication} />
                                    <span>{reviewsStats?.reviewsCommunication?.toFixed(1)}</span>
                                </div>
                            </div>
                            <span className="bold-text fadded-black-text">Understanding of the situation</span>
                            <div className="expert-progress-rating-container">
                                <progress className="full-width main-color-bg" max="5" value={reviewsStats.reviewsUnderstanding} />
                                <span>{reviewsStats?.reviewsUnderstanding?.toFixed(1)}</span>
                            </div>
                            <span className="bold-text fadded-black-text">Providing effective solutions</span>
                            <div className="expert-progress-rating-container">
                                <progress className="full-width main-color-bg" max="5" value={reviewsStats.reviewsSolutions} />
                                <span>{reviewsStats?.reviewsSolutions?.toFixed(1)}</span>
                            </div>
                            <span className="bold-text fadded-black-text">Commitment to start and end times</span>
                            <div className="expert-progress-rating-container">
                                <progress className="full-width main-color-bg" max="5" value={reviewsStats.reviewsCommitment} />
                                <span>{reviewsStats?.reviewsCommitment?.toFixed(1)}</span>
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
                    
                </div>
            </div>
        }
        <br />
        <br />
    </div>
}

export default ExpertPage