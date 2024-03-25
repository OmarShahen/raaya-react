
export const formatValue = (value) => {

    if(typeof value !== 'boolean') {
        return 'Not Registered'
    } else if(value === true) {
        return true
    } else if(value === false) {
        return false
    }
}

export const formatServiceInternationalPrice = (service, currencyPrice) => {

    const price = service.internationalPrice ? service.internationalPrice : service.price

    return price / currencyPrice
}