import { useState, useEffect } from 'react'
import './checkout.css'
import RadioButtonCheckedOutlinedIcon from '@mui/icons-material/RadioButtonCheckedOutlined'
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked'
import paymobImage from '../../assets/paymob.webp'
import visaImage from '../../assets/visa.png'
import mastercardImage from '../../assets/master_card_.svg'
import etisalatIcon from '../../assets/etisalat_icon.svg'
import orangeIcon from '../../assets/orange_icon.svg'
import weIcon from '../../assets/we_icon.svg'
import vodafoneIcon from '../../assets/vodafone_icon.svg'
import CardImage from '../../components/images/image'
import { serverRequest } from '../../components/API/request'
import { toast } from 'react-hot-toast'
import { format } from 'date-fns'
import { formatNumber } from '../../utils/numbers'
import { useSelector } from 'react-redux'
import Loading from '../../components/loading/loading'


const CheckoutPage = () => {

    const pagePath = window.location.pathname
    const appointmentId = pagePath.split('/')[2]

    const user = useSelector(state => state.user.user)

    const [appointment, setAppointment] = useState()
    const [isPayLoading, setIsPayLoading] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    const [walletNumber, setWalletNumber] = useState()
    const [walletNumberError, setWalletNumberError] = useState()
    const [paymentMethod, setPaymentMethod] = useState('LOCAL_CARD')

    useEffect(() => scroll(0, 0), [])

    useEffect(() => {
        serverRequest.get(`/v1/appointments/${appointmentId}`)
        .then(response => {
            setIsLoading(false)
            setAppointment(response.data.appointment)
        })
        .catch(error => {
            setIsLoading(false)
            console.error(error)
            toast.error(error?.response?.data?.message, { duration: 3000, position: 'top-right' })
        })
    }, [])

    const getTotalPrice = (price) => {
        return price + (price * 0.1)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {

            if(paymentMethod === 'MOBILE_WALLET' && !walletNumber) return setWalletNumberError('Phone number is required') 
            
            const paymentData = {
                walletPhone: walletNumber,
                firstName: user.firstName,
                lastName: user.firstName,
                email: user.email,
                appointmentId,
                phone: Number.parseInt(`${user.countryCode}${user.phone}`),
                planName: `${appointment.duration} minutes session`,
                planPrice: getTotalPrice(appointment.price) * 100,
                planDaysDuration: 1
            }

            const paymentEndpointURL = paymentMethod === 'MOBILE_WALLET' ? '/v1/payments/paymob/mobile-wallets' : '/v1/payments/paymob'

            setIsPayLoading(true)
            const payment = await serverRequest.post(paymentEndpointURL, paymentData)
            setIsPayLoading(false)

            if(paymentMethod === 'MOBILE_WALLET' && !payment.data.redirectURL) {
                return toast.error(payment.data.message, { duration: 3000, position: 'top-right' })
            }

            location.href = paymentMethod === 'MOBILE_WALLET' ? payment.data.redirectURL : payment.data.iFrameURL

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
                <div className="styled-container">
                    <h3 className="no-space">Payment Method</h3>
                    <div className="payment-method-container margin-top-1">
                        <ul>
                            <li className="margin-bottom-1 hoverable" onClick={() => setPaymentMethod('LOCAL_CARD')}>
                                <div>
                                    <span>
                                        {
                                            paymentMethod === 'LOCAL_CARD' ?
                                            <RadioButtonCheckedOutlinedIcon />
                                            :
                                            <RadioButtonUncheckedIcon style={{ color: 'grey' }} />
                                        }
                                    </span>
                                    <span className="normal-font bold-text">Local Cards</span>
                                </div>
                                <div>
                                    <img src={paymobImage} />
                                    <img src={visaImage} />
                                    <img src={mastercardImage} />
                                </div>
                            </li>
                            <li className="hoverable" onClick={() => setPaymentMethod('MOBILE_WALLET')}>
                                <div>
                                    <span>
                                        {
                                            paymentMethod === 'MOBILE_WALLET' ?
                                            <RadioButtonCheckedOutlinedIcon />
                                            :
                                            <RadioButtonUncheckedIcon style={{ color: 'grey' }} />
                                        }
                                    </span>
                                    <span className="normal-font bold-text">Vodafone cash & E-wallets</span>
                                </div>
                                <div>
                                    <img src={weIcon} />
                                    <img src={etisalatIcon} />
                                    <img src={orangeIcon} />
                                    <img src={vodafoneIcon} />
                                </div>
                            </li>
                            
                        </ul>
                    </div>
                    {
                        paymentMethod === 'MOBILE_WALLET' ?
                        <div className="margin-top-1">
                            <div className="form-input-container">
                                <input 
                                type="tel"
                                className="form-input"
                                placeholder='Enter Phone Number'
                                value={walletNumber}
                                onClick={() => setWalletNumberError()}
                                onChange={e => setWalletNumber(e.target.value)}
                                />
                                <span className="red-text">{walletNumberError}</span>
                            </div>
                        </div>
                        :
                        null
                    }
                    <div className="margin-top-1 center">
                        {
                            isPayLoading ?
                            <Loading />
                            :
                            <button onClick={handleSubmit} className="bold-text normal-button main-color-bg white-text full-width">
                                Continue {formatNumber(getTotalPrice(appointment.price))} EGP
                            </button>
                        }
                    </div>
                </div>
            </div>
            <div>
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
            </div>
        </div>
        }

    </div>
}

export default CheckoutPage