import { logEvent } from "firebase/analytics"
import { analytics } from "../firebase/config"

export const onAnalytics = (eventName, eventParams) => {
    logEvent(analytics, eventName, eventParams)
}