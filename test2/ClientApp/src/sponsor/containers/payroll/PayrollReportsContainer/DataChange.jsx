import React, { useState, useRef, useEffect } from "react";
import { Row, Col, Image } from "react-bootstrap";
import { ExcelNameExport } from "../../../../shared/components";
import { ssnMasking } from "../../../../shared/utils";
import { get } from "lodash";
import { dataChangeReport } from "./constant";
import { useRequest } from "../../../../shared/abstracts";
import { getDataChangeReport } from "../../../services";
import {
  getDataChangeInformationById,
  getDownloadDataChangeReport,
} from "../../../services";
// import {getDataChangeReport} from "sponsor/services/payroll";
import ExcelImage from "../../../../shared/styles/file-spreadsheet.png";
import * as fileSaver from "file-saver";
// import axios from "axios";
// import { apiDetails } from "sponsor/services/helpers";

const DataChange = ({ data }) => {
  const [element, setElement] = useState(null);
  const [start, setStart] = useState(1);
  const [dataChange, setDataChange] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);

  const { response: apiData, loading: isLoading } = useRequest({
    method: getDataChangeInformationById,
    payload: { fileId: 1, from: start, count: 5 },
    defaultResponse: [],
  });

  const exportReportFile = (data) => {
    getDownloadDataChangeReport({
      fileId: 1,
    })
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
    setDataChange([...dataChange, ...apiData]);
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

  const showPopup = () => {
    setModalOpen(true);
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-center">
        <div className="ft-12 grey-text font-weight-500">
          Data Changes in {dataChange.length} Records
        </div>
        <div>
          {/* <ExcelNameExport
            headers={dataChangeReport}
            data={dataChange}
            fileName={"data_change.xls"}
            name="Data Change Report"
          /> */}
          <p
            className="excel-text"
            onClick={() =>
              exportReportFile({
                fileId: 1,
              })
            }
          >
            Data Change Report
            <Image src={ExcelImage} width="14px" />
          </p>
        </div>
      </div>
      {dataChange.map((dataChange) => (
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
                      <p className="ft-14 font-weight-500">{item.fieldName}</p>
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

export default DataChange;
