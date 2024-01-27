import { useState, useEffect } from 'react'
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined'
import { serverRequest } from '../API/request'

const Search = () => {

    const [specialities, setSpecialties] = useState([])

    useEffect(() => {
        serverRequest.get('/v1/specialities')
        .then(response => {
            setSpecialties(response.data.specialities)
        })
        .catch(error => {
            console.error(error)
        })
    }, [])

    return <div className="search-container">
        <div className="search-input-container">
            <label>Select a specialty</label>
            <select>
                <option selected>Select specialty</option>
                {specialities.map(special => <option value={special._id}>{special.name}</option>)}
            </select>
        </div>
        <div className="search-input-container">
            <label>In this city</label>
            <select>
                <option>Select city</option>
            </select>
        </div>
        <div className="search-input-container">
            <label>In this area</label>
            <select>
                <option>Select area</option>
            </select>
        </div>
        <div className="search-input-container">
            <label for="doctor-name">or search by name</label>
            <input 
            id="doctor-name" 
            type="text" 
            placeholder="Doctor name"
            className="search-name-input"
            />
        </div>
        <div className="search-button-container">
            <button>
                <SearchOutlinedIcon />
            </button>
        </div>
    </div>
}

export default Search