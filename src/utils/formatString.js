export const capitalizeFirstLetter = str => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

export const formatPatientName = (patient) => {
  return `${patient?.patient?.firstName} ${patient?.patient?.lastName ? patient?.patient?.lastName : ''}`
}

export const formatBooleanValue = (value) => {

  if(typeof value !== 'boolean') {
      return 'Not Registered'
  } else if(value === true) {
      return 'Yes'
  } else if(value === false) {
      return 'No'
  }
}

export const formatStringToBoolean = (value) => {
  let boolValue = ''

  if(value === 'YES') {
    boolValue = true 
  } else if(value === 'NO') {
    boolValue = false
  }

  return boolValue
}

export const textShortener = (text, limit) => {

  let output = ''

  if(text.length < limit) {
    return text
  }

  for(let i=0;i<text.length;i++) {
    if(i > limit) {
      break
    }
    output += text[i]
  }

  return output + '...'
}