import React from "react";
import FileTypeWithExt from "../FileTypeWithExt";
import { Image } from "react-bootstrap";
import AddToolTip from "../../components/AddToolTip";
import { usDateFormat } from "../../utils";
import moment from "moment";
import { getDownloadInputFileReport } from "../../services";
import FileSaver from "file-saver";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload } from "@fortawesome/pro-light-svg-icons";
const downloadFile = (id, filename) => {
  var extension =
    filename?.split(".")[filename?.split(".").length - 1] == "csv"
      ? "csv"
      : "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

  getDownloadInputFileReport(id).then((response) => {
    console.log(response);
    var blob = new Blob([response], {
      type: extension,
    });
    FileSaver.saveAs(blob, filename);
  });
};
const PayrollCardTop = (props) => {
  const { data } = props;
  console.log(data, "data in paryollcardtop");
  let iconSrc = "/assets/icons/svg/file-spreadsheet.svg";
  return (
    <div className="d-flex justify-content-between align-baseline">
      <div>
        <p className="ft-14 font-weight-500 text-black mt-10">
          <FontAwesomeIcon icon={faUpload} />
          {`  ${data.uploadedThrough}`}
        </p>
      </div>
      {data.fileName && data.fileName.length >= 30 ? (
        <AddToolTip
          className="ft-14 font-weight-500 pb-3 company-name"
          name={data.fileName}
        >
          <p className="ft-14 black-text font-weight-500 mt-10 mb-10">
            {(data.fileName || "").slice(0, 30)}...
            {/* {data.description} */}
          </p>
        </AddToolTip>
      ) : (
        <FileTypeWithExt
          fileName={data.fileName}
          description={data.description}
        />
      )}

      <div>
        <p className="ft-14 font-weight-500 text-black mt-10">
          {moment(new Date(data.uploadedDate)).fromNow()}
        </p>
      </div>

      <div>
        <p className="ft-14 font-weight-500 text-black mt-10">
          {usDateFormat(data.uploadedDate) &&
            usDateFormat(data.uploadedDate).replaceAll("/", "-")}
        </p>
      </div>

      <div>
        <p className="ft-14 font-weight-500 text-black mt-10">
          {moment(new Date(data.uploadedDate)).format("hh:mm:ss")}
        </p>
      </div>

      <div>
        <p className="mr-2 ft-12 grey-text">Uploaded by</p>
        <p className="ft-14 font-weight-500 text-black mt-10">
          {data.uploadedBy}
        </p>
      </div>
      <div>
        <p className="mr-2 ft-12 grey-text">Download File</p>
        <p className="">
          <Image
            src={iconSrc}
            className="pointer"
            onClick={() => {
              downloadFile(data.id, data.fileName);
            }}
          />
        </p>
      </div>
    </div>
  );
};

export default PayrollCardTop;
