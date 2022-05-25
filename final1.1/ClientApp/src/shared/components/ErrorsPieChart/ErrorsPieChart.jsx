import { get } from "lodash";
import React from "react";
import {
  ResponsiveContainer,
  Pie,
  Cell,
  PieChart,
  Tooltip,
  Legend,
} from "recharts";

const CustomToolTip = (props) => {
  const { active, payload } = props;
  if (active) {
    const tooltipData = get(payload, 0, {});
    const label = get(tooltipData, "payload.label");
    const value = get(tooltipData, "value");
    return (
      <div className="error-custom-tool-tip">
        {value} {label}
      </div>
    );
  }
  return null;
};

const CustomLegend = (props) => {
  const { payload } = props;
  return (
    <div className="d-flex justify-content-between mx-auto">
      {(payload || []).map((item) => {
        const { label, value } = item.payload;
        const color = item.color;
        if (value > 0) {
          return (
            <div className="ft-12 text-black font-weight-500">
              <span
                style={{
                  display: "inline-block",
                  backgroundColor: color,
                  height: "8px",
                  width: "8px",
                  borderRadius: "50%",
                }}
              ></span>
              &nbsp;&nbsp;
              {label}
            </div>
          );
        }
        return null;
      })}
    </div>
  );
};

const ErrorsPieChart = ({ data }) => {
  return (
    <ResponsiveContainer minWidth="200px" minHeight="200px">
      <PieChart>
        <Pie
          data={data}
          labelLine={false}
          fill="#8884d8"
          valueKey="label"
          dataKey="value"
          blendStroke
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={get(entry, "color")} />
          ))}
        </Pie>
        <Tooltip content={<CustomToolTip />} />
        <Legend content={<CustomLegend />} />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default ErrorsPieChart;
