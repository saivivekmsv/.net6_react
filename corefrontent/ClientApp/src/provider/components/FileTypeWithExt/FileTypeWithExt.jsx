import React from "react";
import { Image, OverlayTrigger, Tooltip } from "react-bootstrap";
import { find, get, isEmpty } from "lodash";
import upload from "../../styles/upload.png";
const FileTypeWithExt = ({ fileName, description }) => {
  return (
    <div>
      <p className="word-wrap-name excel-text ft-14 m-0">
        {get(fileName) ? (
          fileName.length
        ) : 0 > 50 ? (
          <OverlayTrigger overlay={<Tooltip>{fileName}</Tooltip>}>
            <p className="ft-14 black-text font-weight-500 mt-10 mb-10">
              <Image src={upload} className="mr-2" /> {fileName}
            </p>
          </OverlayTrigger>
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
