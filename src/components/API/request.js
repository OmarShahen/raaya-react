import axios from 'axios'
import { store } from '../../redux/store'

const DEV_URL = 'http://localhost:5007/api'
const PROD_URL = 'https://us-central1-ra-aya.cloudfunctions.net/app/api'

export const serverRequest = axios.create({
    baseURL: PROD_URL
})

serverRequest.interceptors.request.use(config => {

    const { user } = store.getState()?.user

    if(!user) {
        return config
    }

    config.headers['x-access-token'] = user.accessToken

    config.params = { ...config.params, lang: 'en' }

    return config

    }, 
    error => {
        console.log('error in request interceptor', error)
        return Promise.reject(error)
    }
)