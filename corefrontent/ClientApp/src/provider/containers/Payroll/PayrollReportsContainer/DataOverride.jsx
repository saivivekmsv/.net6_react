import React from "react";
import { useState, useRef, useEffect } from "react";
import { Row, Col, Image } from "react-bootstrap";
import { ExcelNameExport } from "../../../components";
import { ssnMasking } from "../../../utils";
import { useRequest } from "../../../abstracts";
import { dataOverrideReport } from "./constant";
import {
  getDataOverrideInformationById,
  getDownloadDataOverrideReport,
} from "../../../services";
import ExcelImage from "../../../styles/file-spreadsheet.png";
import * as fileSaver from "file-saver";
import { isEmpty } from "lodash-es";
// import axios from "axios";
// import { apiDetails } from "../../../services/helpers";

const DataOverride = ({ data, payrollId }) => {
  const [dataOverride, setDataOverride] = useState([]);

  const [element, setElement] = useState(null);
  const [start, setStart] = useState(1);
  const [isScroll, setIsScroll] = useState(true);
  const [apiData, setApiData] = useState([]);
  const { response, loading: isLoading } = useRequest({
    method: getDataOverrideInformationById,
    payload: { fileId: payrollId, pageNumber: 1 },
    defaultResponse: [],
  });

  const exportReportFile = (data) => {
    getDownloadDataOverrideReport(payrollId)
      .then((response) => {
        var blob = new Blob([response], {
          type:
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        fileSaver.saveAs(blob, "DataOverride.xlsx");
      })
      .catch((error) => {
        console.log("Error while retrieving data overrride");
      });
  };

  // function exportReportFile() {
  //   axios.get(apiDetails.baseUrl.trim() + '/api/v1/Report/DownloadDataOverrideReport/1', { responseType: 'arraybuffer' })
  //     .then((response) => {
  //       var blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  //       fileSaver.saveAs(blob, 'DataOverride.xlsx');
  //     });
  // }

  useEffect(() => {
    setApiData(response.dataOverrideReportDetails);
  }, [response]);

  useEffect(() => {
    setDataOverride(apiData);
  }, [apiData]);

  useEffect(() => {
    if (start != 1) {
      getDataOverrideInformationById({
        fileId: payrollId,
        pageNumber: start,
      })
        .then((response) => {
          if (response.dataOverrideReportDetails === []) {
            setIsScroll(false);
          } else {
            setDataOverride([
              ...dataOverride,
              ...response.dataOverrideReportDetails,
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
            if (isEmpty(apiData)) {
              setIsScroll(false);
            } else {
              setStart((start) => start + 1);
            }
            // getDataOverrideInformationById({
            //   fileId: payrollId,
            //   pageNumber: start,
            // })
            //   .then((response) => {
            //     if (response === []) {
            //       setIsScroll(false);
            //     } else {
            //       setDataOverride([...dataOverride, ...response]);
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
      <div className="d-flex justify-content-between align-center">
        <div className="ft-12 grey-text font-weight-500">
          Data Changes in {response.count} Records
        </div>
        <div>
          {/* <ExcelNameExport
            headers={dataOverrideReport}
            data={dataOverride}
            fileName={"data_override.xls"}
            name="Data Override Report"
          /> */}
          <p className="excel-text" onClick={() => exportReportFile()}>
            Data Override Report
            <Image src={ExcelImage} width="14px" />
          </p>
        </div>
      </div>
      <div className="payroll_scroll">
        {dataOverride?.map((dataOverride) => (
          <div ref={setElement} className="data-change">
            <Row>
              <Col md="3">
                <p className="ft-14 font-weight-500">
                  {ssnMasking(dataOverride.employeeSSN)}
                </p>
                <p className="ft-14 font-weight-500 overflow-wrap">
                  {dataOverride.name}
                </p>
              </Col>
              <Col>
                {dataOverride.dataOverrideDetails.map((item, index) => (
                  <div>
                    <Row>
                      <Col md="3">
                        <p className="ft-12 grey-text font-weight-500">
                          Data Override
                        </p>
                        <p className="ft-14 font-weight-500 overflow-wrap">
                          {item.fieldName}
                        </p>
                      </Col>

                      <Col md="4">
                        <p className="ft-12 grey-text font-weight-500">
                          Original Data
                        </p>
                        <p className="ft-14 font-weight-500 overflow-wrap">
                          {item.original}
                        </p>
                      </Col>

                      <Col md="4">
                        <p className="ft-12 grey-text font-weight-500">
                          Submitted Data
                        </p>
                        <p className="ft-14 font-weight-500 overflow-wrap">
                          {item.changedTo}
                        </p>
                      </Col>
                    </Row>
                  </div>
                ))}
              </Col>
            </Row>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DataOverride;
