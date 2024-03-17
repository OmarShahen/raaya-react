import { Outlet } from 'react-router-dom'
import './layout.css'
import Navbar from '../navbar/navbar'
import Footer from '../footer/footer'


const PagesLayout = () => {

    return <div>
        <Navbar />
        <Outlet />
        <Footer />
    </div>
}

export default PagesLayout