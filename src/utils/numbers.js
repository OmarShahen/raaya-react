export const formatNumber = (number) => {
    return new Intl.NumberFormat().format(number)
}

export const formatMoney = (number, lang='en') => {
    return new Intl.NumberFormat(lang, { style: 'currency', currency: 'EGP' }).format(number)
}

export const toIndiaDigits = (number) => {
    var id= ['۰','۱','۲','۳','۴','۵','۶','۷','۸','۹'];
    return number.replace(/[0-9]/g, (w) => {
     return id[+w]
    })
}

export const formatToPercentage = (value, total) => {
    return ((value / total) * 100).toFixed(2)
}
