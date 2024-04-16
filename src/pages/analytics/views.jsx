import { useState, useEffect } from 'react'
import { serverRequest } from '../../components/API/request'
import { toast } from 'react-hot-toast'
import { format } from 'date-fns'
import { formatNumber } from '../../utils/numbers'
import Card from '../../components/cards/card'
import NumbersOutlinedIcon from '@mui/icons-material/NumbersOutlined'
import { useSelector } from 'react-redux'
import LineChart from '../../components/charts/line-chart'
import BarChart from '../../components/charts/bar-chart'
import { capitalizeFirstLetter } from '../../utils/formatString'
import FiltersSection from '../../components/filters/filters'
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined'


const AnalyticsViewsPage = () => {

    const user = useSelector(state => state.user.user)

    const [totalViews, setTotalViews] = useState(0)
    const [growthStats, setGrowthStats] = useState([])
    const [growthGroupBy, setGrowthGroupBy] = useState('MONTH')
    const [pageStats, setPageStats] = useState([])
    
    const todayDate = new Date()
    const weekDate = new Date()
    weekDate.setDate(weekDate.getDate() - 7)
    todayDate.setDate(todayDate.getDate() + 1)

    const [statsQuery, setStatsQuery] = useState({ 
        from: format(weekDate, 'yyyy-MM-dd'), 
        to: format(todayDate, 'yyyy-MM-dd') 
    })

    useEffect(() => {
        scroll(0, 0)
        document.title = 'Analytics-Views'
    }, [])

    useEffect(() => {
        serverRequest.get(`/v1/views/experts/${user._id}/stats`, { params: { ...statsQuery } })
        .then(response => {
            setTotalViews(response.data.totalViews)
        })
        .catch(error => {
            console.error(error)
            toast.error(error?.response?.data?.message, { duration: 3000, position: 'top-right' })
        })
    }, [statsQuery])

    useEffect(() => {
        serverRequest.get(`/v1/views/experts/${user._id}/growth`, { params: { groupBy: growthGroupBy, ...statsQuery } })
        .then(response => {
            setGrowthStats(response.data.viewsGrowth)
        })
        .catch(error => {
            console.error(error)
            toast.error(error?.response?.data?.message, { duration: 3000, position: 'top-right' })
        })
    }, [growthGroupBy, statsQuery])

    useEffect(() => {
        serverRequest.get(`/v1/views/experts/${user._id}/pages/stats`, { params: { ...statsQuery } })
        .then(response => {
            setPageStats(response.data.viewsStats)
        })
        .catch(error => {
            console.error(error)
            toast.error(error?.response?.data?.message, { duration: 3000, position: 'top-right' })
        })
    }, [statsQuery])

    return <div>
        <div className="margin-bottom-1">
            <FiltersSection 
                statsQuery={statsQuery}
                setStatsQuery={setStatsQuery}
                isShowUpcomingDates={false}
                defaultValue={'-7'}
            />
        </div>
        <div className="cards-3-list-wrapper">
            <Card 
            icon={<RemoveRedEyeOutlinedIcon />}
            cardHeader={'Views'}
            number={totalViews}
            />
        </div>
        <div className="margin-top-1">
            <LineChart 
            title={'Views Growth'}
            data={growthStats.map(stat => stat.count)}
            labels={growthStats.map(stat => stat._id)}
            setGroupBy={setGrowthGroupBy}
            />
        </div>
        <div className="margin-top-1">
            <BarChart 
            title={'Pages Statistics'}
            data={pageStats.map(stat => stat.count)}
            labels={pageStats.map(stat => capitalizeFirstLetter(stat._id) + ' page')}
            total={totalViews}
            allData={pageStats}
            />
        </div>
    </div>
}

export default AnalyticsViewsPage