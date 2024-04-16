import { useState, useEffect } from 'react'
import { serverRequest } from '../../components/API/request'
import { toast } from 'react-hot-toast'
import { useSelector } from 'react-redux'
import EmptySection from '../../components/sections/empty/empty'
import AppointmentCard from '../../components/cards/appointment'
import Loading from '../../components/loading/loading'


const UpcomingAppointments = () => {

    const user = useSelector(state => state.user.user)

    const [reload, setReload] = useState(1)
    const [isLoading, setIsLoading] = useState(true)
    const [appointments, setAppointments] = useState([])
    const [isPaid, setIsPaid] = useState('ALL')

    useEffect(() => scroll(0, 0), [])

    useEffect(() => {

        const endpointURL = user.type === 'EXPERT' ?
        `/v1/appointments/experts/${user._id}/status/UPCOMING?isPaid=${isPaid}`
        :
        `/v1/appointments/seekers/${user._id}/status/UPCOMING`

        serverRequest.get(endpointURL)
        .then(response => {
            setIsLoading(false)
            setAppointments(response.data.appointments)
        })
        .catch(error => {
            setIsLoading(false)
            console.error(error)
            toast.error(error?.response?.data?.message, { duration: 3000, position: 'top-right' })
        })
    }, [reload, isPaid])

    const searchAppointments = (e) => {
        const value = e.target.value
        if(!value) {
            return setReload(reload + 1)
        }
        setIsLoading(true)
        serverRequest.get(`/v1/appointments/experts/${user._id}/search/name?name=${value}`)
        .then(response => {
            setIsLoading(false)
            setAppointments(response.data.appointments)
        })
        .catch(error => {
            setIsLoading(false)
            console.error(error)
            toast.error(error?.response?.data?.message, { duration: 3000, position: 'top-right' })
        })
    }

    return <div className="margin-top-1">
        <div>
            {
                user.type === 'EXPERT' ?
                <div className="margin-bottom-1">
                <input 
                type="search" 
                className="form-input" 
                placeholder="Search with seeker name..."
                onChange={searchAppointments}
                />
                </div>
                :
                null
            }
            {
                user.type === 'EXPERT' ?
                <div className="flex-space-around-center margin-bottom-1">
                    <div>
                        <strong 
                        onClick={() => setIsPaid('ALL')} 
                        className={isPaid === 'ALL' ? 'main-color-text hoverable' : 'hoverable'}>
                            All
                        </strong>
                    </div>
                    <div>
                        <strong 
                        onClick={() => setIsPaid('TRUE')} 
                        className={isPaid === 'TRUE' ? 'main-color-text hoverable' : 'hoverable'}>
                            Paid
                        </strong>
                    </div>
                    <div>
                        <strong 
                        onClick={() => setIsPaid('FALSE')} 
                        className={isPaid === 'FALSE' ? 'main-color-text hoverable' : 'hoverable'}>
                            Unpaid
                        </strong>
                    </div>
                </div>
                :
                null
            }
            {
                isLoading ?
                <div className="flex-center">
                    <Loading />
                </div>
                :
                appointments.length === 0 ?
                <EmptySection />
                :
                appointments.map(appointment => <AppointmentCard 
                key={appointment._id} 
                appointment={appointment} 
                setReload={setReload}
                reload={reload}
                />)
            }
        </div>
    </div>
}

export default UpcomingAppointments