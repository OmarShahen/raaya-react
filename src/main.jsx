import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { Provider } from 'react-redux'
import { store } from './redux/store'
import { HMSRoomProvider } from '@100mslive/react-sdk'
import { GoogleOAuthProvider } from '@react-oauth/google';
import { config } from '../src/config/config.js'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store} >
      <HMSRoomProvider>
        <GoogleOAuthProvider clientId={config.GOOGLE_CLIENT_ID}>
          <App />
        </GoogleOAuthProvider>
      </HMSRoomProvider>
    </Provider>
  </React.StrictMode>,
)
