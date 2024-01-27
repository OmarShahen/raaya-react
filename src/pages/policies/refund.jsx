import { useEffect } from 'react'
import './policy.css'


const RefundPage = () => {

    useEffect(() => {
        scroll(0, 0)
    }, [])

    
    return <div className="min-height-100">
        <br />
        <div className="center page-header-container">
            <h1>Cancellation and Refund Policy</h1>
        </div>
        <div className="styled-container policies-container">
            <p>
                Our policies at RA'AYA rely on transparency and aim at providing high-quality services, protect our clients and experts from service misuse, and respect their time.
            </p>
            <p>
                Please take a moment to read our policy. By using our service you’re accepting its terms.
            </p>
            <ol>
                <li>
                    <p>
                        Clients will get a full refund if they cancelled the session 24 hours before the appointment.                    
                    </p>
                </li>
                <li>
                    <p>
                        Clients will get a 50% refund if they cancelled the session with less than 24 hours and prior to 3 hours before the appointment.                    
                    </p>
                </li>
                <li>
                    <p>
                        No refund will be applied if the client cancelled the session less than three hours before the appointment.                    
                    </p>
                </li>
                <li>
                    <p>
                    In case of a expert no-show that lasts for 15 minutes from the appointment start time, the client can get a full refund or reschedule the session free of any charges.                
                    </p>
                </li> 
            </ol>
        </div>
            
    </div>
}

export default RefundPage