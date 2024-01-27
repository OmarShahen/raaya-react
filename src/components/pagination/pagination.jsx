import './pagination.css'
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft'
import ArrowRightIcon from '@mui/icons-material/ArrowRight'


const Pagination = ({ totalPages, limit=1 }) => {

    return <div className="pagination-container">
        <span className="pagination-arrow"><ArrowLeftIcon /></span>
        {
            totalPages / limit 
        }
        <span className="pagination-arrow">1</span>
        <span>2</span>
        <span>3</span>
        <span>4</span>
        <span>5</span>
        <span>6</span>
        <span className="pagination-arrow"><ArrowRightIcon /></span>
    </div>
}

export default Pagination