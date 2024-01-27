import { io } from 'socket.io-client'

const DEV_URL = 'http://localhost:5007'
const PROD_URL = 'https://raayaeg.online'

export const socket = io(PROD_URL)