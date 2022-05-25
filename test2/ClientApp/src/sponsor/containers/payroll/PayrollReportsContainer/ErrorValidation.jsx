import React, { useState, useRef, useEffect } from "react";
import { Row, Col, Image } from "react-bootstrap";
import { ExcelNameExport } from "../../../../shared/components";
import { ssnMasking } from "../../../../shared/utils";
import { useRouterParams, useRequest } from "../../../../shared/abstracts";
import { errorValidationReport } from "./constant";
import {
  getErrorValidationInformationById,
  getDownloadErrorValidationReport,
} from "../../../services";
import PayrollAndCensus from "../../../../shared/mocks/payrollAndCensusData.json";
import { find, get } from "lodash";
import ExcelImage from "../../../../shared/styles/file-spreadsheet.png";
import * as fileSaver from "file-saver";
// import axios from "axios";
// import { apiDetails } from "sponsor/services/helpers";

const ErrorValidation = ({ data }) => {
  const [errorValidation, setErrorValidation] = useState([]);
  const [element, setElement] = useState(null);
  const [start, setStart] = useState(1);
  const { response: apiData, loading: isLoading } = useRequest({
    method: getErrorValidationInformationById,
    payload: { fileId: 1, from: start, count: 5 },
    defaultResponse: [],
  });

  const exportReportFile = (data) => {
    getDownloadErrorValidationReport({
      fileId: 1,
    })
      .then((response) => {
        var blob = new Blob([response], {
          type:
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        fileSaver.saveAs(blob, "ErrorValidation.xlsx");
      })
      .catch((error) => {
        console.log("Error while retrieving error validation");
      });
  };

  // function exportReportFile() {
  //   axios.get(apiDetails.baseUrl.trim() + '/api/v1/Report/DownloadErrorReport/1', { responseType: 'arraybuffer' })
  //     .then((response) => {
  //       var blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  //       fileSaver.saveAs(blob, 'ErrorValidation.xlsx');
  //     });
  // }

  useEffect(() => {
    setErrorValidation([...errorValidation, ...apiData]);
    // console.log("effect",errorValidation)
  }, [apiData]);

  const observer = useRef(
    new IntersectionObserver(
      (entries) => {
        const first = entries[0];

        if (first.isIntersecting) {
          // console.log(first.target)
          setStart((start) => start + 5);
        }
      },
      { threshold: 0.2 }
    )
  );

  useEffect(() => {
    const currentElement = element;
    const currentObserver = observer.current;

    if (currentElement) {
      currentObserver.observe(currentElement);
    }

    return () => {
      if (currentElement) {
        currentObserver.unobserve(currentElement);
      }
    };
  }, [element]);

  return (
    <div>
      {errorValidation && (
        <div className="d-flex justify-content-between align-center">
          <div className="ft-12 grey-text font-weight-500">
            Error Validations in {errorValidation.length} Records
          </div>
          {/* <div>
          <ExcelNameExport
            headers={errorValidationReport}
            data={errorValidation}
            fileName={"error_validation.xls"}
            name="Error Validation Report"
          />
        </div> */}
          <p
            className="excel-text"
            onClick={() =>
              exportReportFile({
                fileId: 1,
              })
            }
          >
            Error Validation Report
            <Image src={ExcelImage} width="14px" />
          </p>
        </div>
      )}
      {errorValidation &&
        errorValidation.map((item) => (
          <div ref={setElement} className="data-change">
            <Row>
              <Col md="3">
                <p className="ft-14 font-weight-500">{ssnMasking(item.ssn)}</p>
                <p className="ft-14 font-weight-500">{item.name}</p>
              </Col>
              <Col md="2">
                <p className="ft-12 grey-text font-weight-500">Plan ID</p>
                <p className="ft-14 font-weight-500">{item.planId}</p>
              </Col>
              <Col md="2">
                <p className="ft-12 grey-text font-weight-500">Pay date</p>
                <p className="ft-14 font-weight-500">{item.payDate}</p>
              </Col>
              <Col md="2">
                <p className="ft-12 grey-text font-weight-500">
                  Warnings & errors
                </p>
                <p className="ft-14 font-weight-500">
                  {item.warningsAndErrorsCount}
                </p>
              </Col>
            </Row>
            <Row className="mt-10">
              <Col md="8">
                <p className="ft-12 black-text font-weight-500">
                  Warnings & errors
                </p>
                {item.warningsAndErrors.map((error) => (
                  <p className="ft-12 grey-text font-weight-500">
                    {error.warningAndError}
                  </p>
                ))}
              </Col>
              <Col md="4">
                <p className="ft-12 black-text font-weight-500">Status</p>
                {item.warningsAndErrors.map((error) => (
                  <p className="ft-12 grey-text font-weight-500">
                    {error.status}
                  </p>
                ))}
              </Col>
            </Row>
          </div>
        ))}
    </div>
  );
};

export default ErrorValidation;
