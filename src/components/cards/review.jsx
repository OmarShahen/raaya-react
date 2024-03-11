import { useState } from 'react'
import './cards.css'
import { formatDistance } from 'date-fns'
import { useSelector } from 'react-redux'
import Loading from '../loading/loading'
import { serverRequest } from '../API/request'
import { toast } from 'react-hot-toast'
import { onAnalytics } from '../../../google-analytics/analytics'


const ReviewCard = ({ review, setReload, reload }) => {

    const user = useSelector(state => state.user.user)

    const [isDeleting, setIsDeleting] = useState(false)

    const renderSurveyStatus = (status) => {

        if(status === 1) {
            return <span className="status-btn declined bold-text">Very Poor</span>         
        } else if(status === 4) {
            return <span className="status-btn pending bold-text">Good</span>      
        } else if(status === 2) {
            return <span className="status-btn tag-orange-bg white-text bold-text">Poor</span>      
        } else if(status === 5) {
            return <span className="status-btn done bold-text">Excellent</span>    
        } else if(status === 3) {
            return <span className="status-btn grey-bg bold-text white-text">Neutral</span>
        }
    }

    const deleteReview = () => {
        setIsDeleting(true)
        serverRequest.delete(`/v1/reviews/${review._id}`)
        .then(response => {
            setIsDeleting(false)
            setReload(reload + 1)
            toast.success(response.data.message, { duration: 3000, position: 'top-right' })
            onAnalytics('feedback_deleted', { event_category: 'Feedback', event_label: 'Feedback Deleted' })
        })
        .catch(error => {
            setIsDeleting(false)
            console.error(error)
            toast.error(error?.response?.data?.message, { duration: 3000, position: 'top-right' })
        })
    }

    return <div className="doctor-review-container">
        <div className="doctor-review-info">
            <span>{review?.seeker?.firstName}</span>
            {
                review.note ?
                <span className="italic-font">{`"${review?.note}"`}</span>
                :
                null
            }
            <span className="doctor-review-date-container large-font fadded-black-text">
                {formatDistance(new Date(review.createdAt), new Date(), { addSuffix: true })}
            </span>
        </div>
        <div className="card-right-side-container">
            {renderSurveyStatus(review.rating)}
            {
                user._id === review.seekerId ?
                isDeleting ?
                <div className="center">
                    <Loading />
                </div>
                :
                <button onClick={()=> deleteReview()} className="normal-button red-text">Delete</button>
                :
                null
            }
        </div>
    </div>
}

export default ReviewCard