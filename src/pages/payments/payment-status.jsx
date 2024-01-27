import './payment.css'
import { useSearchParams } from 'react-router-dom'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'
import PushPinIcon from '@mui/icons-material/PushPin'
import logo from '../../assets/khatab.png'
import { NavLink } from 'react-router-dom'


const PaymentStatusPage = () => {

    const [searchParams, setSearchParams] = useSearchParams()
    const transactionId = searchParams.get('id')
    const order = searchParams.get('order')
    const success = searchParams.get('success')
    const pending = searchParams.get('pending')
    const hmac = searchParams.get('hmac')
    const cents = searchParams.get('amount_cents')

    return <div>
        <div className="payment-status-page-container">
            <div className="payment-status-header-container">
                { 
                    pending === 'true' ?
                    <PushPinIcon htmlColor="#414552" />
                    :
                    success === 'true' ? 
                    <CheckCircleIcon htmlColor="#20c997" /> 
                    : 
                    <CancelIcon htmlColor="#DE350B" /> 
                }
                {
                    pending === 'true' ?
                    <h2>Payment Pending!</h2>
                    :
                    success === 'true' ?
                    <h2 className="tag-green-text">Payment Successful!</h2>
                    :
                    <h2 className="red-text">Payment Declined!</h2>
                }
                <div className="payment-status-list-container">
                    <span className="grey-text body-text">Transaction Number: #{transactionId}</span>
                </div>
                <br />
                <div className="margin-top-1">
                    <NavLink to="/appointments/status/upcoming" className="normal-button main-color-bg white-text">View Appointments</NavLink>
                </div>
            </div>
        </div>
    </div>
}

export default PaymentStatusPage