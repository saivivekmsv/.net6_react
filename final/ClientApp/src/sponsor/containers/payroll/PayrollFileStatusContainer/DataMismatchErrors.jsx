/* eslint-disable jsx-a11y/anchor-is-valid */
import { isEmpty } from "lodash";
import React from "react";
import { Col, Row, Button } from "react-bootstrap";
import {
  DocumentTypeIcon,
  Link,
  PayrollCardTop,
  FileTypeWithExt,
} from "../../../../shared/components";
import { MANAGE_PAYROLL_ROUTES } from "../../../../shared/utils";

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
            <div className="ft-12 dark-grey-text font-weight-500">
              {"1 day ago"}
            </div>
            <div className="mr-2 ft-12 grey-text">{data.date}</div>
            <div className="mr-2 ft-12 grey-text">{data.time}</div>
            <div>
              <p className="mr-2 ft-12 grey-text">Uploaded by</p>
              <p className="ft-14 font-weight-500 text-black mt-10">
                {data.name}
              </p>
            </div>
          </div>
        </Col>
      </Row>
      <Row>
        <Col className="mt-20">
          <div className="d-flex w-75 justify-content-between">
            <div>
              <div className="ft-12 grey-text">File status</div>
              <div className="ft-14 font-weight-500 error-text mt-10">
                Data type match errors
              </div>
            </div>
            <div>
              <div className="ft-12 grey-text">Plan name</div>
              <div className="ft-14 font-weight-500 text-black mt-10">
                Gregarious Simulation Systems plan name big
              </div>
            </div>
            <div>
              <div className="ft-12 grey-text">Template type</div>
              <div className="ft-14 font-weight-500 text-black mt-10">
                Combined Upload - Excel
              </div>
            </div>
            <div>
              <div className="ft-12 grey-text">Download</div>
              <div className="ft-14 font-weight-500 text-black mt-10 pointer">
                <a
                  href="/assets/Data type match errors.xlsx"
                  target="_blank"
                  download="Data type match errors.xlsx"
                >
                  <DocumentTypeIcon type="xls" />
                </a>
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
          {!isEmpty(validationReports) && (
            <div className="validation-report w-75">
              <div className="plan-sub-heading">
                Data type validation report
              </div>
              {validationReports.map((report, index) => (
                <div className="ft-12 font-weight-500 text-black my-2">
                  {`${index + 1}. `}
                  {report}
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
