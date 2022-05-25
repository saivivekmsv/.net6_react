import React from "react";
import ExcelImage from "../../styles/file-spreadsheet.png";
import { CSVLink } from "react-csv";
import { Image } from "react-bootstrap";

const ExcelNameExport = ({ data, name, fileName, headers }) => {
  return (
    <div className="excel-text">
      <CSVLink data={data} filename={fileName} headers={headers}>
        {name} <Image src={ExcelImage} width="14px" />
      </CSVLink>
    </div>
  );
};

export default ExcelNameExport;
