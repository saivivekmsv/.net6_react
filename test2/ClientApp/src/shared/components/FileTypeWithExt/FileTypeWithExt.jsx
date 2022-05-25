import React from "react";
import { Image, OverlayTrigger, Tooltip } from "react-bootstrap";
import { find, get, isEmpty } from "lodash";
import upload from "../../styles/upload.png";
import AddToolTip from "../../components/AddToolTip";
const FileTypeWithExt = ({ fileName, description }) => {

  console.log(get(fileName));
  return (
    <div>
      <p className="word-wrap-name excel-text ft-14 m-0">
        {
          fileName
         > 30 ? (
          <AddToolTip
            className="ft-14 font-weight-500 pb-3 company-name"
            name={fileName}>
        
            <p className="ft-14 black-text font-weight-500 mt-10 mb-10">
              <Image src={upload} className="mr-2" /> {(fileName || "").slice(0, 30)}...
            </p>
           </AddToolTip>
        ) : (
          <p className="ft-14 black-text font-weight-500 mt-10 mb-10">
            <Image src={upload} className="mr-2" /> {fileName}
          </p>
        )}
      </p>
    </div>
  );
};

export default FileTypeWithExt;
