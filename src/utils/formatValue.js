
export const formatValue = (value) => {

    if(typeof value !== 'boolean') {
        return 'Not Registered'
    } else if(value === true) {
        return true
    } else if(value === false) {
        return false
    }
}