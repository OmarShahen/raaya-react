import { formatValue } from "../../utils/formatValue"
import CheckIcon from '@mui/icons-material/Check'
import CloseIcon from '@mui/icons-material/Close'

const Checker = ({ value }) => {

    return <span>
        {
            formatValue(value) === 'Not Registered' ?
            'غير مسجل'
            :
            formatValue(value) ? <CheckIcon htmlColor="green" /> : <CloseIcon htmlColor="red" />
        }
    </span>
}

export default Checker