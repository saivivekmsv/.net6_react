import React, { useState } from "react";
import { get, isEmpty } from "lodash";
import { faTimes } from "@fortawesome/pro-light-svg-icons";
import { faCheckCircle } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Modal, Button, Form } from "react-bootstrap";
import PayrollFundingHeader from "./PayrollFundingHeader";
import DisplayFileLevel from "./DisplayFileLevel";
import DisplayFundingPlanLevel from "./DisplayFundingPlanLevel";
import DisplayFundingLocationLevel from "./DisplayFundingLocationLevel";
import DisplayFundingDivisionLevel from "./DisplayFundingDivisionLevel";
import { Formik } from "formik";
import { ROUTES, getPathWithParam } from "../../../../../shared/utils";
import { useRouterParams, useRequest } from "../../../../../shared/abstracts";
import { Link } from "react-router-dom";
import {
  getFundingDetailByPlan,
  getFundingDetailByDivision,
  saveFundingDetails,
} from "../../../../services";

// import payrollFile from "../shared/mocks/ServicePayrollFile.json";
// import payrollPlan from "../shared/mocks/ServicePayrollFile.json";
// import payrollLocation from "../shared/mocks/ServicePayrollFile.json";

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
  //const payrollFile = get(data, "payrollFunding", []);
  // const payrollPlan = get(data, "payrollFundingPlan", []);

  const handleChange = (e) => {
    setfileType(e.target.value);
  };

  const onFormSubmit = () => {
    saveFundingDetails(payrollId).then((response) => {});
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
  };

  return (
    <>
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
              <FontAwesomeIcon icon={faCheckCircle} color="#5ACE9F" size="3x" />
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
    </>
  );
};

export default PayrollFunding;
