import StarIcon from '@mui/icons-material/Star'
import StarBorderIcon from '@mui/icons-material/StarBorder'

const Star = ({ size, isBright }) => {

    return isBright ? <StarIcon style={{ fontSize: size, color: '#FFDF00' }} /> : <StarBorderIcon style={{ fontSize: size, color: '#FFDF00' }} />
}

export default Star