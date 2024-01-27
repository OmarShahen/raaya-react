import { useState, useEffect } from 'react'
import ItemCard from "../components/cards/item"
import Filters from "../components/search/filter"
import { serverRequest } from '../components/API/request'
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined'
import Loading from '../components/loading/loading'
import EmptySection from '../components/sections/empty/empty'


const DoctorsPage = () => {

    const pagePath = window.location.pathname
    const specialityId = pagePath.split('/')[2]

    const [isLoading, setIsLoading] = useState(true)
    const [isPaginationLoading, setIsPaginationLoading] = useState(false)
    const [total, setTotal] = useState(0)
    const [experts, setExperts] = useState([])
    const [sortBy, setSortBy] = useState()

    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(10)

    const [searchName, setSearchName] = useState()
    const [reload, setReload] = useState(1)
    const [gender, setGender] = useState()

    const [speciality, setSpeciality] = useState(specialityId)
    const [subspecial, setSubspecial] = useState()

    useEffect(() => scroll(0, 0), [])

    useEffect(() => {
        setIsLoading(true)

        const query = { 
            gender, 
            sortBy, 
            subSpecialityId: subspecial,
            limit,
            page
        }

        serverRequest.get(`/v1/experts/specialities/${speciality}`, { params: query })
        .then(response => {
            setIsLoading(false)
            setExperts(response.data.experts)
            setTotal(response.data.totalExperts)
        })
        .catch(error => {
            setIsLoading(false)
            console.error(error)
        })
    }, [reload])


    const loadPagination = (page) => {

        setIsPaginationLoading(true)
        const query = { 
            gender, 
            sortBy, 
            subSpecialityId: subspecial,
            limit,
            page
        }

        serverRequest.get(`/v1/experts/specialities/${speciality}`, { params: query })
        .then(response => {
            setIsPaginationLoading(false)
            setExperts([...experts, ...response.data.experts])
        })
        .catch(error => {
            setIsPaginationLoading(false)
            console.error(error)
        })
    }

    const searchExperts = () => {

        setIsLoading(true)
        serverRequest.get(`/v1/experts/specialities/${speciality}/name/${searchName}`)
        .then(response => {
            setIsLoading(false)
            setExperts(response.data.experts)
            setTotal(response.data.totalExperts)
        })
        .catch(error => {
            setIsLoading(false)
            console.error(error)
        })
    }

    return <div className="min-height-100">
        <br />
        <div className="center page-header-container">
            <h1>Our Experts</h1>
        </div>
        <div className="page-search-filter-layout">
            <div className="page-filter-container">
                <Filters 
                speciality={speciality}
                setSpeciality={setSpeciality}
                gender={gender}
                setGender={setGender}
                setReload={setReload}
                reload={reload}
                setSubspecial={setSubspecial}
                subspecial={subspecial}
                />
            </div>
            <div className="items-page-container">
                
                <form onClick={e => e.preventDefault()} id="search-btn" className="items-search-container">
                    <div className="password-container">
                        <input 
                        type="search"
                        className="form-input" 
                        placeholder="Search Expert names..."
                        onChange={e => setSearchName(e.target.value)} 
                        />
                        <span className="password-icon"><SearchOutlinedIcon /></span>
                    </div>
                        <button 
                        className="normal-button main-color-bg white-text"
                        onClick={() => searchExperts()}
                        form="search-btn"
                        >Search</button>
                </form>
                
                <div>
                    { isLoading ?
                    <div className="flex-center margin-top-1">
                        <Loading width="50" height="50" />
                    </div>
                    :
                    experts.length !== 0 ?
                    experts.map((expert) => <div className="margin-top-1" key={expert._id}>
                        <ItemCard expert={expert} />
                    </div>)
                    :
                    <div className="styled-container margin-top-1">
                        <EmptySection />
                    </div>
                    }
                </div>
                <div className="margin-top-1 center">
                {
                    total > limit ?
                    isPaginationLoading ?
                    <Loading />
                    :
                    <span onClick={() => {
                        loadPagination(page + 1)
                        setPage(page + 1)
                    }} className="main-color-text bold-text hoverable hover-text-underline">Load more</span>
                    :
                    null
                }
                </div>
            </div>
        </div>
        <br />
    </div>
}

export default DoctorsPage