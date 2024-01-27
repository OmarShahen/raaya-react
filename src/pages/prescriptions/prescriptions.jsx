import { useEffect, useState } from 'react'
import { serverRequest } from '../../components/API/request'
import PrescriptionCard from '../../components/cards/prescription'
import './prescription.css'
import Navbar from '../../components/navbar/navbar'
import { TailSpin } from 'react-loader-spinner'
import EmptySection from '../../components/sections/empty-section'

const PrescriptionsPage = () => {

    const pagePath = window.location.pathname
    const patientId = pagePath.split('/')[2]
    const prescriptionId = pagePath.split('/')[4]

    const [prescription, setPrescription] = useState()
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {

        setIsLoading(true)
        serverRequest.get(`/v1/prescriptions/${prescriptionId}/patients/${patientId}`)
        .then(response => {
            setIsLoading(false)
            setPrescription(response.data.prescription)
        })
        .catch(error => {
            setIsLoading(false)
            console.error(error)
        })
    }, [])

    return <div className="prescription-page-container">
        <div>
            <Navbar />
        </div>
        <div className="prescription-page-card-container">
            { 
                !isLoading ?
                prescription ? 
                <PrescriptionCard prescription={prescription}/> 
                : 
                <EmptySection /> 
                :
                <div className="loading-container">
                    <TailSpin width="50" height="50" color="dodgerblue" />
                </div>
            }
        </div>
    </div>
}

export default PrescriptionsPage