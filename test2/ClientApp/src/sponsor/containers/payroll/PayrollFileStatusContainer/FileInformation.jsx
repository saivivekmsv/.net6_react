import { get } from "lodash";
import React from "react";
import { Row, Col, OverlayTrigger } from "react-bootstrap";
import { ErrorsPieChart } from "../../../../shared/components";
import { PayrollCardTop } from "../../../../shared/components";
import { ProgressFileStatus } from "../../../../shared/components";
import { OPTIONS_DATA_MAPPER } from "../../../../shared/utils";
import { Tooltip } from "../../../../shared";


const FileInformation = (props) => {
  const { data, errorType, graphData } = props;
  console.log("data information");
console.log(data);
  const errorPieChartData = [];
  if (errorType === 1) {
    errorPieChartData.push(
      ...[
        {
          label: "No Errors",
          value: 40,
          color: "#5ACE9F",
        },
        {
          label: "Warnings",
          value: get(data, "warnings", []).length,
          color: "#F2994A",
        },
        {
          label: "Error",
          value: get(data, "errors", []).length,
          color: "#F16973",
        },
      ]
    );
  }

  if (errorType === 2) {
    errorPieChartData.push(
      ...[
        {
          label: "Duplicates",
          value: get(graphData, "duplicatesCount", 0),
          color: "#F16973",
        },
        {
          label: "Records without duplicates",
          value:
            get(graphData, "totalRecords", 0) -
            get(graphData, "duplicatesCount", 0),
          color: "#5ACE9F",
        },
      ]
    );
  }

  if (errorType === 3) {
    errorPieChartData.push(
      ...[
        {
          label: "Warnings",
          value: get(graphData, "warningsCount", 0),
          color: "#F2994A",
        },
        {
          label: "Error",
          value: get(graphData, "errorsCount", 0),
          color: "#F16973",
        },
        {
          label: "No Errors",
          value:
            get(graphData, "totalRecords", 0) -
            get(graphData, "warningsCount", 0) -
            get(graphData, "errorsCount", 0),
          color: "#5ACE9F",
        },
      ]
    );
  }
  console.log(data, "data in file Info");
  return (
    <div className="file-information">



      <PayrollCardTop data={data} errorType={errorType} graphData={graphData} />

      <Row className="mt-5">
        <Col md={4}>
          <div>
            {data.companyName && data.companyName.length >= 30 ?
              (
                <Tooltip
                  className="ft-14 font-weight-500 pb-3 company-name"
                  name={data.companyName}
                >
                  <p className="ft-14 black-text font-weight-500 mt-10 mb-10">
                    {(data.companyName || "").slice(0, 30)}...

                  </p>
                </Tooltip>
              ) : (
                <span>
                  {data.companyName}
                </span>

              )}
          </div>
          <div>
            <span>Plan name</span>
            {data.planName && data.planName.length >= 30 ?
              (
                <Tooltip
                  className="ft-14 font-weight-500 pb-3 company-name"
                  name={data.planName}
                >
                  <p className="ft-14 black-text font-weight-500 mt-10 mb-10">
                    {(data.planName || "").slice(0, 30)}...

                  </p>
                </Tooltip>
              ) : (
                <span>
                  {data.planName}
                </span>

              )}
          </div>
          <div>


            <span>Plan id</span>
            {data.planId && data.planId.length >= 30 ?
              (
                <Tooltip
                  className="ft-14 font-weight-500 pb-3 company-name"
                  name={data.planId}
                >
                  <p className="ft-14 black-text font-weight-500 mt-10 mb-10">
                    {(data.planId || "").slice(0, 30)}...

                  </p>
                </Tooltip>
              ) : (
                <span>
                  {data.planId}
                </span>

              )}







          </div>


        </Col>
        <Col md={2}>
          <div>
            <p className="ft-12 grey-text ">Payroll</p>
            <p className="text-black mt-10">
              {data.payrollFrequencyName}
            </p>
          </div>
          <div>
            <p className="ft-12 grey-text ">Pay date</p>
            <p className="text-black mt-10">{data.payDate}</p>
          </div>

        </Col>
        <Col md={2}>
          <div>
            <p className="ft-12 grey-text ">Total amount</p>
            <p className="text-black mt-10">$ {data.totalAmount}</p>
          </div>

        </Col>
        <Col md={4} className="d-flex flex-row align-item-end h-100">
          <div>
            <p className="text-black mt-10">{data.totalRecords}</p>
            <p className="ft-12 grey-text ">Total records</p>
          </div>
          <div className="d-flex flex-column ">
              <span>{0} No errors</span>
              <span>{0} Error records</span>
              <span>{0} warnings</span>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default FileInformation;
