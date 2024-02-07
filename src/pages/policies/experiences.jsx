import { useEffect } from 'react'
import './policy.css'


const ExperiencePage = () => {

    useEffect(() => {
        scroll(0, 0)
    }, [])

    
    return <div className="min-height-100">
        <br />
        <div className="center large-font margin-bottom-1">
            <h1>Best Session Experience</h1>
        </div>
        <div className="styled-container policies-container">
            <ol>
                <li>
                    <p>
                        Internet speed must not be not less than 2 MB/s.
                    </p>
                </li>
                <li>
                    <p>
                    The session room opens 10 minutes before your session start time.                    
                    </p>
                </li>
                <li>
                    <p>
                        If you face any difficulties before or during the session, both sides should contact the support team directly.                    
                    </p>
                </li>
                <li>
                    <p>
                        For the session room, we recommend using a desktop computer or a laptop. If you are using a mobile device, please beware that only Safari is supported on Apple devices and we recommend Google Chrome on Android devices. It is also important for iOS devices to have the latest updates.                    
                    </p>
                </li>
                <li>
                    <p>
                        Please make sure to attend your session from a quiet and an appropriate place.                    
                    </p>
                </li>
                
            </ol>
        </div>
            
    </div>
}

export default ExperiencePage