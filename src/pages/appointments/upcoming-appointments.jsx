import { useState, useEffect } from 'react'
import { serverRequest } from '../../components/API/request'
import { toast } from 'react-hot-toast'
import { useSelector } from 'react-redux'
import EmptySection from '../../components/sections/empty/empty'
import AppointmentCard from '../../components/cards/appointment'
import Loading from '../../components/loading/loading'


const UpcomingAppointments = () => {

    const user = useSelector(state => state.user.user)

    const [isLoading, setIsLoading] = useState(true)
    const [appointments, setAppointments] = useState([])

    useEffect(() => scroll(0, 0), [])

    useEffect(() => {

        const endpointURL = user.type === 'EXPERT' ?
        `/v1/appointments/experts/${user._id}/status/UPCOMING/payments/paid`
        :
        `/v1/appointments/seekers/${user._id}/status/UPCOMING/payments/paid`

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
    }, [])

    return <div className="margin-top-1">

        {
            isLoading ?
            <div className="flex-center">
                <Loading />
            </div>
            :
            appointments.length === 0 ?
            <EmptySection />
            :
            appointments.map(appointment => <AppointmentCard key={appointment._id} appointment={appointment} />)
        }
    </div>
}

export default UpcomingAppointments