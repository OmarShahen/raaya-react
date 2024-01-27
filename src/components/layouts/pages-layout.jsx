import { Outlet } from 'react-router-dom'
import './layout.css'
import { useSelector } from 'react-redux'
import Navbar from '../navbar/navbar'
import BottomBar from '../navbar/bottombar'
import Footer from '../footer/footer'

const PagesLayout = () => {

    const user = useSelector(state => state.user.user)

    return <div>
        <Navbar />
        <Outlet />
        { user.isLogged ? <BottomBar /> : null }
        <Footer />
    </div>
}

export default PagesLayout