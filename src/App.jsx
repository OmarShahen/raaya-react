import './App.css'

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import DoctorsPage from './pages/doctors'
import MainLayout from './components/layouts/main-layout'
import PagesLayout from './components/layouts/pages-layout'
import AppointmentLayout from './components/layouts/appointments-layout'
import ExpertPage from './pages/experts/expert-profile'
import UserPage from './pages/users/user'
import AppointmentPage from './pages/appointments/appointment'
import UpcomingAppointments from './pages/appointments/upcoming-appointments'

import { Toaster } from 'react-hot-toast'
import OpeningTimesPage from './pages/opening-times/opening-times'
import PreviousAppointments from './pages/appointments/previous-appointments'
//import VideoCallPage from './pages/video-call/video-call'

import SignupPage from './pages/auth/signup'
import LoginPage from './pages/auth/login'
import ForgotPasswordPage from './pages/auth/forgot-password'
import ForgotPasswordVerificationCodePage from './pages/auth/forgot-password-verification-code'
import ResetPasswordPage from './pages/auth/reset-password'
import FindExpertPage from './pages/specialities/find-expert'

import HomePage from './pages/home/home'

import { useSelector } from 'react-redux'
import CheckoutPage from './pages/checkout/checkout'
import ExperiencePage from './pages/policies/experiences'
import RefundPage from './pages/policies/refund'
import AuthorizedLayout from './components/layouts/authorized-layout'
import PaymentStatusPage from './pages/payments/payment-status'
import SessionRoomPage from './pages/video-call/session-room'
import ExpertVerificationPage from './pages/auth/expert-verification'
import ServicesPage from './pages/services/services'
import ExpertBookingPage from './pages/experts/expert-booking'
import PrivacyPage from './pages/policies/privacy'
import TestingPage from './pages/testing'


function App() {

  const user = useSelector(state => state.user.user)

  return (
    <div>
      <Router>
        <Toaster />
        <Routes> 
          <Route element={<PagesLayout />}>
            <Route element={<MainLayout />}>
              <Route path="/specialities/:id" element={<DoctorsPage />} />
              <Route path="/experts/:id" element={<ExpertPage />} />
              <Route path="/experts/:id/:name" element={<ExpertPage />} />
              <Route path="/experts/:id/booking" element={<ExpertBookingPage />} />
              <Route path="/find-expert" element={<FindExpertPage />} />
              <Route path="/policies/experiences" element={<ExperiencePage />} />
              <Route path="/policies/refund" element={<RefundPage />} />
              <Route path="/policies/privacy" element={<PrivacyPage />} />

            <Route element={<AuthorizedLayout />}>

              <Route path="/appointments/:id" element={<AppointmentPage />} />
              <Route path="/users/profile" element={<UserPage />} />
              <Route path="/users/opening-times" element={<OpeningTimesPage />} />
              <Route path="/users/services" element={<ServicesPage />} />
              <Route path="/appointments/:id/checkout" element={<CheckoutPage />} />


              <Route element={<AppointmentLayout />}>
                  <Route path="/appointments/status/upcoming" element={<UpcomingAppointments />} />
                  <Route path="/appointments/status/previous" element={<PreviousAppointments />} />
                </Route>
              </Route>
            </Route>

            <Route path="/expert-verification" element={<ExpertVerificationPage />} />
            <Route path="/auth/signup" element={<SignupPage />} />
            <Route path="/auth/login" element={<LoginPage />} />
            <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/auth/forgot-password/:email/verification-code" element={<ForgotPasswordVerificationCodePage />} />
            <Route path="/auth/reset-password/:email/:code" element={<ResetPasswordPage />} />

            <Route path="/" element={<HomePage />} />
          </Route> 

          <Route element={<PagesLayout />}>
            <Route path="/payments/status" element={<PaymentStatusPage />} />
            <Route path="/testing" element={<TestingPage />} />
          </Route>

          <Route element={<AuthorizedLayout />}>
              <Route path="/video-call/appointments/:id" element={<SessionRoomPage />} />
          </Route>

        </Routes>
      </Router>
    </div>
  )
}

export default App
