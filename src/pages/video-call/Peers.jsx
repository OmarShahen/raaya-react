import './video-call.css'
import { useVideo } from '@100mslive/react-sdk'

const Peer = ({ peer }) => {
 
    const { videoRef } = useVideo({ trackId: peer.videoTrack })

    return <div className="video-wrapper">
        <video 
        ref={videoRef}
        playsInline 
        autoPlay 
        muted
        />
        <span className="video-tag">
            {peer.name} {peer.isLocal ? "(You)" : "" }
        </span>
    </div>
}

export default Peer