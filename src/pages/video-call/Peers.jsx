import './video-call.css'
import { useVideo } from '@100mslive/react-sdk'

const Peer = ({ peer, dominantSpeaker }) => {
 
    const { videoRef } = useVideo({ trackId: peer.videoTrack })

    return <div className="video-wrapper">
        <video 
        ref={videoRef}
        playsInline 
        autoPlay 
        muted
        className={dominantSpeaker && dominantSpeaker?.id === peer.id ? `video-box-shadow` : ''}
        />
        <span className="video-tag">
            {peer.name} {peer.isLocal ? "(You)" : "" }
        </span>
    </div>
}

export default Peer