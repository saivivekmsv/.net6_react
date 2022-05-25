import React, { useState, useRef, useEffect } from "react";
import { Row, Col, Image } from "react-bootstrap";
import { ExcelNameExport } from "../../../components";
import { ssnMasking } from "../../../utils";
import { get } from "lodash";
import { dataChangeReport } from "./constant";
import { useRequest } from "../../../abstracts";
import { getDataChangeReport } from "../../../services";
import {
  getDataChangeInformationById,
  getDownloadDataChangeReport,
} from "../../../services";
import ExcelImage from "../../../styles/file-spreadsheet.png";
import * as fileSaver from "file-saver";
// import axios from "axios";
// import { apiDetails } from "../../../services/helpers";

const DataChange = ({ data, payrollId }) => {
  const [element, setElement] = useState(null);
  const [start, setStart] = useState(1);
  const [dataChange, setDataChange] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isScroll, setIsScroll] = useState(true);
  const [apiData, setApiData] = useState([]);
  const { response, loading: isLoading } = useRequest({
    method: getDataChangeInformationById,
    payload: { fileId: payrollId, pageNumber: 1 },
    defaultResponse: [],
  });

  const exportReportFile = (data) => {
    getDownloadDataChangeReport(payrollId)
      .then((response) => {
        var blob = new Blob([response], {
          type:
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        fileSaver.saveAs(blob, "DataChange.xlsx");
      })
      .catch((error) => {
        console.log("Error while retrieving source level split up");
      });
  };

  // function exportReportFile() {
  //   axios.get(apiDetails.baseUrl.trim() + '/api/v1/Report/DownloadDataChangeReport/1', { responseType: 'arraybuffer' })
  //     .then((response) => {
  //       var blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  //       fileSaver.saveAs(blob, 'DataChange.xlsx');
  //     });
  // }

  useEffect(() => {
    setApiData(response.dataChangeReportDetails);
  }, [response]);

  useEffect(() => {
    setDataChange(response.dataChangeReportDetails);
  }, [apiData]);

  useEffect(() => {
    if (start != 1) {
      getDataChangeInformationById({
        fileId: payrollId,
        pageNumber: start,
      })
        .then((response) => {
          if (response.dataChangeReportDetails === []) {
            setIsScroll(false);
          } else {
            setDataChange([...dataChange, ...response.dataChangeReportDetails]);
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

  const showPopup = () => {
    setModalOpen(true);
  };
  return (
    <div>
      <div className="d-flex justify-content-between align-center">
        <div className="ft-12 grey-text font-weight-500">
          Data Changes in {response.count} Records
        </div>
        <div>
          {/* <ExcelNameExport
            headers={dataChangeReport}
            data={dataChange}
            fileName={"data_change.xls"}
            name="Data Change Report"
          /> */}
          <p className="excel-text" onClick={() => exportReportFile()}>
            Data Change Report
            <Image src={ExcelImage} width="14px" />
          </p>
        </div>
      </div>
      <div className="payroll_scroll">
        {dataChange?.map((dataChange) => (
          <div ref={setElement} className="data-change">
            <Row>
              <Col md="3">
                <p className="ft-14 font-weight-500">
                  {ssnMasking(dataChange.employeeSSN)}
                </p>
                <p className="ft-14 font-weight-500">{dataChange.name}</p>
              </Col>
              <Col>
                {dataChange.dataChangeDetails.map((item, index) => (
                  <div>
                    <Row>
                      <Col md="3">
                        <p className="ft-12 grey-text font-weight-500">
                          Data changed
                        </p>
                        <p className="ft-14 font-weight-500">
                          {item.fieldName}
                        </p>
                      </Col>

                      <Col md="4">
                        <p className="ft-12 grey-text font-weight-500">
                          Original
                        </p>
                        <p className="ft-14 font-weight-500">{item.original}</p>
                      </Col>

                      <Col md="4">
                        <p className="ft-12 grey-text font-weight-500">
                          Changed to
                        </p>
                        <p className="ft-14 font-weight-500">
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

export default DataChange;
