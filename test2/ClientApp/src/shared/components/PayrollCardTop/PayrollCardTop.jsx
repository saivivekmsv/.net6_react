import React from "react";
import FileTypeWithExt from "../FileTypeWithExt";
import { Image, Col, Row } from "react-bootstrap";
import moment from "moment";
import {ProgressFileStatus} from "../../components";
import { find, get, isEmpty } from "lodash";
const PayrollCardTop = (props) => {
  const { data,graphData,errorType } = props;
  console.log(data, "data in paryollcardtop");
  let iconSrc = "/assets/icons/svg/file-spreadsheet.svg";
  return (
    <Row className="w-100">
      <Col md={4} className="d-flex flex-column" >
        <FileTypeWithExt
          fileName={data.fileName}
          description={data.description}
        />
        <p>File description goes here, text will be displayed in full length and might spill over into the next line but a world limit of 200 characters should be put on it.</p>
        <div className="d-flex flex-row justify-content-between w-50">
          <span> {moment(new Date(data.uploadedDate)).fromNow()}</span>
          <span>{moment(data.uploadedDate).format("MM/DD/yyyy")}</span>
          <span>{data.uploadedTime}</span>
        </div>
      </Col>
      <Col md={2} className="d-flex flex-column">
        <span className="text-muted">Uploaded by</span>
        <span className="mt-2">{data.uploadedBy}</span>
      </Col>
      <Col md={2}>
        <p className="mr-2 ft-12 grey-text">Download File</p>
        <p className="mt-2">
          <Image src={iconSrc} className="pointer" />
        </p>

      </Col>
      <Col md={4}>
        <ProgressFileStatus
          stepperDetails={data.progress}
          status={graphData.status}
          fileStatus={graphData.status}
          errorType={errorType}
          warnings={get(graphData, "warningsCount", 0)}
          errors={get(graphData, "errorsCount", 0)}
          validationReports={get(data, "validationReports", [])}
          duplicatesCount={get(graphData, "duplicatesCount", [])}
          showTrash={false}
        />

      </Col>
    </Row>
  );
};

export default PayrollCardTop;
