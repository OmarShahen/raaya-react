import { useState } from 'react'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import './actions.css'

const CardActions = ({ actions }) => {

    const [isShow, setIsShow] = useState(false)

    return <div 
    className="small-description-text actions-container">
        <span
        className="options-icon-container"
        onClick={e => {
            e.stopPropagation()
            setIsShow(!isShow)
        }}>
            <MoreHorizIcon />
        </span>
        {
            isShow ?
            <div className="actions-dropdown-container">
                <ul>
                    {actions.map(action => <li className="width" onClick={action.onAction}>
                        {action.icon}
                        {action.name}
                    </li>)}
                </ul>
            </div>
            :
            null
        }
    </div>
}

export default CardActions