import './cards.css'
import nurseImage from '../../assets/nurse-image.jpg'


const DoctorCard = () => {

    return <div className="doctor-card-container">
        <div className="doctor-card-header-container">
            <div className="doctor-card-header-image-container">
                <img src={nurseImage} />
            </div>
            <div className="doctor-card-description-container">
                <h6>دكتور عمر رضا</h6>
                <span className="description-container">استشاري كل حاجة في كل كليات  حاجة في كل كلياتحاجة في كل كلياتحاجة في كل كلياتحاجة في كل كلياتمصر</span>
            </div>
        </div>
    </div>
}

export default DoctorCard