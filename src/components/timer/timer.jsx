import { useTimer } from "react-timer-hook"

const Timer = ({ expiryTimestamp, onExpire }) => {

    const { seconds, minutes } = useTimer({ expiryTimestamp, onExpire })

    return <span>{minutes}:{seconds}</span>

}

export default Timer