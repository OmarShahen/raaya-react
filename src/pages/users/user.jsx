import { useState, useEffect } from 'react'
import './user.css'
import { useSelector, useDispatch } from 'react-redux'
import { serverRequest } from '../../components/API/request'
import { format } from 'date-fns'
import { toast } from 'react-hot-toast'
import Loading from '../../components/loading/loading'
import CardImage from '../../components/images/image'
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined'
import { projectStorage } from '../../../firebase/config'
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import { capitalizeFirstLetter } from '../../utils/formatString'
import { NavLink } from 'react-router-dom'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import Switch from "react-switch"
import axios from 'axios'
import { setUserInternationalDetails } from '../../redux/slices/userSlice'


const UserPage = () => {

    const dispatch = useDispatch()
    const user = useSelector(state => state.user.user)

    const [reload, setReload] = useState(1)

    const [isLoading, setIsLoading] = useState(false)
    const [isBankInfoLoading, setIsBankInfoLoading] = useState(false)
    const [isMobileWalletInfoLoading, setIsMobileWalletInfoLoading] = useState(false)
    const [isProfileLoading, setIsProfileLoading] = useState(true)

    const [profileCompletionPercentage, setProfileCompletionPercentage] = useState(0)
    
    const [name, setName] = useState()
    const [email, setEmail] = useState()
    const [phone, setPhone] = useState()
    const [dateOfBirth, setDateOfBirth] = useState()
    const [gender, setGender] = useState()
    const [countries, setCountries] = useState([])
    const [contriesNames, setCountriesNames] = useState([])
    const [nationality, setNationality] = useState()
    const [nationCode, setNationCode] = useState()
    const [currencyName, setCurrencyName] = useState('POUND')
    const [currency, setCurrency] = useState('EGP')

    const [title, setTitle] = useState()
    const [meetingLink, setMeetingLink] = useState()
    const [description, setDescription] = useState()
    const [speciality, setSpeciality] = useState()
    const [specialties, setSpecialties] = useState([])
    const [subspecialties, setSubspecialties] = useState([])
    const [userSubspeciality, setUserSubspeciality] = useState([])
    const [isAcceptPromoCodes, setIsAcceptPromoCodes] = useState()
    const [isOnline, setIsOnline] = useState(false)
    const [isDeactivated, setIsDeactivated] = useState(false)
    const [isShow, setIsShow] = useState(false)

    const [languages, setLanguages] = useState([])
    const [languagesError, setLanguagesError] = useState()

    const [accountNumber, setAccountNumber] = useState()
    const [accountHolderName, setAccountHolderName] = useState()
    const [bankName, setBankName] = useState()

    const [accountNumberError, setAccountNumberError] = useState()
    const [accountHolderNameError, setAccountHolderNameError] = useState()
    const [bankNameError, setBankNameError] = useState()

    const [walletNumber, setWalletNumber] = useState()
    const [walletNumberError, setWalletNumberError] = useState()

    const [titleError, setTitleError] = useState()
    const [meetingLinkError, setMeetingLinkError] = useState()
    const [descriptionError, setDescriptionError] = useState()
    const [specialityError, setSpecialityError] = useState([])
    const [subspecialityError, setSubspecialityError] = useState()
    const [imageURL, setImageURL] = useState()
    const [progresspercent, setProgresspercent] = useState(0)
    const [promoCodesError, setPromoCodesError] = useState()

    const [isImageUploading, setIsImageUploading] = useState(false)

    const [imageError] = useState()
    const [nameError, setNameError] = useState()
    const [phoneError, setPhoneError] = useState()
    const [dateOfBirthError, setDateOfBirthError] = useState()
    const [genderError, setGenderError] = useState()
    const [countriesError, setCountriesError] = useState()

    const [missingFields, setMissingFields] = useState([])

    useEffect(() => {
        scroll(0, 0)
        document.title = 'User Profile'
    }, [])

    const getMissingFieldsMessages = (fields) => {

        let messages = []

        const fieldsMessages = [
            { field: 'profileImageURL', message: 'Profile image is missing' },
            { field: 'name', message: 'Name is missing' },
            { field: 'email', message: 'Email is missing' },
            { field: 'phone', message: 'Phone is missing' },
            { field: 'dateOfBirth', message: 'Birthday is missing' },
            { field: 'gender', message: 'Gender is missing' },
            { field: 'title', message: 'Title is missing' },
            { field: 'description', message: 'Description is missing' },
            { field: 'speciality', message: 'Speciality is missing' },
            { field: 'subSpeciality', message: 'Subspeciality is missing' },
            { field: 'pricing', message: 'Pricing is missing' },
            { field: 'paymentInfo', message: 'Payment Information is missing' },
            { field: 'languages', message: 'Spoken languages is missing' },
        ]

        for(let i=0;i<fields.length;i++) {
            for(let j=0;j<fieldsMessages.length;j++) {
                if(fields[i] === fieldsMessages[j].field) {
                    messages.push(fieldsMessages[j].message)
                }
            }
        }

        return messages
    }

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
            setMeetingLink(user.meetingLink)
            setDescription(user.description)
            if(user?.speciality.length !== 0) {
                setSpeciality(user?.speciality[0]._id)
            }
            setUserSubspeciality(user?.subSpeciality)
            setImageURL(user?.profileImageURL)
            setIsAcceptPromoCodes(user?.isAcceptPromoCodes)
            setIsOnline(user.isOnline)
            setIsDeactivated(user.isDeactivated)
            setIsShow(user.isShow)

            setNationality(user.nationality)
            setNationCode(user.nationCode)
            setCurrency(user.currency)
            setCurrencyName(user.currencyName)

            if(user.languages) {
                setLanguages(user?.languages)
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

    useEffect(() => {
        serverRequest.get(`/v1/experts/${user._id}/profile-completion-percentage`)
        .then(response => {
            setProfileCompletionPercentage(response.data.profileCompletionPercentage?.completionPercentage)
            const missingFields = response.data.profileCompletionPercentage?.missingFields
            setMissingFields(getMissingFieldsMessages(missingFields))
        })
        .catch(error => {
            console.error(error)
            toast.error(error?.response?.data?.message, { duration: 3000, position: 'top-right' })
        })
    }, [reload])

    useEffect(() => {
        axios.get('https://restcountries.com/v3.1/all')
        .then(response => {
            let countries = response.data.map(country => country.name.common)
            countries = countries.filter(country => country !== 'Israel')
            countries.sort()
            setCountries(response.data)
            setCountriesNames(countries)
        })
        .catch(error => {
            console.error(error)
        })
    }, [])

    const stripHTMLTags = (htmlString) => {
        return htmlString.replace(/<[^>]*>/g, '')
    }


    const handleUpdateUserMainData = () => {

        if(!name) return setNameError('Name is required')

        if(!phone) return setPhoneError('Phone is required')

        if(!dateOfBirth) return setDateOfBirthError('Date of birth is required')

        if(!gender) return setGenderError('Gender is required')

        if(!nationality) return setCountriesError('Country is required')

        const updateData = {
            firstName: name,
            phone: Number.parseInt(phone),
            dateOfBirth,
            gender,
            nationality,
            nationCode,
            currency,
            currencyName
        }

        setIsLoading(true)
        serverRequest.put(`/v1/users/${user._id}`, updateData)
        .then(response => {
            setIsLoading(false)
            setReload(reload + 1)
            const userData = response.data.user
            const userInternationalData = {
                nationality: userData.nationality,
                nationCode: userData.nationCode,
                currency: userData.currency,
                currencyName: userData.currencyName
            }
            dispatch(setUserInternationalDetails(userInternationalData))
            toast.success(response.data.message, { duration: 3000, position: 'top-right' })
        })
        .catch(error => {
            setIsLoading(false)
            console.error(error)
            try {
                const errorResponse = error.response.data

                if(errorResponse.field === 'firstName') return setNameError(errorResponse.message)

                if(errorResponse.field === 'phone') return setPhoneError(errorResponse.message)

                if(errorResponse.field === 'dateOfBirth') return setDateOfBirthError(errorResponse.message)

                if(errorResponse.field === 'gender') return setGenderError(errorResponse.message)

                if(errorResponse.field === 'nationality') return setCountriesError(errorResponse.message)

                toast.error(error?.response?.data?.message, { duration: 3000, position: 'top-right' })
            } catch(error) {}
        })
    }

    const handleUpdateExpertInfo = () => {

        if(!title) return setTitleError('Title is required')

        if(!stripHTMLTags(description)) return setDescriptionError('Description is required')

        if(!speciality) return setSpecialityError('Speciality is required')

        if(userSubspeciality.length === 0) return setSubspecialityError('Speciality is required')

        if(languages.length === 0) return setLanguagesError('Languages is required')

        if(!meetingLink) return setMeetingLinkError('Meeting link is required')

        const updateData = {
            title,
            description,
            speciality: [speciality],
            subSpeciality: userSubspeciality.map(special => special._id),
            languages,
            isAcceptPromoCodes,
            meetingLink
        }

        setIsLoading(true)
        serverRequest.put(`/v1/experts/${user._id}`, updateData)
        .then(response => {
            setIsLoading(false)
            setReload(reload + 1)
            toast.success(response.data.message, { duration: 3000, position: 'top-right' })
        })
        .catch(error => {
            setIsLoading(false)
            console.error(error)
            try {
                const errorResponse = error.response.data

                if(errorResponse.field === 'title') return setTitleError(errorResponse.message)

                if(errorResponse.field === 'speciality') return setSpecialityError(errorResponse.message)

                if(errorResponse.field === 'subSpeciality') return setSubspecialityError(errorResponse.message)

                if(errorResponse.field === 'languages') return setLanguagesError(errorResponse.message)

                if(errorResponse.field === 'isAcceptPromoCodes') return setPromoCodesError(errorResponse.message)

                if(errorResponse.field === 'meetingLink') return setMeetingLinkError(errorResponse.message)

                if(errorResponse.field === 'description') return setDescriptionError(errorResponse.message)

                toast.error(error?.response?.data?.message, { duration: 3000, position: 'top-right' })
            } catch(error) {}
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
                setReload(reload + 1)
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
            setReload(reload + 1)
            toast.success(response.data.message, { duration: 3000, position: 'top-right' })
        })
        .catch(error => {
            setIsBankInfoLoading(false)
            console.error(error)
            try {
                const errorResponse = error.response.data

                if(errorResponse.field === 'bankName') return setBankNameError(errorResponse.message)

                if(errorResponse.field === 'accountHolderName') return setAccountHolderNameError(errorResponse.message)

                if(errorResponse.field === 'accountNumber') return setAccountNumberError(errorResponse.message)

                toast.error(error?.response?.data?.message, { duration: 3000, position: 'top-right' })
            } catch(error) {}
        })

    }

    const handleMobileWalletInfo = () => {

        if(!walletNumber) return setWalletNumberError('Wallet number is required')

        const mobileWalletData = { walletNumber }

        setIsMobileWalletInfoLoading(true)
        serverRequest.patch(`/v1/experts/${user._id}/mobile-wallet`, mobileWalletData)
        .then(response => {
            setIsMobileWalletInfoLoading(false)
            setReload(reload + 1)
            toast.success(response.data.message, { duration: 3000, position: 'top-right' })
        })
        .catch(error => {
            setIsMobileWalletInfoLoading(false)
            console.error(error)

            if(error?.response?.data?.field === 'walletNumber') return setWalletNumberError(error?.response?.data?.message)

            toast.error(error?.response?.data?.message, { duration: 3000, position: 'top-right' })
        })

    }

    const updateOnlineStatus = (isOnline) => {
        serverRequest.patch(`/v1/experts/${user._id}/online`, { isOnline })
        .then(response => {
            setIsOnline(response.data.user.isOnline)
        })
        .catch(error => {
            console.error(error)
            toast.error(error?.response?.data?.message, { duration: 3000, position: 'top-right' })
        })
    }

    const updateAccountActivity = (isDeactivated) => {
        serverRequest.patch(`/v1/users/${user._id}/activation`, { isDeactivated })
        .then(response => {
            setIsDeactivated(response.data.user.isDeactivated)
        })
        .catch(error => {
            console.error(error)
            toast.error(error?.response?.data?.message, { duration: 3000, position: 'top-right' })
        })
    }

    const updateAccountVisibility = (isShow) => {
        serverRequest.patch(`/v1/users/${user._id}/visibility`, { isShow })
        .then(response => {
            setIsShow(response.data.user.isShow)
        })
        .catch(error => {
            console.error(error)
            toast.error(error?.response?.data?.message, { duration: 3000, position: 'top-right' })
        })
    }

    const expertLanguages = [
        {
            code: "ar",
            name: "Arabic"
        },
        {
            code: "en",
            name: "English"
        }
    ]

    return <div className="user-profile-page-layout">
        <div>
            <div className="styled-container hide-mobile">
                <h6 className="no-space large-font">On This Page</h6>
                <div>
                    <ul className="user-profile-navigation-links">
                        <li>
                            <a href="#account-details" className="fadded-black-text">Account Details</a>
                        </li>
                        {
                            user.type === 'EXPERT' ?
                            <li>
                                <a href="#expert-details" className="fadded-black-text">Expert Details</a>
                            </li>
                            :
                            null
                        }
                        {
                            user.type === 'EXPERT' ?
                            <li>
                                <a href="#activity-account" className="fadded-black-text">Activity and Visibility</a>
                            </li>
                            :
                            null
                        }
                        {
                            user.type === 'EXPERT' ?
                            <li>
                                <a href="#bank-account" className="fadded-black-text">Bank Account</a>
                            </li>
                            :
                            null
                        }
                        {
                            user.type === 'EXPERT' ?
                            <li>
                                <a href="#mobile-wallet" className="fadded-black-text">Mobile Wallet</a>
                            </li>
                            :
                            null
                        }
                        
                    </ul>
                </div>
            </div> 
            {
                user.type === 'EXPERT' ?
                <div className="styled-container margin-top-1">
                    <h6 className="no-space large-font">Expert Page URL</h6>
                    <div className="margin-top-1">
                        <strong className="main-color-text user-profile-link-container">
                            {`https://${window.location.hostname}/experts/${user._id}`}
                        </strong>
                    </div>
                    <div className="margin-top-1 flex-space-between">
                        <NavLink className="normal-button bold-text main-color-bg white-text center" to={`/experts/${user._id}`}>
                            View Profile
                        </NavLink>
                        <button 
                        className="normal-button main-color-text bold-text main-color-border"
                        onClick={() => {
                            navigator.clipboard.writeText(`https://${window.location.hostname}/experts/${user._id}`)
                            .then(() => toast.success('Copied to clipboard', { duration: 3000, position: 'top-right' }))
                            .catch(error => {
                                toast.error(error.message)
                            })
                        }}
                        >
                            Copy Link
                        </button>
                    </div>
                </div>
                :
                null
            }
            {
                user.type === 'EXPERT' ?
                <div className="styled-container margin-top-1">
                    <h6 className="no-space large-font">Online Status</h6>
                    <div className="margin-top-1">
                        <label>
                            <Switch onChange={() => updateOnlineStatus(!isOnline)} checked={isOnline} />
                        </label>
                    </div>
                </div>
                :
                null
            }
            {
                user.type === 'EXPERT' && profileCompletionPercentage ?
                <div className="styled-container margin-top-1">
                    <h6 className="no-space large-font">
                        Profile Setup
                    </h6>
                    <div className="margin-top-1">
                        <strong className="main-color-text">
                            {
                                profileCompletionPercentage === 100 ?
                                `profile is ${profileCompletionPercentage}% complete`
                                :
                                `${100-profileCompletionPercentage}% to complete`
                            }
                        </strong>
                    </div>
                    <progress className="full-width main-color-bg" max="100" value={profileCompletionPercentage} />
                    <div className="user-profile-missing-fields">
                        <ul>
                            {missingFields.map(missingField => <li key={missingField}>{missingField}</li>)}
                        </ul>
                    </div>
                </div>
                :
                null
            }
        </div>
        {
            isProfileLoading ?
            <div className="loading-page-container styled-container">
                <Loading width={50} height={50} />
            </div>
            :
            <div className="user-profile-page-container">
            <div>
                <div id="account-details" className="styled-container">
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
                            <label 
                            for="profile-image-input" 
                            className="normal-button main-color-bg white-text flex-space-between-center">
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
                        <select 
                        className="form-select"
                        onClick={() => setGenderError()}
                        onChange={e => setGender(e.target.value)}
                        >
                            <option selected disabled>Select Gender</option>
                            {['MALE', 'FEMALE'].map((tempGender, index) => {
                                if(tempGender === gender) {
                                    return <option key={index} value={tempGender} selected>{capitalizeFirstLetter(tempGender)}</option>
                                }
                                return <option key={index} value={tempGender}>{capitalizeFirstLetter(tempGender)}</option>
                            })}
                        </select>
                        <span className="red-text">{genderError}</span>
                    </div>
                    <div className="form-input-container">
                        <label className="bold-text">Country</label>
                        <select
                        className="form-select"
                        onClick={() => setCountriesError()}
                        onChange={e => {
                            const countryName = e.target.value
                            const targetCountryList = countries.filter(country => country.name.common === countryName)
                            const targetCountry = targetCountryList[0]

                            const nationality = targetCountry.name.common.toUpperCase()
                            const nationCode = targetCountry.cca2

                            setNationality(nationality)
                            setNationCode(nationCode)
                            setCurrency(nationCode === 'EG' ? 'EGP' : 'USD')
                            setCurrencyName(nationCode === 'EG' ? 'POUND' : 'DOLLAR')

                        }}
                        >
                            <option disabled selected>Select Country</option>
                            {contriesNames.map((countryName, index) => {
                                if(countryName.toUpperCase() === nationality?.toUpperCase()) {
                                    return <option selected key={index} value={countryName}>{countryName}</option>
                                }
                                return <option key={index} value={countryName}>{countryName}</option>
                            })}
                        </select>
                        <span className="red">{countriesError}</span>
                    </div>
                    </div>
                    <div className="flex-end margin-top-1">
                        {
                            isLoading ?
                            <Loading />
                            :
                            <button 
                            className="normal-button main-color-bg white-text"
                            onClick={() => handleUpdateUserMainData()}
                            >
                                Update
                            </button>
                        }
                        
                    </div>
                </div>
            </div>
            {
                user.type === 'EXPERT' ?
                <div id="expert-details">
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
                            <div className="tags-container">
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
                        <div className="form-input-container">
                        <label className="bold-text">Spoken Languages</label>
                        <select 
                        className="form-select"
                        onClick={() => setLanguagesError()}
                        onChange={e => {
                            
                            const registeredLanguage = languages.filter(lang => lang.code === e.target.value)
                            if(registeredLanguage.length !== 0) {
                                return
                            }

                            const spokenLanguage = expertLanguages.filter(lang => lang.code === e.target.value)
                            setLanguages([...languages, ...spokenLanguage])

                        }}
                        >
                            <option selected disabled>Select Languages</option>
                            {expertLanguages.map(language => <option 
                            key={language.code} 
                            value={language.code}>
                                {language.name}
                            </option>)}
                        </select>
                        <span className="red-text">{languagesError}</span>
                        {
                            languages.length !== 0 ?
                            <div className="tags-container">
                                {languages.map(language => <span
                                key={language.code}
                                className="main-tag"
                                onClick={() => {
                                    setLanguages(languages.filter(tempLanguage => tempLanguage.code !== language.code))
                                }}
                                >
                                    <span>{language?.name}</span>
                                </span>)} 
                            </div>
                            :
                            null
                        }
                        </div>
                        </div>
                        <div className="form-input-container">
                            <label className="bold-text">Accept Coupons</label>
                            <Switch onChange={() => setIsAcceptPromoCodes(!isAcceptPromoCodes)} checked={isAcceptPromoCodes} />
                            <div>
                                <span className="red-text">{promoCodesError}</span>
                            </div>
                        </div>
                        <div className="form-input-container">
                            <label className="bold-text">Meeting Link</label>
                            <input 
                            type="url"
                            className="form-input"
                            onClick={() => setMeetingLinkError()}
                            onChange={e => setMeetingLink(e.target.value)}
                            value={meetingLink}
                            placeholder="Put Google Meet link or Zoom link for your sessions"
                            />
                            <span className="red-text">{meetingLinkError}</span>
                        </div>
                        <div className="margin-top-1 form-input-container" onClick={() => setDescriptionError()}>
                            <label className="bold-text">Description</label>
                            <ReactQuill 
                            theme="snow"
                            value={description}
                            onChange={setDescription}
                            />
                            <span className="red-text">{descriptionError}</span>
                        </div>
                        <div className="flex-end margin-top-1">
                            {
                                isLoading ?
                                <Loading />
                                :
                                <button 
                                className="normal-button main-color-bg white-text"
                                onClick={() => handleUpdateExpertInfo()}
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
                <div className="cards-2-list-wrapper">
                    <div id="activity-account">
                    <div className="styled-container">
                        <h2 className="no-space">Activity</h2>
                        <div className="cards-2-list-wrapper margin-top-1">
                            <div>
                                <label>
                                    <Switch onChange={() => updateAccountActivity(!isDeactivated)} checked={!isDeactivated} />
                                </label>
                            </div>
                        </div>
                    </div>
                    <div className="show-mobile margin-top-1"></div>
                    </div>
                    <div id="activity-account">
                    <div className="styled-container">
                        <h2 className="no-space">Visibility</h2>
                        <div className="cards-2-list-wrapper margin-top-1">
                            <div>
                                <label>
                                    <Switch onChange={() => updateAccountVisibility(!isShow)} checked={isShow} />
                                </label>
                            </div>
                        </div>
                    </div>
                    </div>
                </div>
                :
                null
            }
            {
                user.type === 'EXPERT' ?
                <div id="bank-account">
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
                <div id="mobile-wallet">
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
        <br />
    </div>
}

export default UserPage