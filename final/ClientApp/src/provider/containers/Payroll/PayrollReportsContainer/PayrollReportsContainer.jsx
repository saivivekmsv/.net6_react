import React, { useRef, useEffect, useState } from "react";
import { find, get } from "lodash";
import { Image, Row, Col, Tab, Tabs } from "react-bootstrap";
import { Link } from "react-router-dom";
import { ROUTES } from "../../../utils";
import { ExcelDropDown, SliderPanel } from "../../../components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/pro-light-svg-icons";
import { useRouterParams, useRequest } from "../../../abstracts";
// import PayrollAndCensus from "../../../mocks/payrollAndCensusData.json";
import {
  getFileInformationWithErrorDetailsByFileId,
  getInputFileById,
} from "../../../services/";
import ContributionBreak from "./ContributionBreak";
import AllRecords from "./AllRecords";
import DataChange from "./DataChange";
import DataOverride from "./DataOverride";
import ErrorValidation from "./ErrorValidation";
import PayrollFunding from "./PayrollFunding";
import Logo from "../../../styles/upload.png";

const PayrollReportsContainer = (props) => {
  const { payrollId } = useRouterParams();
  const intPayrollId = parseInt(payrollId, 10);
  const [isModalOpen, setModalOpen] = useState(false);
  const { response: payrollReports, loading: isLoading } = useRequest({
    method: getFileInformationWithErrorDetailsByFileId,
    payload: payrollId,
    defaultResponse: [],
  });

  // const {
  //   response: inputFileInfo,
  //   loading: infoLoading,
  //   error: infoerror,
  // } = useRequest({
  //   method: getInputFileById,
  //   payload: 1,
  //   defaultResponse: {},
  // });

  const showPopup = () => {
    setModalOpen(true);
  };

  return (
    <>
      <div className="payroll-report-container w-100">
        <div className="d-flex justify-content-between align-baseline">
          <div className="plan-heading-payroll font-weight-500">
            Payroll & Census Report
          </div>
          <div className="mt-22">
            <Link to={ROUTES.PAYROLL}>
              <FontAwesomeIcon icon={faTimes} size="18px" color="#333333" />
            </Link>
          </div>
        </div>
        <div className="border-top" />
        <div className="payroll-report">
          <Row>
            <Col md="3" className="brr-1">
              <p className="black-text font-weight-500">
                {payrollReports.fileName}
              </p>
              <p className="mbbb-5">
                <Image src={Logo} />{" "}
                <span className="ft-12 black-text font-weight-500">
                  {payrollReports.fileName}
                  <span className="grey-text ft-10">.xls</span>
                </span>
              </p>
              <p className="grey-text ft-12">{payrollReports.paydate}</p>
              <p className="grey-text ft-12 mb-0">Plan name</p>
              <p className="black-text ft-14 mbbb-5">
                {payrollReports.planName}
              </p>
              <p className="black-text ft-12 font-weight-500">
                <span className="grey-text ft-12 font-weight-300">
                  Plan ID :
                </span>{" "}
                {payrollReports.planId}
              </p>
              <p className="grey-text ft-12 mb-0">Uploaded by</p>
              <p className="black-text ft-12 font-weight-500">
                {payrollReports.uploadedBy}
              </p>
              <p className="grey-text ft-12 mb-0">Status</p>
              <p className="black-text ft-12 font-weight-500">
                {payrollReports.fileStatus}
              </p>
            </Col>
            <Col md="9">
              <div className="d-flex justify-content-start">
                <div className="wd-20">
                  <p className="grey-text ft-12 mb-0">Plan ID</p>
                  <p className="ft-14 font-weight-500 black-text">
                    {payrollReports.planId}
                  </p>
                </div>
                <div className="wd-20">
                  <p className="grey-text ft-12 mb-0">Pay date</p>
                  <p className="ft-14 font-weight-500 black-text">
                    {payrollReports.payDate}
                  </p>
                </div>
                <div className="wd-20">
                  <p className="grey-text ft-12 mb-0">Payroll</p>
                  <p className="ft-14 font-weight-500 black-text">
                    {payrollReports.frequencyType}
                  </p>
                </div>
                <div className="wd-20">
                  <p className="grey-text ft-12 mb-0">Total funding</p>
                  <p className="ft-18 font-weight-500 black-text mb-0">
                    $ {payrollReports.totalAmount}
                  </p>
                  <p className="link-text" onClick={showPopup}>
                    View payroll details
                  </p>
                </div>
                <div className="wd-20">
                  <p className="grey-text ft-12 mb-0">Download file</p>
                  <p>
                    <ExcelDropDown
                      submittedFile={"Submitted file"}
                      inputFile={"Input file (before error correction)"}
                      fileId={payrollId}
                    />
                  </p>
                </div>
              </div>
              <div className="d-flex justify-content-start">
                <div className="wd-20">
                  <p className="grey-text ft-12 mb-0">Total records</p>
                  <p className="ft-14 font-weight-500 black-text">
                    {payrollReports.totalRecords}
                  </p>
                </div>
                <div className="wd-20">
                  <p className="grey-text ft-12 mb-0">Total errors</p>
                  <p className="ft-14 font-weight-500 black-text">
                    {payrollReports.totalErrors}
                  </p>
                </div>
                <div className="wd-20">
                  <p className="grey-text ft-12 mb-0">Records with errors</p>
                  <p className="ft-14 font-weight-500 black-text">
                    {payrollReports.totalErrorRecords}
                  </p>
                </div>
                <div className="wd-20">
                  <p className="grey-text ft-12 mb-0">Resolved errors</p>
                  <p className="ft-14 font-weight-500 black-text">
                    {payrollReports.totalErrorsDetectedAndResolved}
                  </p>
                </div>
                <div className="wd-20">
                  <p className="grey-text ft-12 mb-0">Records deleted</p>
                  <p className="ft-14 font-weight-500 black-text">
                    {payrollReports.totalEmployeesDeleted}
                  </p>
                </div>
              </div>
              <h4 className="view-text">View Reports</h4>
              <div className="deposit_histoy_tabs">
                <Tabs mountOnEnter unmountOnExit>
                  <Tab eventKey="all_records" title="All Records">
                    <AllRecords payrollId={payrollId} data={payrollReports} />
                  </Tab>
                  <Tab eventKey="data_change" title="Data Change">
                    <DataChange payrollId={payrollId} data={payrollReports} />
                  </Tab>
                  <Tab eventKey="data_override" title="Data Override">
                    <DataOverride payrollId={payrollId} data={payrollReports} />
                  </Tab>
                  <Tab eventKey="error_validation" title="Error Validation">
                    <ErrorValidation
                      payrollId={payrollId}
                      data={payrollReports}
                    />
                  </Tab>
                  {/* <Tab eventKey="payroll_funding" title="Payroll Funding">
                    <PayrollFunding
                      payrollId={payrollId}
                      data={payrollReports}
                    />
                  </Tab> */}
                </Tabs>
              </div>
            </Col>
          </Row>
        </div>
        <SliderPanel
          isOpen={isModalOpen}
          size="30"
          showCancel={false}
          backdropClicked={() => setModalOpen(false)}
        >
          <div className="d-flex justify-content-between">
            <div className="ft-14 font-weight-500">Payroll details</div>
            <div>
              <FontAwesomeIcon
                icon={faTimes}
                size="md"
                color="#828282"
                onClick={() => setModalOpen(false)}
                className="pointer"
              />
            </div>
          </div>
          <ContributionBreak payrollId={intPayrollId} />
        </SliderPanel>
      </div>
    </>
  );
};

export default PayrollReportsContainer;
