import { useState, useEffect } from 'react'
import { serverRequest } from '../../components/API/request'
import { toast } from 'react-hot-toast'
import Card from '../../components/cards/card'
import NumbersOutlinedIcon from '@mui/icons-material/NumbersOutlined'
import { useSelector } from 'react-redux'
import BarChart from '../../components/charts/bar-chart'
import FiltersSection from '../../components/filters/filters'
import GradeOutlinedIcon from '@mui/icons-material/GradeOutlined'
import RateChart from '../../components/charts/rate-chart'
import { capitalizeFirstLetter } from '../../utils/formatString'


const AnalyticsFeedbackPage = () => {

    const user = useSelector(state => state.user.user)

    const [totalReviews, setTotalReviews] = useState(0)
    const [averageRating, setAverageRating] = useState(0)
    const [reviewsRatings, setReviewsRatings] = useState([])
    const [reviewsCommunication, setReviewsCommunication] = useState([])
    const [reviewsCommitment, setReviewsCommitment] = useState([])
    const [reviewsUnderstanding, setReviewsUnderstanding] = useState([])
    const [reviewsSolutions, setReviewsSolutions] = useState([])
    const [reviewsRecommendation, setReviewsRecommendation] = useState([])

    const [statsQuery, setStatsQuery] = useState()

    useEffect(() => {
        scroll(0, 0)
        document.title = 'Analytics-Feedback'
    }, [])

    useEffect(() => {
        serverRequest.get(`/v1/reviews/experts/${user._id}/stats/detailed`, { params: { ...statsQuery } })
        .then(response => {
            setTotalReviews(response.data.totalReviews)
            setAverageRating(response.data.reviewsAverageRating)
            setReviewsRatings(response.data.reviewsRatings)
            setReviewsCommunication(response.data.reviewsCommunication)
            setReviewsCommitment(response.data.reviewsCommitment)
            setReviewsUnderstanding(response.data.reviewsUnderstanding)
            setReviewsSolutions(response.data.reviewsSolutions)
            response.data.reviewsRecommendation.forEach(stat => {
                if(stat._id === true) {
                    stat._id = 'Yes'
                } else {
                    stat._id = 'No'
                }
            })
            setReviewsRecommendation(response.data.reviewsRecommendation)
        })
        .catch(error => {
            console.error(error)
            toast.error(error?.response?.data?.message, { duration: 3000, position: 'top-right' })
        })
    }, [statsQuery])


    return <div>
        <div className="margin-bottom-1">
            <FiltersSection 
                statsQuery={statsQuery}
                setStatsQuery={setStatsQuery}
                isShowUpcomingDates={false}
                defaultValue={'LIFETIME'}
            />
        </div>
        <div className="cards-3-list-wrapper">
            <Card 
            icon={<NumbersOutlinedIcon />}
            cardHeader={'Reviews'}
            number={totalReviews}
            />
            <Card 
            icon={<GradeOutlinedIcon />}
            cardHeader={'Rating'}
            number={averageRating.toFixed(2)}
            />
        </div>
        <div className="margin-top-1">
            <BarChart 
            title={'Recommendation'}
            data={reviewsRecommendation.map(stat => stat.count)}
            labels={reviewsRecommendation.map(stat => capitalizeFirstLetter(stat._id))}
            total={totalReviews}
            allData={reviewsRecommendation}
            />
        </div>
        <div className="margin-top-1">
            <RateChart 
            title="Ratings"
            ratings={reviewsRatings}
            totalReviews={totalReviews}
            rateNameFunction={(value) => {
                return `${value} Stars`
            }}
            />
        </div>
        <div className="margin-top-1">
            <RateChart 
            title="Communication"
            ratings={reviewsCommunication}
            totalReviews={totalReviews}
            rateNameFunction={(value) => {
                return `${value} Stars`
            }}
            />
        </div>
        <div className="margin-top-1">
            <RateChart 
            title="Commitment"
            ratings={reviewsCommitment}
            totalReviews={totalReviews}
            rateNameFunction={(value) => {
                return `${value} Stars`
            }}
            />
        </div>
        <div className="margin-top-1">
            <RateChart 
            title="Understanding"
            ratings={reviewsUnderstanding}
            totalReviews={totalReviews}
            rateNameFunction={(value) => {
                return `${value} Stars`
            }}
            />
        </div>
        <div className="margin-top-1">
            <RateChart 
            title="Providing Solutions"
            ratings={reviewsSolutions}
            totalReviews={totalReviews}
            rateNameFunction={(value) => {
                return `${value} Stars`
            }}
            />
        </div>
        
    </div>
}

export default AnalyticsFeedbackPage