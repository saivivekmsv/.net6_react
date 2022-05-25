/* eslint-disable jsx-a11y/anchor-is-valid */
import { isEmpty } from "lodash";
import moment from "moment";
import React from "react";
import { Col, Row, Button } from "react-bootstrap";
import {
  DocumentTypeIcon,
  Link,
  PayrollCardTop,
  FileTypeWithExt,
} from "../../../components";
import { MANAGE_PAYROLL_ROUTES } from "../../../utils";

const validationReports = [
  "File is invalid format. Additional column['Column1'] found. Please upload the correct template.",
  "Error at the first sheet - Row Number[2] – Column['SSN'] --> 'QWERTY' is invalid. Accepted format is xxxxxxxxx or xxx-xx-xxxx, x being a number'.",
  "Error at the first sheet - Row Number[3] – Column['PAY DATE'] --> Invalid date. Accepted format is mm/dd/yyyy.'",
];

const DataMismatchErrors = ({ data }) => {
  return (
    <div className="file-information">
      <div className="d-flex justify-content-between">
        <div className="mt-20 payroll-sub-head">File validation</div>
      </div>
      <div className="border-top" />
      <Row>
        <Col md="9" className="mt-20">
          <div className="d-flex justify-content-between align-baseline">
            <FileTypeWithExt
              fileName={data.fileName}
              description={data.description}
            />
            <div className="mr-2 ft-12 grey-text">
              {moment(data.uploadedDate).toString()}
            </div>
            {/* <div className="mr-2 ft-12 grey-text">{data.uploadedTime}</div> */}
          </div>
        </Col>
      </Row>
      <Row>
        <Col className="mt-20">
          <div className="d-flex w-75 justify-content-between">
            <div>
              <div className="ft-12 grey-text">File status</div>
              <div className="ft-14 font-weight-500 error-text mt-10">
                Error In file Processor
              </div>
            </div>
          </div>
          <br />
          <div className="ft-12">
            Kindly reupload corrected or other file to process again
          </div>
          <br />
          <div>
            <Link to={MANAGE_PAYROLL_ROUTES.NEW_PAYROLL_UPLOAD}>
              <Button>Reupload</Button>
            </Link>
          </div>
          <div className="plan-sub-heading">Validation Report</div>
          {!isEmpty(data.errorMessages) && (
            <div className="validation-report w-75">
              <div className="plan-sub-heading">
                Data type validation report
              </div>
              {data.errorMessages.map((report, index) => (
                <div className="ft-12 font-weight-500 text-black my-2">
                  {`${index + 1}. `}
                  {` In Row Number ${report.rowNumber} : ${report.messageDescCode}`}
                </div>
              ))}
            </div>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default DataMismatchErrors;
