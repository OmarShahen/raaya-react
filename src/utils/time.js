export const getTimeZone = () => Intl.DateTimeFormat().resolvedOptions().timeZone

export const formatHour = (hour) => {
    if(hour <= 12) {
        return hour
    }

    return hour - 12
}

export const formatTimeNumber = (time) => {
    const strTime = String(time)
    if(strTime.length > 1) {
        return String(time)
    }

    return '0' + strTime
}

export const getTimePeriod = (hour) => {
    return hour >= 12 ? 'PM' : 'AM'
}

export const integrateTimeToDate = (hours, minutes) => {
    const todayDate = new Date()
    todayDate.setHours(hours)
    todayDate.setMinutes(minutes)

    return todayDate
}

export const getTimeRange = (startTime, endTime, splitRange=30) => {

    const timeList = []
    let currentTime = new Date(startTime)
  
    while (currentTime <= endTime) {
      const hours = currentTime.getHours()
      const minutes = currentTime.getMinutes()
      const amOrPm = hours < 12 ? 'AM' : 'PM'
      const formattedHours = hours % 12 === 0 ? 12 : hours % 12
      const timeString = `${formattedHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${amOrPm}`
      timeList.push(timeString)
  
      currentTime.setTime(currentTime.getTime() + splitRange * 60 * 1000) // Add 15 minutes
    }
  
    return timeList
}

export const mergeDateAndTime = (date, time) => {

    const hoursMinutes = time.match(/(\d+):(\d+)\s?([AP]M)/i);
    if (!hoursMinutes) {
      throw new Error('Invalid time format. Please provide a valid time in 12-hour format (e.g., "12:30 PM").');
    }
  
    const hours = parseInt(hoursMinutes[1]);
    const minutes = parseInt(hoursMinutes[2]);
    const period = hoursMinutes[3].toUpperCase();
  
    if (hours < 1 || hours > 12 || minutes < 0 || minutes > 59 || (period !== 'AM' && period !== 'PM')) {
      throw new Error('Invalid time values. Please provide valid hours (1-12), minutes (0-59), and period (AM/PM).');
    }
  
    const mergedDate = new Date(date);
    mergedDate.setHours(period === 'PM' ? hours + 12 : hours);
    mergedDate.setMinutes(minutes);
  
    return mergedDate;
}

export const getMinutesBetweenDates = (date1, date2) => {

    const diffInMilliseconds = Math.abs(date2 - date1);

    return Math.floor(diffInMilliseconds / (1000 * 60))
}

export const addMinutesToDate = (inputDate, minutesToAdd) => {

    const newDate = new Date(inputDate)
  
    newDate.setMinutes(newDate.getMinutes() + minutesToAdd)
  
    return newDate
}

export const WEEK_DAYS = [
    'SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'
]