import { NavLink } from 'react-router-dom'
import Star from '../stars/star'
import { useNavigate } from 'react-router-dom'
import { textShortener } from '../../utils/formatString'
import { formatNumber } from '../../utils/numbers'
import './cards.css'
import CardImage from '../images/image'

const ItemCard = ({ expert }) => {

    const navigate = useNavigate()

    const stripHTMLTags = (htmlString) => {
        return htmlString.replace(/<[^>]*>/g, '');
    }

    return <div className="styled-container expert-card-container normal-font">
        <div className="expert-card-body-container">
            <div className="item-image-expert-info-container">
                <div>
                    <CardImage 
                    name={expert.firstName} 
                    imageURL={expert.profileImageURL}
                    isOnline={expert.isOnline}
                    borderRadius={50}
                    width={'4.5rem'}
                    height={'4.5rem'}
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
                <div className="tags-container">
                    {[...expert?.speciality, ...expert?.subSpeciality].slice(0, 3).map(special => <span key={special._id} className="status-btn done bold-text">{special.name}</span>)}
                    {
                        [...expert?.speciality, ...expert?.subSpeciality].length > 3 ?
                        <span className="small-font bold-text main-color-text">+{[...expert?.speciality, ...expert?.subSpeciality].length - 3} more specialities</span>
                        :
                        null
                    }
                </div>
            </div>
            <div className="cards-2-list-wrapper-no-responsive">
                <button 
                onClick={() => navigate(`/experts/${expert._id}`)} 
                className="normal-button main-color-bg white-text full-width margin-top-1 bold-text">
                    View Profile
                </button>
                <button 
                onClick={() => navigate(`/experts/${expert._id}/booking`)} 
                className="normal-button main-color-text main-color-border full-width margin-top-1 bold-text">
                    Book Session
                </button>
            </div>
        </div>
    
        <div className="expert-booking-container">
            <div className="expert-book-container">
                <div className="small-font bold-text">Description</div>
                <div className="fadded-black-text small-font">
                    {textShortener(stripHTMLTags(expert.description), 200)}
                </div>
            </div>
            
        </div>
    </div>
}

export default ItemCard