import { useState } from 'react'
import './form-modal.css'
import { serverRequest } from '../API/request'
import { toast } from 'react-hot-toast'
import { TailSpin } from 'react-loader-spinner'
import { useSelector } from 'react-redux'
import Star from '../../components/stars/star'
import CircleOutlinedIcon from '@mui/icons-material/CircleOutlined'
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined'


const ReviewFormModal = ({ setShowFormModal, reload, setReload, expert }) => {

    const user = useSelector(state => state.user.user)

    const [isSubmit, setIsSubmit] = useState(false)

    const [rating, setRating] = useState(5)
    const [commitment, setCommitment] = useState(5)
    const [communication, setCommunication] = useState(5)
    const [solutions, setSolutions] = useState(5)
    const [understanding, setUnderstanding] = useState(5)
    const [note, setNote] = useState()
    const [isRecommend, setIsRecommend] = useState(true)

    
    const handleSubmit = (e) => {
        e.preventDefault()

        const reviewData = {
            expertId: expert._id,
            seekerId: user._id,
            rating,
            commitment,
            communication,
            solutions,
            understanding,
            note,
            isRecommend
        }

        setIsSubmit(true)
        serverRequest.post(`/v1/reviews`, reviewData)
        .then(response => {
            setIsSubmit(false)
            const data = response.data
            toast.success(data.message, { position: 'top-right', duration: 3000 })
            reload ? setReload(reload + 1) : null
            setShowFormModal ? setShowFormModal(false) : null
        })
        .catch(error => {
            setIsSubmit(false)
            console.error(error)

            try {

                toast.error(error.response.data.message, { position: 'top-right', duration: 3000 })

            } catch(error) {
                toast.error(error.message, { position: 'top-right', duration: 3000 })
            }
        })

    }

    return <div className="modal">
        <div className="modal-container modal-wide-width body-text">
            <div className="align-center">
                <h2>Write a review</h2>
                <span className="no-space">
                    Your opinion matters, tell us about your experience with
                </span>
                <div>
                    <strong className="main-color-text">{expert.firstName}</strong>
                </div>
            </div>
            <div className="margin-top-1">
                <div className="modal-body-container">
                    <div className="cards-2-list-wrapper">
                    <div>
                        <div>
                            1.How would you rate your experience ?
                        </div>
                        <div>
                            <span>
                            {[1, 2, 3, 4, 5].map((rate, index) => {
                                return <span className="hoverable" key={index} onClick={() => setRating(index+1)}>
                                    <Star 
                                    key={index}
                                    isBright={rating >= (index+1) ? true : false} 
                                    />
                                </span>
                            })}
                            </span>
                        </div>
                    </div>
                    <div>
                        <div>
                            2.Communication ?
                        </div>
                        <div>
                            <span>
                            {[1, 2, 3, 4, 5].map((rate, index) => {
                                return <span className="hoverable" key={index} onClick={() => setCommunication(index+1)}>
                                    <Star 
                                    key={index}
                                    isBright={communication >= (index+1) ? true : false} 
                                    />
                                </span>
                            })}
                            </span>
                        </div>
                    </div>
                    <div>
                        <div>
                            3.Understanding of the situation ?
                        </div>
                        <div>
                            <span>
                            {[1, 2, 3, 4, 5].map((rate, index) => {
                                return <span className="hoverable" key={index} onClick={() => setUnderstanding(index+1)}>
                                    <Star 
                                    key={index}
                                    isBright={understanding >= (index+1) ? true : false} 
                                    />
                                </span>
                            })}
                            </span>
                        </div>
                    </div>
                    <div>
                        <div>
                            4.Providing effective solutions ?
                        </div>
                        <div>
                            <span>
                            {[1, 2, 3, 4, 5].map((rate, index) => {
                                return <span className="hoverable" key={index} onClick={() => setSolutions(index+1)}>
                                    <Star 
                                    key={index}
                                    isBright={solutions >= (index+1) ? true : false} 
                                    />
                                </span>
                            })}
                            </span>
                        </div>
                    </div>
                    <div>
                        <div>
                            5.Commitment from start to end time ?
                        </div>
                        <div>
                            <span>
                            {[1, 2, 3, 4, 5].map((rate, index) => {
                                return <span className="hoverable" key={index} onClick={() => setCommitment(index+1)}>
                                    <Star 
                                    key={index}
                                    isBright={commitment >= (index+1) ? true : false} 
                                    />
                                </span>
                            })}
                            </span>
                        </div>
                    </div>
                    
                    </div>
                    <div>
                        <div>
                            6.Write something about your experience.
                        </div>
                        <div className="margin-top-1">
                        <textarea
                        className="form-textarea"
                        rows={'3'}
                        onChange={e => setNote(e.target.value)}
                        >
                            {note}
                        </textarea>
                        </div>
                    </div>
                    <div className="margin-top-1">
                        <div>
                            7.Would you recommend this expert to others ?
                        </div>
                        <div className="margin-top-1 review-options-container">
                            <div onClick={() => setIsRecommend(true)}>
                                {
                                    isRecommend ?
                                    <CheckCircleOutlineOutlinedIcon style={{ color: 'green' }} />
                                    :
                                    <CircleOutlinedIcon />
                                }
                                <span>Yes, of course</span>
                            </div>
                            <div onClick={() => setIsRecommend(false)}>
                                {
                                    !isRecommend ?
                                    <CheckCircleOutlineOutlinedIcon style={{ color: 'green' }} />
                                    :
                                    <CircleOutlinedIcon />
                                }
                                <span>Maybe, not</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="margin-top-1">
                    <div className="margin-top-1 center">   
                        { 
                            isSubmit ?
                            <TailSpin
                            height="25"
                            width="25"
                            color="#4c83ee"
                            />
                            :
                            <button
                            form="opening-time-form"
                            className="full-width normal-button main-color-bg white-text margin-top-1 bold-text"
                            onClick={handleSubmit}
                            >{'Submit Review'}</button>
                        } 
                    </div>
                    <div className="center">
                        <button onClick={() => setShowFormModal(false)} className="normal-button">Cancel</button>
                    </div>
                </div>
            </div>            
        </div>
    </div>
}


export default ReviewFormModal