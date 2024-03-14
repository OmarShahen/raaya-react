import { NavLink } from "react-router-dom"

const TestingPage = () => {

    const CLIENT_ID = "uAL1QZYoRKGMuCa64tq42A"
    const CLIENT_SECRET = "e3RX6v0QYOEgdCjWCN8ibEiTkPfz9fhv"

    const ZOOM_REDIRECT_URL = `https://zoom.us/oauth/authorize?response_type=code&client_id=${CLIENT_ID}&redirect_uri=http://localhost:5173/users/profile`

    return <div>
        <h1>Testing Page</h1>
        <a href="https://zoom.us/oauth/authorize?client_id=uAL1QZYoRKGMuCa64tq42A&response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A5173%2Fusers%2Fprofile" className="normal-button main-color-bg white-text bold-text">Test</a>
    </div>
}

export default TestingPage