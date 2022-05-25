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
      labels: ["Enrolled", "Eligible", "Ineligible", "Opted out", "Terminated"],
      datasets: [
        {
          label: "# of Votes",
          data: [
            enrolledCount,
            eligibleCount,
            ineligibleCount,
            optedoutCount,
            terminatedCount,
          ],
          backgroundColor: [
            "#003F5C",
            "#494B8A",
            "#A74391",
            "#FF7300",
            "#EF3D65",
          ],
          borderColor: ["#003F5C", "#494B8A", "#A74391", "#FF7300", "#EF3D65"],
          borderWidth: 1,
        },
      ],
    },
    
        options={
            cutout:65,
            
            plugins:{   
                tooltip: {
                    enabled: false
                  },
                legend: {
                  display: false
                        }
                     }
                     
       }
    
    return <Doughnut data={data} options={options}/>
}
export default DoughnutChart;
