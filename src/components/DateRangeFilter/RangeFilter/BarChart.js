import React from "react";
import { Bar } from "react-chartjs-2";
import { format } from "date-fns";

class BarChart extends React.Component {

  render() {
    const { data, highlight, domain, multipleHours } = this.props;
    // calculate frequency of data

    var counts = {};
    // let dateMap = new Map();
    for (var i = 0; i < data.length; i++) {
      counts[data[i]] = counts[data[i]] + 1 || 1;
    }

    // generate data
    const barDataValues = new Map();
    for (let i = domain[0]; i <= domain[1]; i = i + (1000 * 30 * 60 * 2 * multipleHours)) {
      barDataValues.set(i, counts[i] || 0);
    }
    let keys = Array.from(barDataValues.keys())
    let values = Array.from(barDataValues.values())

    const barData = {
      labels: values.map((val, i) => format(keys[i], "MMM dd, y HH:mm")),
      datasets: [
        {
          backgroundColor: values.map((val, i) =>
            keys[i] >= highlight[0] && keys[i] <= highlight[1]
              ? "rgba(44, 72, 112, 1)"
              : "rgba(255, 99, 132, 0.4)"
          ),
          hoverBackgroundColor: "rgba(255, 99, 132, 0.6)",
          data: values
        }
      ]
    };

    const options = {
      responsive: true,
      legend: {
        display: false
      },
      scales: {
        xAxes: [
          {
            display: false,
          }
        ],
        yAxes: [
          {
            display: false,
            ticks: {
              min: 0
            }
          }
        ]
      }
    };
    return <Bar data={barData} options={options} />;
  }
}

export default BarChart;