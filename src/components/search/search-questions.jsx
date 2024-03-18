import { useState, useEffect } from 'react'
import './search-questions.css'
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined'
import { serverRequest } from '../API/request'
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined'
import { NavLink, useNavigate } from 'react-router-dom'
import { capitalizeFirstLetter } from '../../utils/formatString'


const SearchQuestionsSection = ({ searchName, setSearchName, results=[], setIsShow }) => {

    const navigate = useNavigate()

    const [questions, setQuestions] = useState([])

    useEffect(() => {
        serverRequest.get('/v1/issues', { params: { limit: 5 } })
        .then(response => {
            setQuestions(response.data.issues)
        })
        .catch(error => {
            console.error(error)
        })
    }, [])

    return <div className="search-questions-container">
        <div className="white-bg">
            <div className="page-body search-questions-wrapper">
                <div className="flex-end">
                    <span
                    onClick={() => setIsShow(false)}
                     className="flex-end hoverable">
                        <CloseOutlinedIcon style={{ color: "grey", fontSize: "1.7rem", marginTop: ".5rem" }} />
                    </span>
                </div>
                {
                    questions.length !== 0 ?
                    <div className="search-questions-popular-container">
                        <h4>
                            Examples
                        </h4>
                        <div className="tags-container find-expert-tags-container">
                            {questions.map(question => <NavLink 
                            to={`/specialities/${question.specialityId}`} 
                            onClick={() => {
                                setIsShow(false)
                                setSearchName(question.name)
                            }} 
                            key={question._id} 
                            className="main-tag no-decoration margin-right-1 bold-text normal-font">
                                {capitalizeFirstLetter(question.name)}
                            </NavLink>)}
                        </div>
                    </div>
                    :
                    null
                }
                <div className="search-questions-popular-container margin-top-1">
                    <h4 className="no-space">
                        Results for "{searchName}"
                    </h4>
                    <div className="search-questions-results-container margin-top-1">
                        {results.map(result => <div 
                        key={result._id} 
                        className="search-questions-results-row"
                        onClick={() => {
                            setIsShow(false)
                            setSearchName(result.name)
                            navigate(`/specialities/${result.specialityId}`)
                        }}
                        >
                            {capitalizeFirstLetter(result.name)}
                            <SearchOutlinedIcon style={{ color: "grey" }} />
                        </div>)}
                    </div>
                </div>
            </div>
            <br />
        </div>
    </div>
}

export default SearchQuestionsSection