import { useState, useEffect } from 'react'
import ItemCard from "../components/cards/item"
import Filters from "../components/search/filter"
import { serverRequest } from '../components/API/request'
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined'
import Loading from '../components/loading/loading'
import EmptySection from '../components/sections/empty/empty'
import ExpertsOnlineBanner from '../components/sections/banners/experts-online-banner'
import { useParams } from 'react-router-dom'


const DoctorsPage = () => {

    const pagePath = window.location.pathname
    const specialityId = pagePath.split('/')[2]

    const { id } = useParams()

    const [isLoading, setIsLoading] = useState(true)
    const [isPaginationLoading, setIsPaginationLoading] = useState(false)
    const [total, setTotal] = useState(0)
    const [experts, setExperts] = useState([])
    const [onlineExperts, setOnlineExperts] = useState([])
    const [sortBy] = useState()
    const [isAcceptPromoCodes, setIsAcceptPromoCodes] = useState()
    const [isOnline, setIsOnline] = useState()

    const [page, setPage] = useState(1)
    const [limit] = useState(10)

    const [searchName, setSearchName] = useState()
    const [reload, setReload] = useState(1)
    const [gender, setGender] = useState()

    const [speciality, setSpeciality] = useState(specialityId)
    const [subspecial, setSubspecial] = useState()

    const [isShowFilter, setIsShowFilter] = useState(false)

    useEffect(() => {
        scroll(0, 0)
        document.title = 'Our Experts'
    }, [])

    useEffect(() => {
        setSpeciality(id)
    }, [id])

    useEffect(() => {
        setIsLoading(true)

        const query = { 
            gender, 
            sortBy, 
            subSpecialityId: subspecial,
            limit,
            page,
            isAcceptPromoCodes,
            isOnline
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
    }, [reload, speciality])

    useEffect(() => {

        const query = { isOnline: 'TRUE' }
        serverRequest.get(`/v1/experts/specialities/${speciality}`, { params: query })
        .then(response => {
            setOnlineExperts(response.data.experts)
        })
        .catch(error => {
            console.error(error)
        })
    }, [speciality])

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

        if(!searchName) {
            return
        }

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

    const onlineExpertBannerFunction = () => {
        setIsOnline('TRUE')
        setGender()
        setSubspecial()
        setIsAcceptPromoCodes()
        setReload(reload + 1)
    }

    return <div className="min-height-100">
        <br />
        {
            onlineExperts.length !== 0 ?
            <div className="hide-mobile">
                <ExpertsOnlineBanner 
                totalExperts={onlineExperts.length} 
                actionFunction={onlineExpertBannerFunction}
                />
            </div>
            :
            null
        }
        <div className="center page-header-container">
            <h1>Our Experts</h1>
        </div>
        <div className="page-search-filter-layout">
            <div className="page-filter-container hide-mobile">
                <Filters 
                speciality={speciality}
                setSpeciality={setSpeciality}
                gender={gender}
                setGender={setGender}
                setReload={setReload}
                reload={reload}
                setSubspecial={setSubspecial}
                subspecial={subspecial}
                isAcceptPromoCodes={isAcceptPromoCodes}
                setIsAcceptPromoCodes={setIsAcceptPromoCodes}
                isOnline={isOnline}
                setIsOnline={setIsOnline}
                />
            </div>
            {
                isShowFilter ?
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
                    isAcceptPromoCodes={isAcceptPromoCodes}
                    setIsAcceptPromoCodes={setIsAcceptPromoCodes}
                    setIsShowFilter={setIsShowFilter}
                    isOnline={isOnline}
                    setIsOnline={setIsOnline}
                    />
                </div>
                :
                null
            }
            <div className="items-page-container">
                
                <div onClick={e => e.preventDefault()} className="items-search-container">
                    <div className="password-container">
                        <input 
                        type="search"
                        className="form-input" 
                        placeholder="Start Typing Expert's Name to Search..."
                        onChange={e => setSearchName(e.target.value)} 
                        />
                        <span className="password-icon"><SearchOutlinedIcon /></span>
                    </div>
                    <div className="search-and-filter-buttons-container">
                        <button 
                        className="normal-button show-mobile full-width main-color-border main-color-text bold-text flex-center"
                        onClick={() => setIsShowFilter(true)}
                        form="search-btn"
                        >
                            Filters
                        </button>
                        <button 
                        className="normal-button bold-text full-width main-color-bg white-text flex-center"
                        onClick={() => searchExperts()}
                        form="search-btn"
                        >
                            Search
                        </button>
                    </div>
                </div>
                
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