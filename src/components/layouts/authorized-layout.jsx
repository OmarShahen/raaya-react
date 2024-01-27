import { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

const AuthorizedLayout = () => {

    const user = useSelector(state => state.user.user)

    const navigate = useNavigate()

    useEffect(() => {
        if(!user.isLogged) {
            navigate('/auth/login?back=true')
        }
    }, [])

    return <Outlet />
}

export default AuthorizedLayout