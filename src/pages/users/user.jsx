import { useState, useEffect } from 'react'
import './user.css'
import { useSelector } from 'react-redux'
import { serverRequest } from '../../components/API/request'
import { format } from 'date-fns'
import { toast } from 'react-hot-toast'
import Loading from '../../components/loading/loading'
import CardImage from '../../components/images/image'
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined'
import { projectStorage } from '../../../firebase/config'
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'


const UserPage = () => {

    const user = useSelector(state => state.user.user)

    const [isLoading, setIsLoading] = useState(false)
    const [isBankInfoLoading, setIsBankInfoLoading] = useState(false)
    const [isMobileWalletInfoLoading, setIsMobileWalletInfoLoading] = useState(false)
    const [isProfileLoading, setIsProfileLoading] = useState(true)
    
    const [name, setName] = useState()
    const [email, setEmail] = useState()
    const [phone, setPhone] = useState()
    const [dateOfBirth, setDateOfBirth] = useState()
    const [gender, setGender] = useState()

    const [title, setTitle] = useState()
    const [description, setDescription] = useState()
    const [speciality, setSpeciality] = useState()
    const [specialties, setSpecialties] = useState([])
    const [subspecialties, setSubspecialties] = useState([])
    const [userSubspeciality, setUserSubspeciality] = useState([])

    const [accountNumber, setAccountNumber] = useState()
    const [accountHolderName, setAccountHolderName] = useState()
    const [bankName, setBankName] = useState()

    const [accountNumberError, setAccountNumberError] = useState()
    const [accountHolderNameError, setAccountHolderNameError] = useState()
    const [bankNameError, setBankNameError] = useState()

    const [walletNumber, setWalletNumber] = useState()
    const [walletNumberError, setWalletNumberError] = useState()

    const [titleError, setTitleError] = useState()
    const [descriptionError, setDescriptionError] = useState()
    const [specialityError, setSpecialityError] = useState([])
    const [subspecialityError, setSubspecialityError] = useState()
    const [halfHourPrice, setHalfHourPrice] = useState()
    const [hourPrice, setHourPrice] = useState()
    const [imageURL, setImageURL] = useState()
    const [progresspercent, setProgresspercent] = useState(0)

    const [isImageUploading, setIsImageUploading] = useState(false)

    const [imageError, setImageError] = useState()
    const [nameError, setNameError] = useState()
    const [phoneError, setPhoneError] = useState()
    const [dateOfBirthError, setDateOfBirthError] = useState()
    const [genderError, setGenderError] = useState()
    const [halfHourPriceError, setHalfHourPriceError] = useState()
    const [hourPriceError, setHourPriceError] = useState()

    //useEffect(() => scroll(0, 0), [])

    useEffect(() => {
        serverRequest.get(`/v1/users/${user._id}`)
        .then(response => {
            setIsProfileLoading(false)
            const user = response.data.user
            setName(user.firstName)
            setEmail(user.email)
            setPhone(user.phone)
            setGender(user.gender)
            user.dateOfBirth ? setDateOfBirth(format(new Date(user.dateOfBirth), 'yyyy-MM-dd')) : null
            setTitle(user.title)
            setDescription(user.description)
            setSpeciality(user?.speciality[0]._id)
            setUserSubspeciality(user?.subSpeciality)
            setImageURL(user?.profileImageURL)

            if(user.pricing) {
                const halfPricingList = user.pricing.filter(price => price.duration === 30)
                const fullPricingList = user.pricing.filter(price => price.duration === 60)

                halfPricingList.length !== 0 ? setHalfHourPrice(halfPricingList[0].price) : null
                fullPricingList.length !== 0 ? setHourPrice(fullPricingList[0].price) : null
            }

            if(user?.paymentInfo?.bankAccount) {
                setBankName(user?.paymentInfo?.bankAccount?.bankName)
                setAccountHolderName(user?.paymentInfo?.bankAccount?.accountHolderName)
                setAccountNumber(user?.paymentInfo?.bankAccount?.accountNumber)
            }

            if(user?.paymentInfo?.mobileWallet) {
                setWalletNumber(user?.paymentInfo?.mobileWallet?.walletNumber)
            }

        })
        .catch(error => {
            setIsProfileLoading(false)
            console.error(error)
        })
    }, [])

    useEffect(() => {
        serverRequest.get('/v1/specialities')
        .then(response => {
            setSpecialties(response.data.specialities)
        })
        .catch(error => {
            console.error(error)
        })
    }, [])

    useEffect(() => {

        if(!speciality) {
            return
        }

        serverRequest.get(`/v1/specialities/${speciality}/sub-specialities`)
        .then(response => {
            setSubspecialties(response.data.specialities)
        })
        .catch(error => {
            console.error(error)
            toast.error(error?.response?.data?.message, { duration: 3000, position: 'top-right' })
        })
    }, [speciality])

    const handleUpdate = () => {

        const type = user.type

        if(!name) return setNameError('Name is required')

        if(!phone) return setPhoneError('Phone is required')

        if(!dateOfBirth) return setDateOfBirthError('Date of birth is required')

        if(!gender) return setGenderError('Gender is required')

        if(type === 'EXPERT' && !title) return setTitleError('Title is required')

        if(type === 'EXPERT' && !description) return setDescriptionError('Description is required')

        if(type === 'EXPERT' && !speciality) return setSpecialityError('Speciality is required')

        if(type === 'EXPERT' && !halfHourPrice) return setHalfHourPriceError('30 min duration price is required')

        if(type === 'EXPERT' && !hourPrice) return setHourPriceError('60 min duration price is required')

        const updateData = {
            firstName: name,
            phone: Number.parseInt(phone),
            dateOfBirth,
            gender,
            title,
            description,
            speciality: [speciality],
            subSpeciality: userSubspeciality.map(special => special._id),
            pricing: [
                {
                    duration: 30,
                    price: Number.parseInt(halfHourPrice)
                },
                {
                    duration: 60,
                    price: Number.parseInt(hourPrice)
                }
            ]
        }

        setIsLoading(true)
        serverRequest.put(`/v1/users/${user._id}`, updateData)
        .then(response => {
            setIsLoading(false)
            toast.success(response.data.message, { duration: 3000, position: 'top-right' })
        })
        .catch(error => {
            setIsLoading(false)
            console.error(error)
            toast.error(error?.response?.data?.message, { duration: 3000, position: 'top-right' })
        })
    }

    const handleImageUpload = (e) => {
        e.preventDefault()

        const file = e.target?.files[0]

        if(!file) return
        
        setIsImageUploading(true)

        const storage = getStorage()
        const storageRef = ref(storage, `/profile-images/${user._id}/${file.name}`)
        const uploadTask = uploadBytesResumable(storageRef, file)

        uploadTask.on("state_changed",
        (snapshot) => {
            const progress =
            Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
            setProgresspercent(progress);
        },
        (error) => {
            alert(error);
            setIsImageUploading(false)
        },
        () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setImageURL(downloadURL)

            serverRequest.patch(`/v1/users/${user._id}/profile-image`, { profileImageURL: downloadURL })
            .then(response => {
                setIsImageUploading(false)
                toast.success(response.data.message, { duration: 3000, position: 'top-right' })
            })
            .catch(error => {
                console.error(error)
                toast.error(error?.response?.data?.message, { duration: 3000, position: 'top-right' })
            })
        })
        }
    )

    }

    const handleBankInfo = () => {

        if(!bankName) return setBankNameError('Bank name is required')

        if(!accountHolderName) return setAccountHolderNameError('Account holder name is required')

        if(!accountNumber) return setAccountNumberError('Account number is required')

        const bankInfoData = { bankName, accountHolderName, accountNumber: Number.parseInt(accountNumber) }

        setIsBankInfoLoading(true)
        serverRequest.patch(`/v1/experts/${user._id}/bank-info`, bankInfoData)
        .then(response => {
            setIsBankInfoLoading(false)
            toast.success(response.data.message, { duration: 3000, position: 'top-right' })
        })
        .catch(error => {
            setIsBankInfoLoading(false)
            console.error(error)
            toast.error(error?.response?.data?.message, { duration: 3000, position: 'top-right' })
        })

    }

    const handleMobileWalletInfo = () => {

        if(!walletNumber) return setWalletNumberError('Wallet number is required')

        const mobileWalletData = { walletNumber }

        setIsMobileWalletInfoLoading(true)
        serverRequest.patch(`/v1/experts/${user._id}/mobile-wallet`, mobileWalletData)
        .then(response => {
            setIsMobileWalletInfoLoading(false)
            toast.success(response.data.message, { duration: 3000, position: 'top-right' })
        })
        .catch(error => {
            setIsMobileWalletInfoLoading(false)
            console.error(error)

            if(error?.response?.data?.field === 'walletNumber') return setWalletNumberError(error?.response?.data?.message)

            toast.error(error?.response?.data?.message, { duration: 3000, position: 'top-right' })
        })

    }

    return <div>
        {
            isProfileLoading ?
            <div className="loading-page-container">
                <Loading width={50} height={50} />
            </div>
            :
            <div className="user-profile-page-container">
            <div>
                <div className="styled-container">
                    <h2 className="no-space">Account Details</h2>
                    <div className="profile-form-container">
                    <div className="form-input-container">
                        <label className="bold-text">Profile Image</label>
                        <div className="flex-space-between">
                            <CardImage name={user.firstName} imageURL={imageURL} borderRadius={50} width={'4rem'} height={'4rem'} />
                            <input 
                            type="file"
                            accept="image/*"
                            id="profile-image-input"
                            onChange={handleImageUpload}
                            />
                            <div>
                            <label for="profile-image-input" className="normal-button main-color-bg white-text flex-space-between-center">
                                <FileUploadOutlinedIcon />
                                Upload Image
                            </label>
                            </div>
                        </div>
                        {
                            !isImageUploading ?
                            null
                            :
                            <div className="outerbar">
                                <progress className="full-width main-color-bg" max="100" value={progresspercent} />
                            </div>
                        }
                        <span className="red-text">{imageError}</span>
                    </div>
                    <div className="form-input-container">
                        <label className="bold-text">Name</label>
                        <input 
                        type="text" 
                        className="form-input" 
                        placeholder='Username' 
                        value={name}
                        onClick={() => setNameError()}
                        onChange={e => setName(e.target.value)}
                        />
                        <span className="red-text">{nameError}</span>
                    </div>
                    <div className="form-input-container">
                        <label className="bold-text">Email</label>
                        <input 
                        type="email" 
                        disabled
                        className="form-input" 
                        placeholder='Email' 
                        value={email}
                        />
                    </div>
                    <div className="form-input-container">
                        <label className="bold-text">Phone</label>
                        <input 
                        type="tel" 
                        className="form-input" 
                        placeholder='Phone' 
                        value={phone}
                        onClick={() => setPhoneError()}
                        onChange={e => setPhone(e.target.value)}
                        />
                        <span className="red-text">{phoneError}</span>
                    </div>
                    <div className="form-input-container">
                        <label className="bold-text">Birthday</label>
                        <input 
                        type="date" 
                        className="form-input" 
                        value={dateOfBirth}
                        onClick={() => setDateOfBirthError()}
                        onChange={e => setDateOfBirth(e.target.value)}
                        />
                        <span className="red-text">{dateOfBirthError}</span>
                    </div>
                    <div className="form-input-container">
                        <label className="bold-text">Gender</label>
                        <select className="form-select">
                            <option selected disabled>Select Gender</option>
                            {['MALE', 'FEMALE'].map((tempGender, index) => {
                                if(tempGender === gender) {
                                    return <option key={index} value={tempGender} selected>{tempGender}</option>
                                }
                                return <option key={index} value={tempGender}>{tempGender}</option>
                            })}
                        </select>
                        <span className="red-text">{genderError}</span>
                    </div>
                    
                    </div>
                    <div className="flex-end margin-top-1">
                        {
                            isLoading ?
                            <Loading />
                            :
                            <button 
                            className="normal-button main-color-bg white-text"
                            onClick={() => handleUpdate()}
                            >
                                Update
                            </button>
                        }
                        
                    </div>
                </div>
            </div>
            {
                user.type === 'EXPERT' ?
                <div>
                    <div className="styled-container">
                        <h2 className="no-space">Expert Account</h2>
                        <div className="profile-form-container">
                        <div className="form-input-container">
                            <label className="bold-text">Title</label>
                            <input 
                            type="text" 
                            className="form-input" 
                            placeholder='Title' 
                            value={title}
                            onClick={() => setTitleError()}
                            onChange={e => setTitle(e.target.value)}
                            />
                            <span className="red-text">{titleError}</span>
                        </div>
                        <div className="form-input-container">
                            <label className="bold-text">Speciality</label>
                            <select 
                            className="form-select" 
                            onClick={() => setSpecialityError()}
                            onChange={e => setSpeciality(e.target.value)}
                            >
                                <option selected disabled>Select speciality</option>
                                {specialties?.map(special => {
                                    if(speciality === special._id) {
                                        return <option selected key={special._id} value={special._id}>{special.name}</option>
                                    }
                                    return <option key={special._id} value={special._id}>{special.name}</option>
                                }
                                )}
                            </select>
                            <span className="red-text">{specialityError}</span>
                        </div>
                        <div>
                        <div className="form-input-container">
                            <label className="bold-text">Subspeciality</label>
                            <select 
                            className="form-select" 
                            onClick={() => setSubspecialityError()}
                            onChange={e => {

                                const registeredSpecialityList = userSubspeciality.filter(special => special._id === e.target.value)
                                if(registeredSpecialityList.length !== 0) {
                                    return
                                }

                                const newSpecialityList = subspecialties.filter(special => special._id === e.target.value)
                                const newSpeciality = newSpecialityList[0]

                                setUserSubspeciality([...userSubspeciality, newSpeciality])
                            }}
                            >
                                <option selected disabled>Select subspeciality</option>
                                {subspecialties?.map(special => {
                                    return <option key={special._id} value={special._id}>{special.name}</option>
                                }
                                )}
                            </select>
                            <span className="red-text">{subspecialityError}</span>
                        </div>
                        {
                            userSubspeciality.length !== 0 ?
                            <div className="tags-container margin-top-1">
                                {userSubspeciality.map(special => <span
                                key={special._id}
                                className="main-tag"
                                onClick={() => {
                                    setUserSubspeciality(userSubspeciality.filter(subspecial => subspecial._id !== special._id))
                                }}
                                >
                                    <span>{special?.name}</span>
                                </span>)} 
                            </div>
                            :
                            null
                        }
                        </div>
                        <div className="form-input-container margin-top-1">
                            <label className="bold-text">30 minutes duration price</label>
                            <input 
                            type="number" 
                            className="form-input" 
                            placeholder='30 min duration price' 
                            value={halfHourPrice}
                            onClick={() => setHalfHourPriceError()}
                            onChange={e => setHalfHourPrice(e.target.value)}
                            />
                            <span className="red-text">{halfHourPriceError}</span>
                        </div>
                        <div className="form-input-container margin-top-1">
                            <label className="bold-text">60 minutes duration price</label>
                            <input 
                            type="number" 
                            className="form-input" 
                            placeholder='60 min duration price' 
                            value={hourPrice}
                            onClick={() => setHourPriceError()}
                            onChange={e => setHourPrice(e.target.value)}
                            />
                            <span className="red-text">{hourPriceError}</span>
                        </div>
                        <div className="form-input-container">
                            <label className="bold-text">Description</label>
                            <textarea 
                            className="form-textarea" 
                            placeholder='Description' 
                            style={{ height: '15rem' }}
                            value={description}
                            onClick={() => setDescriptionError()}
                            onChange={e => setDescription(e.target.value)}
                            >
                            </textarea>
                            <span className="red-text">{descriptionError}</span>
                        </div>
                        </div>
                        <div className="flex-end">
                            {
                                isLoading ?
                                <Loading />
                                :
                                <button 
                                className="normal-button main-color-bg white-text"
                                onClick={() => handleUpdate()}
                                >
                                    Update
                                </button>
                            }
                            
                        </div>
                    </div>
                </div>
                :
                null
            }
            {
                user.type === 'EXPERT' ?
                <div>
                    <div className="styled-container">
                        <h2 className="no-space">Bank Account Information</h2>
                        <div className="profile-form-container">
                        <div className="form-input-container">
                            <label className="bold-text">Bank Name</label>
                            <input 
                            type="text" 
                            className="form-input" 
                            placeholder='Bank Name' 
                            value={bankName}
                            onClick={() => setBankNameError()}
                            onChange={e => setBankName(e.target.value)}
                            />
                            <span className="red-text">{bankNameError}</span>
                        </div>
                        <div className="form-input-container">
                            <label className="bold-text">Account Holder Name</label>
                            <input 
                            type="text" 
                            className="form-input" 
                            placeholder='Account Holder Name' 
                            value={accountHolderName}
                            onClick={() => setAccountHolderNameError()}
                            onChange={e => setAccountHolderName(e.target.value)}
                            />
                            <span className="red-text">{accountHolderNameError}</span>
                        </div>
                        <div className="form-input-container">
                            <label className="bold-text">Account Number</label>
                            <input 
                            type="number" 
                            className="form-input" 
                            placeholder='Account Number' 
                            value={accountNumber}
                            onClick={() => setAccountNumberError()}
                            onChange={e => setAccountNumber(e.target.value)}
                            />
                            <span className="red-text">{accountNumberError}</span>
                        </div>
                        </div>
                        <div className="flex-end">
                            {
                                isBankInfoLoading ?
                                <Loading />
                                :
                                <button 
                                className="normal-button main-color-bg white-text"
                                onClick={() => handleBankInfo()}
                                >
                                    Update
                                </button>
                            }
                            
                        </div>
                    </div>
                </div>
                :
                null
            }
            {
                user.type === 'EXPERT' ?
                <div>
                    <div className="styled-container">
                        <h2 className="no-space">Mobile Wallet Information</h2>
                        <div className="profile-form-container">
                        <div className="form-input-container">
                            <label className="bold-text">Wallet Number</label>
                            <input 
                            type="tel" 
                            className="form-input" 
                            placeholder='Wallet Number' 
                            value={walletNumber}
                            onClick={() => setWalletNumberError()}
                            onChange={e => setWalletNumber(e.target.value)}
                            />
                            <span className="red-text">{walletNumberError}</span>
                        </div>
                        </div>
                        <div className="flex-end">
                            {
                                isMobileWalletInfoLoading ?
                                <Loading />
                                :
                                <button 
                                className="normal-button main-color-bg white-text"
                                onClick={() => handleMobileWalletInfo()}
                                >
                                    Update
                                </button>
                            }
                            
                        </div>
                    </div>
                </div>
                :
                null
            }
        </div>
        }
        
    </div>
}

export default UserPage