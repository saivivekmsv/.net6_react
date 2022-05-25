import React from "react";
import { Image } from "react-bootstrap";

const DocumentTypeIcon = ({ type }) => {
  let iconSrc = "";

  if (type.indexOf("xls") !== -1) {
    iconSrc = "/assets/icons/svg/file-spreadsheet.svg";
  }
  return (
    <div className="d-flex align-items-end">
      <Image src={iconSrc} />
      &nbsp;
      <span className="ft-12 grey-text">{`.${type}`}</span>
    </div>
  );
};

export default DocumentTypeIcon;
