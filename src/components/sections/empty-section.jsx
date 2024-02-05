import './empty.css'
import InboxOutlinedIcon from '@mui/icons-material/InboxOutlined'


const EmptySection = ({ text="Oops! No results found" }) => {

    return <div className="empty-section-container">
        <div className="empty-section-body-container">
            <div className="empty-section-icon-container">
                <InboxOutlinedIcon />
            </div>
            <span>{text}</span>
        </div>
    </div>
}

export default EmptySection