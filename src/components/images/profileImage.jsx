import { useMemo } from 'react'
import { createAvatar } from '@dicebear/core'
import { initials } from '@dicebear/collection'


const ProfileImage = ({ name='', imageURL }) => {

    const avatar = useMemo(() => {
        return createAvatar(initials, {
            seed: name,
            size: 110,
        }).toDataUriSync();
      }, [])

    return <img src={imageURL ? imageURL : avatar} alt="avatar" />
}

export default ProfileImage