import { useEffect, useState } from 'react'
import { serverRequest } from "../../components/API/request"
import { toast } from 'react-hot-toast'
import { NavLink } from 'react-router-dom'
import Loading from '../../components/loading/loading'
import './speciality.css'


const FindExpertPage = () => {

    const [specialities, setSpecialities] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => scroll(0, 0), [])

    useEffect(() => {
        setIsLoading(true)
        serverRequest.get('/v1/specialities')
        .then(response => {
            setIsLoading(false)
            setSpecialities(response.data.specialities)
        })
        .catch(error => {
            setIsLoading(false)
            console.error(error)
            toast.error(error?.response?.data?.message, { duration: 3000, position: 'top-right' })
        })
    }, [])

    return <div className="min-height-100 both-sides-padded-container">
        <br />
        <div className="align-center margin-bottom-1">
            <h1 className="no-space">Find Expert</h1>
        </div>
        <br />
        <div className="margin-top-1">
            <div className="styled-container find-expert-container">
                <h6 className="find-expert-question-container center fadded-black-text no-space">
                    Please choose area of expertise to find the right experts for your needs!
                </h6>
                <div>
                {
                    isLoading ?
                    <div className="flex-center">
                        <Loading width={'3rem'} height={'3rem'} />
                    </div>
                    :
                    <div className="tags-container find-expert-tags-container center">
                        {specialities.map(special => <NavLink to={`/specialities/${special._id}`} className="main-tag no-decoration margin-right-1 bold-text large-font" key={special._id}>
                            {special.name}
                        </NavLink>)}
                    </div>
                }
            </div>
            </div>
        </div>
    </div>
}

export default FindExpertPage