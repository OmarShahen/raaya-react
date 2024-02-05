import ArrowCircleRightOutlinedIcon from '@mui/icons-material/ArrowCircleRightOutlined'
import { formatNumber } from '../../utils/numbers'
import AccessAlarmOutlinedIcon from '@mui/icons-material/AccessAlarmOutlined'
import PaidOutlinedIcon from '@mui/icons-material/PaidOutlined'
import CardTransition from '../transitions/card-transitions'
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined'

const ServiceCard = ({ 
    service, 
    isShowStatus=true, 
    isShowButton=true, 
    isShowDelete, 
    buttonText="", 
    buttonAction,
    deleteAction,
    isUpdate,
    updateAction
}) => {

    return <CardTransition>
        <div className="service-card-container styled-container">
        <div className="service-card-header-container flex-space-between">
            <div className="service-format-container">
                <span>
                    1:1 Call
                </span>
            </div>
            <div>
                {
                    isShowStatus ?
                    service.isActive ?
                    <span className="status-btn done bold-text">
                        Active
                    </span>
                    :
                    <span className="status-btn declined bold-text">
                        Disabled
                    </span>
                    :
                    <span className="fadded-black-text">
                        <ArrowCircleRightOutlinedIcon />
                    </span>
                }
                
            </div>
        </div>
        <div className="margin-top-1 flex-space-between-center">
            <h5 className="no-space large-font">
                {service.title}
            </h5>
            {
                isUpdate ?
                <span onClick={() => updateAction(service)} className="edite-icon-container hoverable">
                    <CreateOutlinedIcon />
                </span>
                :
                null
            }
            
        </div>
        <div className="margin-top-1">
            <p className="fadded-black-text no-space">
                {service.description}
            </p>
        </div>
        <div className="flex-space-between margin-top-1 services-info-container">
            <span className="bold-text main-color-text flex-center">
                <PaidOutlinedIcon />
                {formatNumber(service.price)} EGP
            </span>
            <span className="bold-text main-color-text flex-center">
                <AccessAlarmOutlinedIcon />
                {service.duration} minutes
            </span>
        </div>
        <div className="flex-space-between">
        {
            isShowDelete ? 
            <div className="margin-top-1">
                <button 
                className="normal-button red-bg white-text"
                onClick={() => deleteAction(service)}
                >Delete</button>
            </div>
            :
            null
        }
        {
            isShowDelete ?
            null
            :
            <div></div>
        }
        {
            isShowButton ?
            <div className="margin-top-1 align-right">
                <button 
                className="normal-button main-color-bg white-text bold-text"
                onClick={() => buttonAction(service)}
                >{buttonText}</button>
            </div>
            :
            null
        }
        </div>
        
    </div>
    </CardTransition>
}

export default ServiceCard