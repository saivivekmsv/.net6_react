import React from "react";
import { useState, useRef, useEffect } from "react";
import { Row, Col, Image } from "react-bootstrap";
import { ExcelNameExport } from "shared/components";
import { ssnMasking } from "../../../../shared/utils";
import { useRequest } from "../../../../shared/abstracts";
import { dataOverrideReport } from "./constant";
import {
  getDataOverrideInformationById,
  getDownloadDataOverrideReport,
} from "../../../services";
import ExcelImage from "../../../../shared/styles/file-spreadsheet.png";
import * as fileSaver from "file-saver";
// import axios from "axios";
// import { apiDetails } from "sponsor/services/helpers";

const DataOverride = ({ data }) => {
  const [dataOverride, setDataOverride] = useState([]);

  const [element, setElement] = useState(null);
  const [start, setStart] = useState(1);
  const { response: apiData, loading: isLoading } = useRequest({
    method: getDataOverrideInformationById,
    payload: { fileId: 1, from: start, count: 5 },
    defaultResponse: [],
  });

  const exportReportFile = (data) => {
    getDownloadDataOverrideReport({
      fileId: 1,
    })
      .then((response) => {
        var blob = new Blob([response], {
          type:
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        fileSaver.saveAs(blob, "DataOverride.xlsx");
      })
      .catch((error) => {
        console.log("Error while retrieving source level split up");
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
    setDataOverride([...dataOverride, ...apiData]);
  }, [apiData]);

  const observer = useRef(
    new IntersectionObserver(
      (entries) => {
        const first = entries[0];

        if (first.isIntersecting) {
          // console.log(first.target)
          // const errorValidation = get(payrollReports, "errorValidation", []);
          setStart((start) => start + 5);
          // setErrorValidation([...apiData])
          // setUserRequest({
          //   start : [start + 5],
          //   errorValidation : [...errorValidation,errorValidation]
          // })
          // console.log(start);
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
  // console.log(dataOverride,isLoading)

  return (
    <div>
      <div className="d-flex justify-content-between align-center">
        <div className="ft-12 grey-text font-weight-500">
          Data Changes in {dataOverride.length} Records
        </div>
        <div>
          {/* <ExcelNameExport
            headers={dataOverrideReport}
            data={dataOverride}
            fileName={"data_override.xls"}
            name="Data Override Report"
          /> */}
          <p
            className="excel-text"
            onClick={() =>
              exportReportFile({
                fileId: 1,
              })
            }
          >
            Data Override Report
            <Image src={ExcelImage} width="14px" />
          </p>
        </div>
      </div>
      {dataOverride.map((dataOverride) => (
        <div ref={setElement} className="data-change">
          <Row>
            <Col md="3">
              <p className="ft-14 font-weight-500">
                {ssnMasking(dataOverride.employeeSSN)}
              </p>
              <p className="ft-14 font-weight-500">{dataOverride.name}</p>
            </Col>
            <Col>
              {dataOverride.dataOverrideDetails.map((item, index) => (
                <div>
                  <Row>
                    <Col md="3">
                      <p className="ft-12 grey-text font-weight-500">
                        Data Override
                      </p>
                      <p className="ft-14 font-weight-500">{item.fieldName}</p>
                    </Col>

                    <Col md="4">
                      <p className="ft-12 grey-text font-weight-500">
                        Original Data
                      </p>
                      <p className="ft-14 font-weight-500">{item.original}</p>
                    </Col>

                    <Col md="4">
                      <p className="ft-12 grey-text font-weight-500">
                        Submitted Data
                      </p>
                      <p className="ft-14 font-weight-500">{item.changedTo}</p>
                    </Col>
                  </Row>
                </div>
              ))}
            </Col>
          </Row>
        </div>
      ))}
    </div>
  );
};

export default DataOverride;
