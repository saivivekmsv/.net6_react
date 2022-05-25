import React, { useState } from "react";
import { get, isEmpty } from "lodash";
import { faTimes } from "@fortawesome/pro-light-svg-icons";
import { faCheckCircle } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Modal, Button, Image, Form } from "react-bootstrap";
import PayrollFundingHeader from "./PayrollFundingHeader";
import Cancel from "../../../../styles/cancel.png";
import { faTimesCircle } from "@fortawesome/pro-light-svg-icons";
import DisplayFileLevel from "./DisplayFileLevel";
import DisplayFundingPlanLevel from "./DisplayFundingPlanLevel";
import DisplayFundingLocationLevel from "./DisplayFundingLocationLevel";
import DisplayFundingDivisionLevel from "./DisplayFundingDivisionLevel";
import { Formik } from "formik";
import { ROUTES, getPathWithParam } from "../../../../utils";
import { useRouterParams, useRequest } from "../../../../abstracts";
import { Link } from "react-router-dom";
import {
  getFundingDetailByPlan,
  getFundingDetailByDivision,
  saveFundingDetails,
} from "../../../../services";
import { LoaderWrapper, ManagePayrollErrorToast } from "../../../../components";

// import payrollFile from "../../../../mocks/ServicePayrollFile.json";
// import payrollPlan from "../../../../mocks/ServicePayrollFile.json";
// import payrollLocation from "../../../../mocks/ServicePayrollFile.json";

const mockOptions = [
  { label: "File", value: "File" },
  { label: "Plan", value: "Plan" },
  { label: "Division", value: "Division" },
  { label: "Classification - Location", value: "Classification - Location" },
];

const PayrollFunding = ({ data, props }) => {
  const [fileType, setfileType] = useState("File");
  const { payrollId } = useRouterParams();
  const [isModalOpen, setIsModalOpen] = useState(0);
  const [loadForPayrollFunding, setIsLoad] = useState(false);
  const [showErrors, setShowErrors] = useState(false);
  //const payrollFile = get(data, "payrollFunding", []);
  // const payrollPlan = get(data, "payrollFundingPlan", []);

  const handleChange = (e) => {
    setfileType(e.target.value);
  };

  const onFormSubmit = () => {
    setIsLoad(true);
    saveFundingDetails(payrollId)
      .then((response) => {
        if (response) {
          setIsLoad(false);
          setIsModalOpen(true);
        } else {
          setIsLoad(false);
          setShowErrors(true);
        }
      })
      .catch((error) => {
        setIsLoad(false);
        setShowErrors(true);
      });
  };

  const handleClose = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <ManagePayrollErrorToast isLoading={loadForPayrollFunding}>
        <LoaderWrapper isLoading={loadForPayrollFunding}>
          <Formik
            onSubmit={onFormSubmit}
            initialValues={{
              ...get(data, "payrollFunding.forfeiture", []),
            }}
          >
            {({ handleSubmit }) => {
              return (
                <Form
                  autoComplete="off"
                  onSubmit={handleSubmit}
                  className="h-100 d-flex"
                >
                  <div className="payroll-funding w-100">
                    <PayrollFundingHeader
                      title="Payroll Funding"
                      subtitle={get(data, "fileName")} //"Gregarious Simulation Systems"
                      handleChange={handleChange}
                      fileType={fileType}
                      mockOptions={mockOptions}
                    />
                    {fileType === "File" ? (
                      //<DisplayFileLevel data={payrollFile} />
                      !isEmpty(payrollId) ? (
                        <DisplayFileLevel payrollId={payrollId} />
                      ) : (
                        <span>No Data</span>
                      )
                    ) : fileType === "Plan" ? (
                      // !isEmpty(payrollPlan) ? (
                      <DisplayFundingPlanLevel payrollId={payrollId} />
                    ) : // ) : (
                    //   <span>No Data</span>
                    // )
                    fileType === "Division" ? (
                      <DisplayFundingDivisionLevel payrollId={payrollId} />
                    ) : (
                      <DisplayFundingLocationLevel payrollId={payrollId} />
                    )}
                  </div>
                </Form>
              );
            }}
          </Formik>
          <Modal show={isModalOpen} onHide={handleClose}>
            <Modal.Body style={{ borderTop: "5px solid #5ACE9F" }}>
              <div className="text-right">
                <FontAwesomeIcon
                  icon={faTimes}
                  color="#000"
                  onClick={handleClose}
                />
              </div>
              <div className="d-flex">
                <div className="pd-15">
                  <FontAwesomeIcon
                    icon={faCheckCircle}
                    color="#5ACE9F"
                    size="3x"
                  />
                </div>
                <div className="remove-text">
                  <h4>Submit Success</h4>
                  <p>Payroll file funded successfully</p>
                  <br />
                  <Link
                    to={getPathWithParam({
                      path: ROUTES.PAYROLL,
                    })}
                  >
                    <Button variant="primary">Ok</Button>
                  </Link>
                </div>
              </div>
            </Modal.Body>
          </Modal>
          {showErrors && (
            <div
              className={`error-banner justify-content-between d-flex align-items-center ${
                (showErrors && "enable") || "enable"
              }`}
            >
              <div>
                <Image src={Cancel} width="30px" />
              </div>
              <div>
                <div className="error-heading">Oops</div>
                <div className="error-reason">Something Went wrong</div>
              </div>
              <div>
                <FontAwesomeIcon
                  icon={faTimesCircle}
                  color="#000"
                  style={{ fontSize: "14px" }}
                  onClick={() => setShowErrors(false)}
                />
              </div>
            </div>
          )}
        </LoaderWrapper>
      </ManagePayrollErrorToast>
    </>
  );
};

export default PayrollFunding;
