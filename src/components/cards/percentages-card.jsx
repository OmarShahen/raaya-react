import React from 'react'
import { formatNumber } from '../../utils/numbers'
import './chart-card.css'
import { capitalizeFirstLetter } from '../../utils/formatString'


const PercentagesCard = ({ category, percentages, total, isCapitalize=false }) => {

    return <div className="chart-table-wrapper">
        <table className="chart-table-container">
        <tr>
            <th>{category}</th>
            <th>Total</th>
            <th>Percentages</th>
        </tr>
        {
            percentages.map((row, index) => <tr key={index}>
                <td>{row._id ? capitalizeFirstLetter(row._id) : 'Not Registered' }</td>
                <td>{formatNumber(row.count)}</td>
                <td>{((row.count / total) * 100).toFixed(2)}%</td>
            </tr>)
        }
        
        </table>
    </div>
}

export default PercentagesCard