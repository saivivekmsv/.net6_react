import React from "react";
import { Link } from "react-router-dom";
import { Row } from "react-bootstrap";
import  TaskManagement  from "./TaskManagementTab";
const SponsorTaskManagementCard = (props) => {
  const tasks = [
    {
      description: "4 Files with errors",
      name: "Error Correction",
      type: "error",
    },
    {
      description: "August payroll file dues",
      name: "Payroll upload",
      type: "warning",
    },
    {
      description: "6 Loan | 3 Withdrawls | 2 Transfers",
      name: "Transaction requests (11)",
      type: "task-at-hand",
    },
  ];
  return (
    <div className="tile-with-border">
      <h5 className="tile-title">Task management</h5>
      {tasks.map((_, i) =>
        <TaskManagement key={i} task={_}></TaskManagement>
      )}
    </div>
  );
};

export default SponsorTaskManagementCard;
