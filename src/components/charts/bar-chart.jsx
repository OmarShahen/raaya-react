import React from 'react'
import Chart from 'chart.js/auto'
import { Bar } from 'react-chartjs-2'
import './chart.css'
import '../cards/cards.css'
import PercentagesCard from '../cards/percentages-card'


const BarChart = ({ title, labels=[], data=[], total=0, allData=[], isCapitalize  }) => {

    return <div className="card-container cards-white-bg disable-hover">

        <div className="cards-2-list-wrapper">
          <div>
            <Bar
            data={{
                    labels,
                    datasets: [{
                        data,
                        barPercentage: 0,
                        hoverBackgroundColor: 'dodgerblue',
                        barThickness: 10,
                        borderRadius: 50,
                        backgroundColor: [
                            '#377dff'
                        ],
                        
                        backgroundColor: "#377dff",
                        hoverBackgroundColor: "#377dff",
                        borderColor: "#377dff",
                        maxBarThickness: "10"
                    }]
                }}

            options={{
                        "scales": {
                          "y": {
                            "grid": {
                              "color": "#e7eaf3",
                              "drawBorder": false,
                              "zeroLineColor": "#e7eaf3"
                            },
                            "ticks": {
                              "beginAtZero": true,
                              "stepSize": 100,
                              "fontSize": 12,
                              "fontColor": "#97a4af",
                              "fontFamily": "Inter, Cairo, sans-serif",
                              "padding": 10,
                              "postfix": "$"
                            }
                          },
                          "x": {
                            "grid": {
                              "display": false,
                              "drawBorder": false
                            },
                            "ticks": {
                              "font": {
                                "size": 12,
                                "family": "Inter, Cairo, sans-serif",
                              },
                              "color": "#97a4af",
                              "padding": 5
                            },
                            "categoryPercentage": 0.5
                          }
                        },
                        "cornerRadius": 2,
                        "plugins": {
                          "tooltip": {
                          "prefix": "$",
                          "hasIndicator": true,
                          "mode": "index",
                          "intersect": false
                          },
                          title: {
                            display: true,
                            text: title,
                            fullSize: true
                        },
                        legend: {
                            display: false,
                            position: 'bottom'
                        }
                        },
                        "hover": {
                          "mode": "nearest",
                          "intersect": true
                        }
            }}
            />
          </div>

          <div>
            <PercentagesCard
            category={title}
            percentages={allData}
            total={total}
            isCapitalize={isCapitalize}
            />
          </div>
        </div>
    </div>
}

export default BarChart