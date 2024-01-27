import { Outlet } from 'react-router-dom'
import './layout.css'
import LoginFormModal from '../modals/login-form'
import { useSelector } from 'react-redux'
import SignupFormModal from '../modals/signup-form'
import ExpertSignupFormModal from '../modals/expert-signup-form'


const MainLayout = () => {

    const modal = useSelector(state => state.modal)

    return <div>
            <div className="page-body bg-main-color">
            { modal.isShowLoginModal ? <LoginFormModal /> : null }
            { modal.isShowSigninModal ? <SignupFormModal /> : null }
            { modal.isShowExpertModal ? <ExpertSignupFormModal /> : null }
            <Outlet />
        </div>
        <div className="bottom-page-padding show-mobile"></div>
    </div>
}

export default MainLayout