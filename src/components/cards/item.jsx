import { NavLink } from 'react-router-dom'
import Star from '../stars/star'
import { useNavigate } from 'react-router-dom'
import { textShortener } from '../../utils/formatString'
import { formatNumber } from '../../utils/numbers'
import './cards.css'
import CardImage from '../images/image'

const ItemCard = ({ expert }) => {

    const navigate = useNavigate()

    return <div onClick={() => navigate(`/experts/${expert._id}`)} className="styled-container expert-card-container normal-font hoverable">
        <div className="expert-card-body-container">
            <div className="item-image-expert-info-container">
                <div>
                    <CardImage 
                    name={expert.firstName} 
                    imageURL={expert.profileImageURL} 
                    borderRadius={50}
                    width={'4rem'}
                    height={'4rem'}
                    />
                </div>
                <div>
                    <div>
                        <h6 className="very-large-font">{expert.firstName}</h6>
                        <div>
                            <span className="main-color-text bold-text small-font">{textShortener(expert.title, 40)}</span>
                        </div>
                    </div>
                    <div className="flex-space-between full-width">
                        <span className="expert-card-stars-container">
                        {[1, 2, 3, 4, 5].map((rate, index) => {
                            return <Star key={index} isBright={expert.rating >= (index+1) ? true : false} />
                        })}
                            <span className="small-font fadded-black-text">({expert.rating.toFixed(2)})</span>
                        </span>
                        <span className="small-font fadded-black-text margin-left-auto">{expert.rating.toFixed(2)} ({expert.totalReviews ? expert.totalReviews : 0} Reviews)</span>
                    </div>
                </div>
            </div>
            <div>
                <div className="bold-text small-font">Specialities</div>
                <div className="tags-container">
                    {[...expert?.speciality, ...expert?.subSpeciality].slice(0, 3).map(special => <span key={special._id} className="status-btn done">{special.name}</span>)}
                    {
                        [...expert?.speciality, ...expert?.subSpeciality].length > 3 ?
                        <span className="small-font bold-text main-color-text">+{[...expert?.speciality, ...expert?.subSpeciality].length - 3} more specialities</span>
                        :
                        null
                    }
                </div>
            </div>
            {
                expert.pricing && expert.pricing.length !== 0 ?
                <div className="margin-top-1">
                    <div className="bold-text small-font">Fees</div>
                    <div className="flex-space-between">
                        {expert?.pricing?.map((price, index) => <span key={index} className="fadded-black-text"> 
                            <span className="main-color-text bold-text">{formatNumber(price.price? price.price : 0)} EGP</span> / {price.duration ? price.duration : 0} minutes
                        </span>)}
                    </div>
                </div>
                :
                null
            }
            <button onClick={() => navigate(`/experts/${expert._id}`)} className="normal-button main-color-bg white-text full-width margin-top-1 show-mobile">Book Session</button>
        </div>
        
        <div className="expert-booking-container">
            <div className="expert-book-container">
                 <div className="small-font bold-text">Description</div>
                <div className="fadded-black-text small-font">
                    {textShortener(expert.description, 200)}
                </div>
            </div>
            <div className="expert-card-buttons-container">
                <NavLink to={`/experts/${expert._id}`} className="normal-button action-bg-color white-text">Book Session</NavLink>
            </div>
        </div>
    </div>
}

export default ItemCard