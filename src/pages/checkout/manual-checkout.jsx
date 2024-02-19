import { useState, useEffect } from 'react'
import './checkout.css'
import vodafoneIcon from '../../assets/vodafone_icon.svg'
import instapayIcon from '../../assets/instapay.png'
import CardImage from '../../components/images/image'
import { serverRequest } from '../../components/API/request'
import { toast } from 'react-hot-toast'
import { format } from 'date-fns'
import { formatNumber } from '../../utils/numbers'
import Loading from '../../components/loading/loading'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { motion } from 'framer-motion'
import { NavLink } from 'react-router-dom'
import { capitalizeFirstLetter } from '../../utils/formatString'


const CheckoutPage = () => {

    const pagePath = window.location.pathname
    const appointmentId = pagePath.split('/')[2]

    const [reload, setReload] = useState(1)

    const [appointment, setAppointment] = useState()
    const [isPayLoading, setIsPayLoading] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [isSubmitted, setIsSubmitted] = useState(false)

    const [transactionId, setTransactionId] = useState()
    const [gateway, setGateway] = useState('INSTAPAY')
    const [transactionIdError, setTransactionIdError] = useState()

    const CARD_ID = 'raayaeg@instapay'
    const WALLET_NUMBER = '01065630331'

    const divAnimation = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0 },
    }

    useEffect(() => {
        scroll(0, 0)
        document.title = 'Checkout'
    }, [])

    useEffect(() => {
        serverRequest.get(`/v1/appointments/${appointmentId}`)
        .then(response => {
            setIsLoading(false)
            setAppointment(response.data.appointment)
            
            const appointment = response.data.appointment
            if(appointment?.payment?.transactionId) {
                setIsSubmitted(true)
                setTransactionId(appointment?.payment?.transactionId)
                setGateway(appointment?.payment?.gateway)
            }
        })
        .catch(error => {
            setIsLoading(false)
            console.error(error)
            toast.error(error?.response?.data?.message, { duration: 3000, position: 'top-right' })
        })
    }, [reload])

    const getTotalPrice = (price) => {
        return price + (price * 0.1)
    }

    const renderAppointmentVerification = (verification) => {

        if (verification === 'REVIEW') {
            return <span className="status-btn pending bold-text">Reviewing</span>
        } else if (verification === 'ACCEPTED') {
            return <span className="status-btn done bold-text">Accepted</span>
        } else if (verification === 'REJECTED') {
            return <span className="status-btn declined bold-text">Rejected</span>
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {

            if(!transactionId) return setTransactionIdError('Transaction ID is required') 
            
            const paymentData = { transactionId, gateway }

            setIsPayLoading(true)
            await serverRequest.patch(`/v1/appointments/${appointmentId}/payment-verification`, paymentData)
            setIsPayLoading(false)
            setIsSubmitted(true)
            setReload(reload + 1)

        } catch(error) {
            setIsPayLoading(false)
            console.error(error)

            toast.error(error.response.data.message, { duration: 3000, position: 'top-right' })
        }

    }

    return <div className="min-height-100">
        <br />
        <div className="center page-header-container">
            <h1>Checkout</h1>
        </div>
        {
            isLoading ?
            <div className="empty-container flex-center">
                <Loading width={'4rem'} height={'4rem'} />
            </div>
            :
            <div className="checkout-body-container">
            <div>
                <motion.div
                initial="hidden"
                animate="visible"
                variants={divAnimation}
                transition={{ duration: 0.5 }}
                >
                <div className="styled-container">
                    <h3 className="no-space">Details</h3>
                    <div className="payment-method-summary margin-top-1">
                        <div className="payment-method-expert-info-container">
                            <CardImage 
                            name={appointment?.expert?.firstName}
                            imageURL={appointment?.expert?.profileImageURL}
                            width={'3rem'} 
                            height={'3rem'} 
                            borderRadius={'50%'} 
                            />
                            <div>
                                <strong>
                                    {appointment?.expert?.firstName}
                                </strong>
                                <span className="main-color-text bold-text">{appointment?.expert?.title}</span>
                            </div>
                        </div>
                        {/*<div className="margin-top-1 margin-bottom-1 coupon-container">
                            <input 
                            type="text"
                            className="form-input"
                            placeholder="Enter coupon here"
                            disabled
                            />
                            <button className="normal-button main-color-bg white-text">
                                Apply
                            </button>
                        </div>*/}
                        <ul>
                            {
                                appointment.service.title ?
                                <li>
                                    <span>Service</span>
                                    <span>{appointment?.service?.title}</span>
                                </li>
                                :
                                null
                            }
                            {
                                appointment.verification ?
                                <li>
                                    <span>Payment Verification</span>
                                    {renderAppointmentVerification(appointment.verification)}
                                </li>
                                :
                                null
                            }
                            <li>
                                <span>Start Date</span>
                                <span>{format(new Date(appointment?.startTime), 'dd MMMM yyyy')}</span>
                            </li>
                            <li>
                                <span>Time</span>
                                <span>{format(new Date(appointment?.startTime), 'hh:mm a')}</span>
                            </li>
                            <li>
                                <span>Duration</span>
                                <span>{appointment.duration ? appointment.duration : 0} minutes</span>
                            </li>
                            <li>
                                <span>Subtotal</span>
                                <span>{formatNumber(appointment?.price)} EGP</span>
                            </li>
                            <li>
                                <span>Service Fees</span>
                                <span>{formatNumber(appointment?.price * 0.1)} EGP</span>
                            </li>
                            <li>
                                <span className="bold-text">Total</span>
                                <span className="bold-text">{formatNumber(getTotalPrice(appointment.price))} EGP</span>
                            </li>
                        </ul>
                    </div>
                    
                    
                </div>
                </motion.div>
            </div>
            <div>
                {
                    isSubmitted ?
                    <div className="styled-container">
                        <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={divAnimation}
                        transition={{ duration: 0.5 }}
                        >
                            <div className="align-center">
                                <br />
                                <CheckCircleIcon 
                                htmlColor="#20c997" 
                                style={{ fontSize: '4rem' }}
                                />
                                <div>
                                    <strong className="large-font">Submitted Successfully!</strong>
                                    <p className="align-left normal-font fadded-black-text">
                                        Success! Your form has been submitted. An email confirmation will be sent once your payment is verified. Thank you for choosing our service!
                                    </p>
                                </div> 
                                <div className="flex-space-around">
                                    <button onClick={() => setIsSubmitted(false)} className="normal-button white-text main-color-bg">Change Transaction ID</button>
                                    <NavLink to="/appointments/status/upcoming" className="normal-button center bold-text main-color-text main-color-border">View Sessions</NavLink>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    :
                    <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={divAnimation}
                    transition={{ duration: 0.5 }}
                    >
                        <div className="styled-container">
                        <div className="flex-space-between-center">
                            <h3 className="no-space">Payment Steps</h3>
                        </div>
                        <div className="payment-gateway-container">
                            <div className="payment-gateway-wrapper">
                                <div
                                onClick={() => setGateway("VODAFONE")} 
                                className={gateway === "VODAFONE" ? "payment-gateway-choice-container gateway-shadow" : "payment-gateway-choice-container"}
                                >
                                    <img src={vodafoneIcon} />
                                    <strong className="small-font">Vodafone Cash</strong>
                                </div>
                                <div 
                                onClick={() => setGateway("INSTAPAY")} 
                                className={gateway === "INSTAPAY" ? "payment-gateway-choice-container gateway-shadow" : "payment-gateway-choice-container"}
                                >
                                    <img style={{ width: '6rem', height: '6rem' }} src={instapayIcon} />
                                </div>
                            </div>
                        </div>
                        <div className="payment-steps-container">
                            <ul>
                            <li>
                                <strong>
                                    1. Make Payment
                                </strong>
                                <p className="fadded-black-text">
                                    Please make a payment of <span className="bold-text main-color-text">{formatNumber(getTotalPrice(appointment.price))} EGP</span> to <span className="main-color-text bold-text">{ gateway === 'INSTAPAY' ? CARD_ID : WALLET_NUMBER }</span> using { gateway === 'INSTAPAY' ? 'InstaPay' : 'Vodafone Cash' } to confirm your appointment.
                                </p>
                            </li>
                            <li>
                                <strong>
                                    2. Get Transaction ID
                                </strong>
                                <p className="fadded-black-text">
                                    Once the payment is complete, you'll receive a unique Transaction or Reference ID from { gateway === 'INSTAPAY' ? 'InstaPay' : 'Vodafone Cash' } enter this ID in the space below to proceed.                              
                                </p>
                            </li>
                            <li>
                                <strong>
                                    3. Confirm Payment
                                </strong>
                                <p className="fadded-black-text">
                                    Once you Click "<span className="main-color-text bold-text">Verify Payment</span>" the Transaction ID will be verified, if it is accepted or rejected you will receive an email about the payment status!                           
                                </p>
                            </li>
                            </ul>
                        </div>
                        <div>
                            <div className="form-input-container">
                                <input 
                                type="text"
                                className="form-input"
                                placeholder='Enter Transaction ID'
                                value={transactionId}
                                onClick={() => setTransactionIdError()}
                                onChange={e => setTransactionId(e.target.value)}
                                />
                                <span className="red-text">{transactionIdError}</span>
                            </div>
                        </div>
                            
                        <div className="margin-top-1 center">
                            {
                                isPayLoading ?
                                <Loading />
                                :
                                <button onClick={handleSubmit} className="normal-button main-color-bg white-text full-width">
                                    Verify Payment
                                </button>
                            }
                        </div>
                        </div>
                    </motion.div>
                }

                
            </div>
            <br />
        </div>
        }

    </div>
}

export default CheckoutPage