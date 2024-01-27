import { TailSpin } from 'react-loader-spinner'

const Loading = ({ width='25', height='25', color='#0E72ED' }) => {

    return <TailSpin
    height={height}
    width={width}
    color={color}
    />
}

export default Loading