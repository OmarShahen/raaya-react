import { useState, useEffect } from 'react'
import './search.css'
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined'
import TransgenderOutlinedIcon from '@mui/icons-material/TransgenderOutlined'
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined'
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined'
import ClassOutlinedIcon from '@mui/icons-material/ClassOutlined'
import { serverRequest } from '../API/request'


const Filters = ({ gender, setGender, setReload, reload, setSubspecial, subspecial, speciality, setSpeciality }) => {

    const [mainSpecialities, setMainSpecialities] = useState([])
    const [specialities, setSpecialties] = useState([])

    useEffect(() => {
        serverRequest.get(`/v1/specialities`)
        .then(response => {
            setMainSpecialities(response.data.specialities)
        })
        .catch(error => {
            console.error(error)
        })
    }, [])

    useEffect(() => {
        serverRequest.get(`/v1/specialities/${speciality}/sub-specialities`)
        .then(response => {
            setSpecialties(response.data.specialities)
        })
        .catch(error => {
            console.error(error)
        })
    }, [speciality])

    return <div className="styled-container">
        <div className="filters-header-container large-font bold-text">
            <span>Filter</span>
            <FilterAltOutlinedIcon />
        </div>
        <br />
        <div className="filters-body-container">
            <div className="filters-section-header">
                <div>
                    <ClassOutlinedIcon />
                    <span className="small-font bold-text">Specialities</span>
                </div>
            </div>
            <select 
            className="form-select"
            onChange={e => {
                setSpeciality(e.target.value)
                setSubspecial([])
            }}
            >                
                {mainSpecialities.map(special => {
                    if(special._id === speciality) {
                        return <option selected key={special._id} value={special._id}>{special.name}</option>
                    } 
                    return <option key={special._id} value={special._id}>{special.name}</option>
                })
                }
            </select>
        </div>
        <div className="filters-body-container">
        <div className="filters-section-header">
                <div>
                    <CategoryOutlinedIcon />
                    <span className="small-font bold-text">Subspecialities</span>
                </div>
            </div>
            <select 
            className="form-select"
            onChange={e => setSubspecial(e.target.value)}
            >
                <option selected value="">All</option>
                
                {specialities.map(special => { 
                    return <option key={special._id} value={special._id}>{special.name}</option>
                })
                }
            </select>
        </div>
        {/*<div className="filters-body-container">
            <div className="filters-section-header">
                <div>
                    <CalendarMonthOutlinedIcon />
                    <span className="bold-text small-font">Session Date</span>
                </div>
            </div>
            <div className="filters-sections-options">
                <ul className='no-wrap'>
                    <li>
                        <span>Today</span>
                    </li>
                    <li>
                        <span>Tomorrow</span>
                    </li>
                    <li className="active-option">
                        <span>Anytime</span>
                    </li>
                </ul>
            </div>
        </div>*/}
        <div className="filters-body-container">
            <div className="filters-section-header">
                <div>
                    <TransgenderOutlinedIcon />
                    <span className="small-font bold-text">Gender</span>
                </div>
            </div>
            <div className="filters-sections-options">
                <ul>
                    <li onClick={() => setGender('MALE')} className={gender === 'MALE' ? 'active-option' : ''}>
                        <span>Male</span>
                    </li>
                    <li onClick={() => setGender('FEMALE')} className={gender === 'FEMALE' ? 'active-option' : ''}>
                        <span>Female</span>
                    </li>
                    <li onClick={() => setGender()} className={gender ? '' : "active-option"}>
                        <span>Any</span>
                    </li>
                </ul>
            </div>
        </div>

        {/*
            <div className="filters-body-container">
            <div className="filters-section-header">
                <div>
                    <CalendarMonthOutlinedIcon />
                    <span className="bold-text small-font">Duration</span>
                </div>
            </div>
            <div className="filters-sections-options">
                <ul>
                    <li>
                        <span>30 min</span>
                    </li>
                    <li>
                        <span>60 min</span>
                    </li>
                    <li className="active-option">
                        <span>Any</span>
                    </li>
                </ul>
            </div>
        </div>
        */}
        <div className="filters-body-container">
            
            <div className="margin-top-1 filters-buttons-container">
                <button 
                onClick={() => {
                    setGender()
                    setSubspecial()
                    setReload(reload + 1)
                }}
                className="normal-button action-color-border main-color-text">Clear All</button>
                <button 
                className="normal-button main-color-bg white-text"
                onClick={() => setReload(reload + 1)}
                >Apply
                </button>
            </div>
        </div>
    </div>
}

export default Filters