import React, { useState, useRef, useEffect } from "react";
import { Row, Col, Image } from "react-bootstrap";
import { ExcelNameExport } from "../../../components";
import { ssnMasking } from "../../../utils";
import { useRouterParams, useRequest } from "../../../abstracts";
import { errorValidationReport } from "./constant";
import {
  getErrorValidationInformationById,
  getDownloadErrorValidationReport,
} from "../../../services";
import PayrollAndCensus from "../../../mocks/payrollAndCensusData.json";
import { find, get } from "lodash";
import ExcelImage from "../../../styles/file-spreadsheet.png";
import * as fileSaver from "file-saver";
// import axios from "axios";
// import { apiDetails } from "../../../services/helpers";

const ErrorValidation = ({ data, payrollId }) => {
  const [errorValidation, setErrorValidation] = useState([]);
  const [element, setElement] = useState(null);
  const [start, setStart] = useState(1);
  const [isScroll, setIsScroll] = useState(true);
  const [apiData, setApiData] = useState([]);

  const { response, loading: isLoading } = useRequest({
    method: getErrorValidationInformationById,
    payload: { fileId: payrollId, pageNumber: 1 },
    defaultResponse: [],
  });

  const exportReportFile = (data) => {
    getDownloadErrorValidationReport(payrollId)
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
    setApiData(response.getErrorValidationReportDetails);
  }, [response]);

  useEffect(() => {
    setErrorValidation(apiData);
  }, [apiData]);

  useEffect(() => {
    if (start != 1) {
      getErrorValidationInformationById({
        fileId: payrollId,
        pageNumber: start,
      })
        .then((response) => {
          if (response.getErrorValidationReportDetails === []) {
            setIsScroll(false);
          } else {
            setErrorValidation([
              ...errorValidation,
              ...response.getErrorValidationReportDetails,
            ]);
          }
        })
        .catch((error) => {
          //handle error
        });
    }
  }, [start]);

  const observer = useRef(
    new IntersectionObserver(
      (entries) => {
        const first = entries[0];

        if (first.isIntersecting) {
          if (isScroll) {
            // const errorValidation = get(payrollReports, "errorValidation", []);
            if (apiData == []) {
              setIsScroll(false);
            } else {
              setStart((start) => start + 1);
            }

            // setPageCount((pageCount) => pageCount + 1);
            // getErrorValidationInformationById({
            //   fileId: payrollId,
            //   pageNumber: start,
            // })
            //   .then((response) => {
            //     if (response === []) {
            //       setIsScroll(false);
            //     } else {
            //       setErrorValidation([...errorValidation, ...response]);
            //     }
            //   })
            //   .catch((error) => {
            //     //handle error
            //   });
            // setErrorValidation([...apiData])
            // setUserRequest({
            //   start : [start + 5],
            //   errorValidation : [...errorValidation,errorValidation]
            // })
          }
        }
      },
      { threshold: 0.9 }
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
            Error Validations in {response.count} Records
          </div>
          {/* <div>
          <ExcelNameExport
            headers={errorValidationReport}
            data={errorValidation}
            fileName={"error_validation.xls"}
            name="Error Validation Report"
          />
        </div> */}
          <p className="excel-text" onClick={() => exportReportFile()}>
            Error Validation Report
            <Image src={ExcelImage} width="14px" />
          </p>
        </div>
      )}
      <div className="payroll_scroll">
        {errorValidation &&
          errorValidation?.map((item) => (
            <div ref={setElement} className="data-change">
              <Row>
                {item.name ? (
                  <>
                    <Col md="3">
                      <p className="ft-14 font-weight-500">
                        {ssnMasking(item.ssn)}
                      </p>
                      <p className="ft-14 font-weight-500">{item.name}</p>
                    </Col>
                    <Col md="2">
                      <p className="ft-12 grey-text font-weight-500">Plan ID</p>
                      <p className="ft-14 font-weight-500">{item.planId}</p>
                    </Col>
                    <Col md="2">
                      <p className="ft-12 grey-text font-weight-500">
                        Pay date
                      </p>
                      <p className="ft-14 font-weight-500">{item.payDate}</p>
                    </Col>
                  </>
                ) : (
                  <Col md="3">
                    <p className="ft-14 font-weight-500">
                      File level errors and warnings
                    </p>
                  </Col>
                )}
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
                      {item.name
                        ? error.errorType +
                          ": " +
                          error.messageCode +
                          "- " +
                          error.warningAndError
                        : error.warningAndError}
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
    </div>
  );
};

export default ErrorValidation;
