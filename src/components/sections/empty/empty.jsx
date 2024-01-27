import './empty.css'
import AddIcon from '@mui/icons-material/Add'
import InboxOutlinedIcon from '@mui/icons-material/InboxOutlined'
import { useNavigate } from 'react-router-dom'


const EmptySection = ({ setIsShowForm, url, btnText='Add New' }) => {

    const navigate = useNavigate()

    return <div className="empty-section-container">
        <div className="empty-section-body-container">
            <div className="empty-section-icon-container">
                <InboxOutlinedIcon />
            </div>
            <span>{'Oops! No results found'}</span>
        </div>
        {
            !url && !setIsShowForm ?
            null
            :
            <button 
            className="normal-button white-text main-color-bg flex-space-between-center"
            onClick={() => url ? navigate(url) : setIsShowForm(true)}
            >
                <AddIcon />
                {btnText}
            </button>
        }
    </div>
}

export default EmptySection