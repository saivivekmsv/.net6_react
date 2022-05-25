import React, { useState } from "react";
import { Image } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown } from "@fortawesome/pro-light-svg-icons";
import ExcelImage from "../../styles/file-spreadsheet.png";
import * as fileSaver from "file-saver";
// import axios from "axios";
// import { apiDetails } from "../../services/helpers";
import {
  getDownloadInputFileReport,
  getDownloadSubmittedFileReport,
} from "../../services";

const ExcelDropDown = ({
  submittedFile,
  submittedFileExcel,
  inputFile,
  inputFileExcel,
  header,
  fileName,
}) => {
  const [expand, setExpand] = useState(false);

  const onExpand = () => {
    setExpand(!expand);
  };

  const exportInputFile = (data) => {
    getDownloadInputFileReport({
      fileId: 1,
    })
      .then((response) => {
        var blob = new Blob([response], {
          type:
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        fileSaver.saveAs(blob, "InputFile.xlsx");
      })
      .catch((error) => {
        console.log("Error while retrieving input file");
      });
  };

  const exportSubmittedFile = (data) => {
    getDownloadSubmittedFileReport({
      fileId: 1,
    })
      .then((response) => {
        var blob = new Blob([response], {
          type:
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        fileSaver.saveAs(blob, "SubmittedFile.xlsx");
      })
      .catch((error) => {
        console.log("Error while retrieving submitted file");
      });
  };

  // function exportInputFile() {
  //   axios.get(apiDetails.baseUrl.trim() + '/api/v1/Report/DownloadInputFile/1', { responseType: 'arraybuffer' })
  //     .then((response) => {
  //       var blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  //       fileSaver.saveAs(blob, 'InputFile.xlsx');
  //     });
  // }

  // function exportSubmittedFile() {
  //   axios.get(apiDetails.baseUrl.trim() + '/api/v1/Report/DownloadSubmittedFile/1', { responseType: 'arraybuffer' })
  //     .then((response) => {
  //       var blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  //       fileSaver.saveAs(blob, 'SubmittedFile.xlsx');
  //     });
  // }
  return (
    <div>
      <div className="dropdown-excel-button">
        <Image src={ExcelImage} width="20px" />{" "}
        <span className="arrow-icon-drop">
          <FontAwesomeIcon
            icon={faAngleDown}
            color="#333333"
            className="ft-30"
            onClick={onExpand}
          />
        </span>
      </div>
      {expand ? (
        <ul className="dropdown-excel">
          <li className="text-black">Download file</li>
          <li
            onClick={() =>
              exportSubmittedFile({
                fileId: 1,
              })
            }
          >
            {submittedFile}
          </li>
          <li
            onClick={() =>
              exportInputFile({
                fileId: 1,
              })
            }
          >
            {inputFile}
          </li>
        </ul>
      ) : (
        ""
      )}
    </div>
  );
};

export default ExcelDropDown;
