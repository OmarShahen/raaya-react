import { useEffect, useState } from "react"
import './video-call.css'
import MicIcon from '@mui/icons-material/Mic'
import VideocamIcon from '@mui/icons-material/Videocam'
import VideocamOffIcon from '@mui/icons-material/VideocamOff'
import MicOffIcon from '@mui/icons-material/MicOff'
import { useNavigate } from "react-router-dom"
import { useSelector } from 'react-redux'
import { serverRequest } from "../../components/API/request"
import Loading from "../../components/loading/loading"
import { useHMSActions, selectPeers, useHMSStore, useAVToggle } from '@100mslive/react-sdk'
import axios from 'axios'
import Peer from "./peers"
import { toast } from 'react-hot-toast'
import Timer from '../../components/timer/timer'


const SessionRoomPage = () => {

    const hmsActions = useHMSActions()
    const peers = useHMSStore(selectPeers)

    const {
        isLocalAudioEnabled,
        isLocalVideoEnabled,
        toggleAudio,
        toggleVideo
    } = useAVToggle()

	const navigate = useNavigate()


    const pagePath = window.location.pathname
    const appointmentId = pagePath.split('/')[3]

    const user = useSelector(state => state.user.user)

	const [isLoading, setIsLoading] = useState(true)
	const [appointment, setAppointment] = useState()


	useEffect(() => {

        window.onunload = () => { hmsActions.leave() }

        const token = 'https://prod-in2.100ms.live/hmsapi/omarredaelsayedmohamed-videoconf-1046.app.100ms.live/api/token'

		serverRequest.get(`/v1/appointments/${appointmentId}`)
		.then(response => {
			setIsLoading(false)
			setAppointment(response.data.appointment)

            const appointment = response.data.appointment
            const appointmentEndTime = new Date(appointment.endTime)
            const todayDate = new Date()

            if(todayDate > appointmentEndTime || appointment.status === 'CANCELLED') {
                toast.error(`Appointment has passed it's time`, { duration: 3000, position: 'top-right' })
                navigate(`/appointments/${appointmentId}`)
                return
            }

            const sessionData = {
                room_id: response.data.appointment.roomId,
                user_id: user._id,
                role: user.type === 'EXPERT' ? 'host' : 'guest'
            }

            axios.post(token, sessionData)
            .then(response => {
                const token = response.data.token
                hmsActions.join({ userName: user.firstName, authToken: token })
                .then(() => {})
            })
		})
		.catch(error => {
			setIsLoading(false)
			console.error(error)
		})
	}, [hmsActions])

    const endSession = () => {
        hmsActions.leave()
        .then(() => {
            navigate(`/appointments/${appointmentId}`)
        })
        .catch(error => {
            console.error(error)
        })
    }

	return <div>
		{
			isLoading ?
			<div className="center empty-container">
				<Loading width={'3rem'} height={'3rem'} />
			</div>
			:
            <div className="video-call-page-container">
                <div className="flex-space-between video-call-page-header">
                    <h2 className="no-space white-text flex-space-between-center">
                        RA'AYA
                        <span className="margin-left-1 bold-text small-font main-color-text">
                            BETA
                        </span>
                    </h2>
                        <span className="white-text large-font">
                            <Timer 
                            expiryTimestamp={new Date(appointment.endTime)} 
                            onExpire={() => {
                                toast.success(
                                    `Meeting is done, it will close the room after 5 minutes`, 
                                    { duration: 7000, position: 'top-right' }
                                )
                            }}
                            />
                        </span>
                        <button
                        onClick={() => endSession()} 
                        className="normal-button red-text end-meeting-button bold-text show-mobile"
                        >
                            End Meeting
                        </button>
                </div>
                <div className="session-room-container">
                    <div className="video-call-screens-wrapper">
                        {
                            peers.length !== 2 ?
                            <div className="video-wrapper">
                                
                            </div>
                            :
                            null
                        }
                        {
                            peers.map(peer => <Peer key={peer.id} peer={peer} />)
                        }
                    </div>
                </div>
                <div className="video-call-container-footer">
                    <div className="video-footer-wrapper">
                        <div className="video-controls-container">
                            {
                                !isLocalAudioEnabled ?
                                <span onClick={toggleAudio} className="hoverable red-text">
                                    <MicOffIcon />
                                    <strong className="hide-mobile">Muted</strong>
                                </span>
                                :
                                <span onClick={toggleAudio} className="hoverable">
                                    <MicIcon />
                                    <strong className="hide-mobile">Unmuted</strong>
                                </span>
                            }
                            
                            {
                                !isLocalVideoEnabled ?
                                <span onClick={toggleVideo} className="hoverable red-text">
                                    <VideocamOffIcon />
                                    <strong className="hide-mobile">Video off</strong>
                                </span>
                                :
                                <span onClick={toggleVideo} className="hoverable">
                                    <VideocamIcon />
                                    <strong className="hide-mobile">Video on</strong>
                                </span>
                            }
                            

                        </div>
                        <button
                        onClick={() => endSession()} 
                        className="normal-button red-text end-meeting-button bold-text hide-mobile"
                        >
                            End Meeting
                        </button>
                        
                    </div>
                </div>
            </div>
		}
	</div>
}

export default SessionRoomPage