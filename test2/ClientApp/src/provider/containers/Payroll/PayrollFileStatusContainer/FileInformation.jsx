import { get } from "lodash";
import React, { useEffect, useState } from "react";
import { Row, Col, OverlayTrigger, Tooltip } from "react-bootstrap";
import { ErrorsPieChart } from "../../../components";
import { PayrollCardTop } from "../../../components";
import { ProgressFileStatus } from "../../../components";
import AddToolTip from "../../../components/AddToolTip";
import { OPTIONS_DATA_MAPPER } from "../../../utils";

const FileInformation = (props) => {
  const { data, errorType, graphData } = props;
  console.log(graphData, "graphData in file infor");
  console.log(errorType, "errorType");
  const errorPieChartData = [];
  if (errorType === 1) {
    errorPieChartData.push(
      ...[
        {
          label: "No Errors",
          value: get(graphData, "totalRecords", 0),
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
          value: 0,

          color: "#5ACE9F",
        },
      ]
    );
  }
  console.log(data, "data in file Info");
  return (
    <div className="file-information">
      <p className="mt-20 payroll-sub-head">File Information</p>
      <div className="border-top" />
      <Row>
        <Col md="9" className="br-1 mt-20">
          <PayrollCardTop data={data} />
          <Row>
            <Col md="4">
              <div>
                <p className="mr-2 ft-12 grey-text">File Description</p>
                {data.description === null ||
                  (data.description === "" && <p>{""}</p>)}
                <p className="mr-2 ft-12 black-text mb-1">
                  {data.description && data.description.length > 30 ? (
                    <OverlayTrigger
                      overlay={<Tooltip>{data.description}</Tooltip>}
                    >
                      <p className="ft-12 black-text font-weight-400 title-wrap mbb-10">
                        {(data.description || "").slice(0, 30)}...
                      </p>
                    </OverlayTrigger>
                  ) : (
                    <p className="ft-12 black-text font-weight-400 title-wrap mbb-10">
                      {data.description}
                    </p>
                  )}
                </p>
                <p className="mr-2 ft-12 grey-text">Company name</p>
                <p className="text-black ft-14 font-weight-500">
                  {data.companyName && data.companyName.length > 30 ? (
                    <OverlayTrigger
                      overlay={<Tooltip>{data.companyName}</Tooltip>}
                    >
                      <p className="ft-14 black-text font-weight-500 mt-10 mb-10">
                        {(data.companyName || "").slice(0, 30)}...
                      </p>
                    </OverlayTrigger>
                  ) : (
                    //       <AddToolTip
                    //   className="ft-14 font-weight-500 pb-3 company-name"
                    //   name={data.companyName}
                    // >
                    //   <p className="ft-14 black-text font-weight-500 mt-10 mb-10">
                    //   {(data.companyName || "").slice(0, 25)}...
                    //   </p>
                    // </AddToolTip>
                    <p className="ft-14 black-text font-weight-500 mt-10 mb-10">
                      {data.companyName}
                    </p>
                  )}
                </p>
                <p className="mr-2 ft-12 grey-text">Plan name</p>
                <p className="mr-2 ft-12 black-text mb-1">
                  {data.planName && data.planName.length > 30 ? (
                    <OverlayTrigger
                      overlay={<Tooltip>{data.planName}</Tooltip>}
                    >
                      <p className="ft-12 black-text font-weight-400 title-wrap mbb-5">
                        {(data.planName || "").slice(0, 30)}...
                      </p>
                    </OverlayTrigger>
                  ) : (
                    <p className="ft-12 black-text font-weight-400 title-wrap mbb-5">
                      {data.planName}
                    </p>
                  )}
                </p>
                <p className="mr-2 ft-12 grey-text">
                  Plan ID : <span className="text-black">{data.planId}</span>
                </p>
              </div>
            </Col>
          </Row>
          <Row>
            <Col md="12">
              <div className="d-flex justify-content-between mt-20">
                <div>
                  <p className="ft-12 grey-text ">Pay date</p>
                  <p className="text-black mt-10">{data.payDate}</p>
                </div>
                <div>
                  <p className="ft-12 grey-text ">Payroll</p>
                  <p className="text-black mt-10">
                    {data.payrollFrequencyName}
                  </p>
                </div>
                <div>
                  <p className="ft-12 grey-text ">Total records</p>
                  <p className="text-black mt-10">{data.totalRecords}</p>
                </div>
                <div>
                  <p className="ft-12 grey-text ">Total amount</p>
                  <p className="text-black mt-10">$ {data.totalAmount}</p>
                </div>
              </div>
            </Col>
          </Row>
        </Col>
        <Col md="3">
          <div>
            <p className="ft-12 grey-text mt-20">File status</p>
            <ProgressFileStatus
              stepperDetails={data.progress}
              status={graphData.status}
              fileStatus={graphData.status}
              errorType={errorType}
              warnings={get(graphData, "warningsCount", 0)}
              errors={get(graphData, "errorsCount", 0)}
              validationReports={get(data, "validationReports", [])}
              duplicatesCount={get(graphData, "duplicatesCount", [])}
              showTrash={false}
            />
            <ErrorsPieChart data={errorPieChartData} />
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default FileInformation;
