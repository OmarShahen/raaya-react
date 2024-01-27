import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { serverRequest } from '../../components/API/request'
import { toast } from 'react-hot-toast'
import Loading from '../../components/loading/loading'
import './opening-time.css'
import OpeningTimeFormModal from '../../components/modals/opening-time-form'
import { capitalizeFirstLetter } from '../../utils/formatString'
import EmptySection from '../../components/sections/empty/empty'
import AddIcon from '@mui/icons-material/Add'


const OpeningTimesPage = () => {

    const user = useSelector(state => state.user.user)

    const [isLoading, setIsLoading] = useState(true)
    const [openingTimes, setOpeningTimes] = useState([])

    const [isUpdate, setIsUpdate] = useState(false)
    const [reload, setReload] = useState(1)
    const [targetTime, setTargetTime] = useState()
    const [isShowForm, setIsShowForm] = useState(false)
    
    useEffect(() => scroll(0, 0), [])

    useEffect(() => {
        setIsLoading(true)
        serverRequest.get(`/v1/opening-times/experts/${user._id}`)
        .then(response => {
            setIsLoading(false)
            setOpeningTimes(response.data.openingTimes)
        })
        .catch(error => {
            setIsLoading(false)
            console.error(error)
        })
    }, [reload])

    const deleteOpeningTime = (openingTimeId) => {
        serverRequest.delete(`/v1/opening-times/${openingTimeId}`)
        .then(response => {
            setReload(reload + 1)
            toast.success(response.data.message, { duration: 3000, position: 'top-right' })
        })
        .catch(error => {
            console.error(error)
            toast.error(error?.response?.data?.message, { duration: 3000, position: 'top-right' })
        })
    }

    const updateOpeningTimeActivity = (openingTimeId, isActive) => {

        serverRequest.patch(`/v1/opening-times/${openingTimeId}/activity`, { isActive })
        .then(response => {
            setReload(reload + 1)
            toast.success(response.data.message, { duration: 3000, position: 'top-right' })
        })
        .catch(error => {
            console.error(error)
            toast.error(error?.response?.data?.message, { duration: 3000, position: 'top-right' })
        })
    }

    const formatHour = (hour) => {

        if(hour === 0) {
            return 12
        }

        if(hour <= 12) {
            return hour
        }

        return hour - 12
    }

    const getTimePeriod = (hour) => {
        return hour >= 12 ? 'PM' : 'AM'
    }

    const formatTimeNumber = (time) => {
        const strTime = String(time)
        if(strTime.length > 1) {
            return String(time)
        }

        return '0' + strTime
    }


    return <div>
        {
            isShowForm ?
            <OpeningTimeFormModal 
            setReload={setReload}
            reload={reload}
            setOpeningTimeObj={setTargetTime}
            openingTimeObj={targetTime}
            isUpdate={isUpdate}
            setIsUpdate={setIsUpdate}
            setShowFormModal={setIsShowForm}
            />
            :
            null
        }
        {
            isLoading ?
            <div className="loading-page-container">
                <Loading width={50} height={50} />
            </div>
            :
            <div className="min-height-100">
                <br />
                <div className="styled-container">
                    <div className="flex-space-between opening-time-header-container">
                        <h2>Opening Times</h2>
                        <div>
                            <button 
                            onClick={() => setIsShowForm(true)}
                            className="normal-button main-color-bg white-text flex-space-between-center">
                                <AddIcon />
                                Add Opening Time
                            </button>
                        </div>
                    </div>
                    <div>
                        {
                        openingTimes.length === 0 ?
                        <EmptySection setIsShowForm={setIsShowForm} btnText='Add your schedule'/>   
                        :
                        openingTimes.map(openingTime => <div className="opening-time-row-container" key={openingTime._id}>
                            <div>{capitalizeFirstLetter(openingTime.weekday)}</div>
                            <div className="flex-space-between">{openingTime.isActive ? <span className="status-btn done">Active</span> : <span className="status-btn declined">Closed</span>}</div>
                            <div>
                                <span>{`${formatHour(openingTime?.openingTime?.hour)}:${formatTimeNumber(openingTime?.openingTime?.minute)} ${getTimePeriod(openingTime?.openingTime?.hour)}`}</span>
                                -
                                <span>{`${formatHour(openingTime?.closingTime?.hour)}:${formatTimeNumber(openingTime?.closingTime?.minute)} ${getTimePeriod(openingTime?.closingTime?.hour)}`}</span>
                            </div>
                            <div className="flex-end row-buttons-container">
                                <button 
                                onClick={() => updateOpeningTimeActivity(openingTime._id, !openingTime.isActive)}
                                className="main-color-border normal-button main-color-text">{openingTime.isActive ? 'Deactivate' : 'Activate'}</button>
                                <button 
                                onClick={() => deleteOpeningTime(openingTime._id)}
                                className="normal-button red-bg white-text margin-left-1"
                                >Delete</button>
                            </div>
                        </div>)
                        }
                    </div>
                </div>
            </div>
        }
        
    </div>
}

export default OpeningTimesPage