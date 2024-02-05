import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { serverRequest } from '../../components/API/request'
import { toast } from 'react-hot-toast'
import Loading from '../../components/loading/loading'
import './services.css'
import { capitalizeFirstLetter } from '../../utils/formatString'
import EmptySection from '../../components/sections/empty/empty'
import AddIcon from '@mui/icons-material/Add'
import ServiceFormModal from '../../components/modals/service-form'
import ServiceCard from '../../components/cards/service'
import DeleteConfirmationModal from '../../components/modals/confirmation/delete-confirmation'


const ServicesPage = () => {

    const user = useSelector(state => state.user.user)

    const [isLoading, setIsLoading] = useState(true)
    const [isDeleting, setIsDeleting] = useState(false)
    const [services, setServices] = useState([])

    const [isUpdate, setIsUpdate] = useState(false)
    const [reload, setReload] = useState(1)
    const [target, setTarget] = useState()
    const [isShowForm, setIsShowForm] = useState(false)
    const [isShowDelete, setIsShowDelete] = useState(false)
    
    useEffect(() => {
        scroll(0, 0)
        document.title = 'User Services'
    }, [])

    useEffect(() => {
        setIsLoading(true)
        serverRequest.get(`/v1/services/experts/${user._id}`)
        .then(response => {
            setIsLoading(false)
            setServices(response.data.services)
        })
        .catch(error => {
            setIsLoading(false)
            console.error(error)
            toast.error(error?.response?.data?.message, { duration: 3000, position: 'top-right' })
        })
    }, [reload])

    const deleteService = () => {
        setIsDeleting(true)
        serverRequest.delete(`/v1/services/${target._id}`)
        .then(response => {
            setIsDeleting(false)
            setIsShowDelete(false)
            setTarget()
            setReload(reload + 1)
            toast.success(response.data.message, { duration: 3000, position: 'top-right' })
        })
        .catch(error => {
            setIsDeleting(false)
            console.error(error)
            toast.error(error?.response?.data?.message, { duration: 3000, position: 'top-right' })
        })
    }

    const updateServiceStatus = (service) => {

        serverRequest.patch(`/v1/services/${service._id}/activity`, { isActive: !service.isActive })
        .then(response => {
            setReload(reload + 1)
            toast.success(response.data.message, { duration: 3000, position: 'top-right' })
        })
        .catch(error => {
            console.error(error)
            toast.error(error?.response?.data?.message, { duration: 3000, position: 'top-right' })
        })
    }


    return <div>
        {
            isShowDelete ?
            <DeleteConfirmationModal 
            isShowModal={isShowDelete} 
            setIsShowModal={setIsShowDelete} 
            isLoading={isDeleting} 
            deleteFunction={deleteService}
            title={'Delete Service'}
            description={`Please confirm your decision by clicking the 'Delete' button below. If you do not wish to proceed with the deletion, you can click 'Cancel'.`}
            />
            :
            null
        }
        
        {
            isShowForm ?
            <ServiceFormModal 
            setReload={setReload}
            reload={reload}
            setService={setTarget}
            service={target}
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
                <div>
                    <div className="styled-container">
                        <div className="flex-space-between-center opening-time-header-container">
                            <h2>Services</h2>
                            <div>
                                <button 
                                onClick={() => setIsShowForm(true)}
                                className="normal-button main-color-bg white-text flex-space-between-center">
                                    <AddIcon />
                                    Add Service
                                </button>
                            </div>
                        </div>
                    </div>
                    <div>
                        {
                        services.length === 0 ?
                        <div className="styled-container margin-top-1">
                            <EmptySection setIsShowForm={setIsShowForm} btnText='Add your services'/> 
                        </div>  
                        :
                        <div className="margin-top-1">
                            <div className="cards-3-list-wrapper">
                                {services.map(service => <ServiceCard
                                key={service._id} 
                                service={service}
                                buttonText={service.isActive ? "Deactivate" : "Activate"}
                                buttonAction={updateServiceStatus}
                                deleteAction={() => {
                                    setTarget(service)
                                    setIsShowDelete(true)
                                }}
                                isShowDelete={true}
                                isUpdate={true}
                                updateAction={() => {
                                    setTarget(service)
                                    setIsUpdate(true)
                                    setIsShowForm(true)
                                }}
                                />)}
                            </div>
                        </div>
                        }
                    </div>
                </div>
            </div>
        }
        <br />
    </div>
}

export default ServicesPage