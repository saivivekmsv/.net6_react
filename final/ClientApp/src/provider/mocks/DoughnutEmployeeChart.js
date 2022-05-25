import React from "react";
import { Doughnut, defaults } from "react-chartjs-2";
//defaults.global.legend.position='bottom';
import employee from "./employee.json";

var enrolledCount = (employee || []).filter((_) => _.empStatus === "enrolled")
  .length;
var eligibleCount = (employee || []).filter((_) => _.empStatus === "eligible")
  .length;
var ineligibleCount = (employee || []).filter(
  (_) => _.empStatus === "ineligible"
).length;
var optedoutCount = (employee || []).filter((_) => _.empStatus === "optedout")
  .length;
var terminatedCount = (employee || []).filter(
  (_) => _.empStatus === "terminated"
).length;

function DoughnutChart() {
  const data = {
      labels: ["Eligible", "Opted out", "Ineligible"],
      datasets: [
        {
          label: "# of Votes",
          data: [190, 50, 100],
          backgroundColor: ["#27AE60", "#EB5757", "#BDBDBD"],
          borderColor: ["#27AE60", "#EB5757", "#BDBDBD"],
          borderWidth: 1,
        },
      ],
    },
    options = {
      cutout: 45,

      plugins: {
        // tooltip: {
        //     enabled: false
        //   },
        legend: {
          display: false,
        },
      },
    };

  return <Doughnut data={data} options={options} />;
}
export default DoughnutChart;
