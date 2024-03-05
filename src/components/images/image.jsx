import { useMemo } from 'react'
import { createAvatar } from '@dicebear/core'
import { initials } from '@dicebear/collection'
import './card-image.css'
import CircleIcon from '@mui/icons-material/Circle'


const CardImage = ({ name='', imageURL, borderRadius, width, height, isOnline }) => {

    const avatar = useMemo(() => {
        return createAvatar(initials, {
            seed: name,
            size: 110,
        }).toDataUriSync();
      }, [])

    return <div className="expert-profile-image-container">
        <img src={imageURL ? imageURL : avatar} alt="avatar" style={{ borderRadius, width, height }} />
        {
            isOnline ?
            <span><CircleIcon style={{ color: '#62C936' }} /></span>
            :
            null
        }
    </div>
}

export default CardImage