import { useState } from 'react'
import { format } from 'date-fns'
import './filters.css'
import PickDateFormModal from '../modals/pick-date-form'

const FiltersSection = ({ statsQuery, setStatsQuery, isShowUpcomingDates, defaultValue }) => {

    const selectOptions = [
        {
            name: 'Upcoming 90 days',
            value: '90'
        },
        {
            name: 'Upcoming 30 days',
            value: '30'
        },
        {
            name: 'Upcoming 7 days',
            value: '7'
        },
        {
            name: 'Tommorrow',
            value: '1'
        },
        {
            name: 'Today',
            value: '0'
        },
        {
            name: 'Yesterday',
            value: '-1'
        },
        {
            name: 'Last 7 days',
            value: '-7'
        },
        {
            name: 'Last 30 days',
            value: '-30'
        },
        {
            name: 'Last 90 days',
            value: '-90'
        },
        {
            name: 'Lifetime',
            value: 'LIFETIME'
        }
    ]

    const getstatsDate = (value) => {

        const daysPeriod = Number.parseInt(value)
        const todayDate = new Date()
        const rangeDate = new Date()

        if(value === 'CUSTOM') {
            setIsShowForm(true)
            return
        }

        if(value === 'LIFETIME') {
            setStatsQuery({})
            setDatePeriod('')
            return
        }

        if(daysPeriod === 1 || daysPeriod === 0 || daysPeriod === -1) {
            todayDate.setDate(todayDate.getDate() + daysPeriod)
            const formattedDate = format(todayDate, 'yyyy-MM-dd')

            setStatsQuery({ specific: formattedDate })
            setDatePeriod('')
            return
        }

        if(0 < daysPeriod) {

            const formattedFromDate = format(todayDate, 'yyyy-MM-dd')
            rangeDate.setDate(rangeDate.getDate() + daysPeriod)
            const formattedToDate = format(rangeDate, 'yyyy-MM-dd')

            setStatsQuery({ from: formattedFromDate, to: formattedToDate })
            setDatePeriod('')
            return
        }

        if(0 > daysPeriod) {

            const afterTodayDate = new Date()
            afterTodayDate.setDate(afterTodayDate.getDate() + 1)
            const formattedToDate = format(afterTodayDate, 'yyyy-MM-dd')
            rangeDate.setDate(rangeDate.getDate() + daysPeriod)
            const formattedFromDate = format(rangeDate, 'yyyy-MM-dd')

            setStatsQuery({ from: formattedFromDate, to: formattedToDate })
            setDatePeriod('')
            return
        }

    }
  

    const [datePeriod, setDatePeriod] = useState(statsQuery)
    const [isShowForm, setIsShowForm] = useState(false)

    return <div className="filters-section-container">
        { isShowForm ? <PickDateFormModal setDatePeriod={setDatePeriod} setStatsQuery={setStatsQuery} setShowModalForm={setIsShowForm} /> : null }
        <div>
            <label className="bold-text">Period</label>
            <select
            className="form-select"
            onChange={e => getstatsDate(e.target.value)}
            >
                <option selected disabled>Select Period</option>
                {selectOptions.map((option, index) => {
                    if(!isShowUpcomingDates && index <= 3) {
                        return
                    }

                    if(option.value === defaultValue) {
                        return <option value={option.value} selected>{option.name}</option>
                    }

                    return <option value={option.value}>{option.name}</option>
                })}
                <option value="CUSTOM">Custom</option>
            </select>
        </div>
        {
            datePeriod === 'CUSTOM' && statsQuery?.from ?
            <div>
                <label>From</label>
                <input 
                type="date" 
                className="form-input"
                placeholder="period"
                onChange={e => getSpecificDate(e.target.value)}
                value={statsQuery.from ? format(new Date(statsQuery.from), 'yyyy-MM-dd') : null }
                disabled
                />
            </div>
            :
            null
        }
            
        {
            datePeriod === 'CUSTOM' && statsQuery?.to ?
            <div>
                <label>To</label>
                <input 
                type="date" 
                className="form-input"
                placeholder="period"
                onChange={e => getSpecificDate(e.target.value)}
                value={statsQuery.to ? format(new Date(statsQuery.to), 'yyyy-MM-dd') : null }
                disabled
                />
            </div>
            :
            null
        }

        {
            datePeriod === 'CUSTOM' && statsQuery?.specific ?
            <div>
                <label>Specific</label>
                <input 
                type="date" 
                className="form-input"
                placeholder="period"
                value={statsQuery.specific ? format(new Date(statsQuery.specific), 'yyyy-MM-dd') : null }
                disabled
                />
            </div>
            :
            null
        }

        {
            datePeriod === 'CUSTOM' && statsQuery?.until ?
            <div>
                <label>Until</label>
                <input 
                type="date" 
                className="form-input"
                placeholder="period"
                value={statsQuery.until ? format(new Date(statsQuery.until), 'yyyy-MM-dd') : null }
                disabled
                />
            </div>
            :
            null
        }
            
    </div>
}

export default FiltersSection