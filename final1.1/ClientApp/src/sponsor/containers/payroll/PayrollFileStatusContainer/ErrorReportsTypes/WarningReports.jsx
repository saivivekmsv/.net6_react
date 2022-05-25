import React, { useState, useEffect } from "react";
import { Row, Col, Button, Toast } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTimes,
  faTimesCircle,
  faExclamationTriangle,
} from "@fortawesome/pro-light-svg-icons";
import { SliderPanel, CsplTable as Table } from "../../../../../shared/components";
import { useRouterParams } from "../../../../../shared/abstracts";
import {
  acceptAllWarningsInaFile,
  acceptWarningByMessageCode,
  getWarningsInECR,
  getErrorsInECR,
} from "../../../../services";
import { errors } from "../../../../../shared/utils";

const columns = [
  {
    label: "SSN",
    className: "column-custodianName",
    columnName: "ssn",
  },
  {
    label: "Employee name",
    className: "column-custodianMail",
    columnName: "employeeName",
  },
  {
    label: "Pay date",
    className: "column-custodianPhone",
    columnName: "paydate",
  },
];

const WarningReports = (props) => {
  const { fileId, toggleUseEffect, tabChange } = props;
  const [isModalOpen, setModalOpen] = useState(false);
  const [Errors, setErrors] = useState();
  const [warningRecords, setWarnings] = useState([]);

  const [selectedList, setSelectedList] = useState({
    errorCount: [],
  });
  const [toggle, setToggle] = useState(true);
  useEffect(() => {
    getWarningsInECR(fileId).then((response) => {
      setWarnings(response);
      console.log(response, "WARNING RECORDS", fileId);
    });
  }, [toggle]);
  useEffect(() => {
    getErrorsInECR(fileId).then((response) => {
      setErrors(response);

      console.log(response, "ERROR RECORDS ", fileId);
    });
  }, [toggle]);

  const refresh = () => {
    setToggle(!toggle);
  };
  const [showToast, setShowToast] = useState(false);
  const [showToastAll, setShowToastAll] = useState(false);
  const [showAllToastMsg, setShowAllToastMsg] = useState([]);

  const handleAcceptAll = () => {
    acceptAllWarningsInaFile(fileId, 2).then((response) => {
      console.log(response);
      if (response) {
        const updatedList = warningRecords.map((item) => {
          return item;
        });
        toggleUseEffect();
        refresh();
        setShowAllToastMsg(updatedList);
        setShowToastAll(true);
        //console.log("Errors",Errors.length)
        if (Errors.length === 0) {
          tabChange(3);
          //console.log(tabChange(4))
        }
      }
    });
  };

  const undoAll = () => {
    const updatedList = warningRecords.map((item) => {
      return item;
    });
    setShowToastAll(false);
    setShowToast(false);
  };

  const undo = () => {
    const data = [...warningRecords, ...showAllToastMsg];
    setShowToast(false);
  };
  //console.log('Warnings length is',warningRecords.length);
  const handleAccept = (id, messageCode) => {
    // let newData = Reports.filter((item) => {
    //   return item.id === id;
    // });
    // setShowAllToastMsg(newData);
    // const Lists = Reports.filter((val) => val.id !== id);
    // setWarningReports(Lists);
    console.log(id, messageCode, "ACCEPTWARNING");
    console.log("Warnings length is", warningRecords.length);
    if (warningRecords.length === 1 && Errors.length === 0) tabChange(3);
    acceptWarningByMessageCode(id, messageCode, 2).then((response) => {
      toggleUseEffect();
      refresh();
    });
    setShowToast(true);
    setModalOpen(false);
  };

  const showPopup = (id) => {
    const selected = warningRecords.filter((item) => {
      return id === item.id;
    });
    console.log("waring Records selected", selected);
    setSelectedList(selected);
    setModalOpen(true);
  };

  return (
    <div>
      <Row className="error-types-box">
        <Col md="8">Warning</Col>
        <Col md="2">No of records</Col>
        <Col md="2">
          {warningRecords.length < 1 ? (
            ""
          ) : (
            <span onClick={handleAcceptAll} className={"link-text pointer"}>
              Accept All
            </span>
          )}
        </Col>
      </Row>
      {warningRecords.map((warning, index) => (
        <Row className="error-types-box" key={index}>
          <Col md="8">{`${warning.messageCode} ${warning.messageDescCode}`}</Col>
          <Col md="2">
            <span
              onClick={() => showPopup(warning.id)}
              className="pointer link-text"
            >
              {warning.noOfRecords}
            </span>
          </Col>
          <Col md="2">
            <span
              onClick={() => handleAccept(fileId, warning.messageCode)}
              className={"ft-12 pointer link-text"}
            >
              Accept
            </span>
          </Col>
        </Row>
      ))}
      <div className="no-found">{warningRecords < 1 ? "No warnings" : ""}</div>
      <SliderPanel
        isOpen={isModalOpen}
        size="40"
        showCancel={false}
        backdropClicked={() => setModalOpen(false)}
      >
        <div className="d-flex justify-content-between">
          <div className="ft-14 font-weight-500">Warning details</div>
          <div>
            <FontAwesomeIcon
              icon={faTimes}
              size="18px"
              color="#828282"
              onClick={() => setModalOpen(false)}
              className="pointer"
            />
          </div>
        </div>
        <div className="border-top mt-10" />
        <p className="mtb-30 ft-14">
          {selectedList[0] && selectedList[0].messageCode} -{" "}
          {selectedList[0] && selectedList[0].messageDescCode}
        </p>
        <div className="text-right">
          {selectedList[0] && selectedList[0].accepted === true ? (
            <Button disabled={true} className="btn-disabled">
              Accepted
            </Button>
          ) : (
            <Button
              onClick={() =>
                handleAccept(selectedList[0] && selectedList[0].id)
              }
            >
              Accept Warning
            </Button>
          )}
          <p className="mt-10 font-weight-500 ft-12">
            No of records {selectedList[0] && selectedList[0].noOfRecords}
          </p>
        </div>
        <Table>
          <Table.Thead>
            <Table.Tr>
              {columns.map((item, index) => {
                return (
                  <Table.Th key={index} className={item.className}>
                    {item.label}
                  </Table.Th>
                );
              })}
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {selectedList[0] &&
              selectedList[0].warningCount &&
              selectedList[0].warningCount.map((warning, index) => {
                return (
                  <Table.Tr key={index}>
                    <Table.Td className="column-custodianName">
                      {warning.ssn}
                    </Table.Td>
                    <Table.Td className="column-custodianMail">
                      {warning.employeeName}
                    </Table.Td>
                    <Table.Td className="column-custodianPhone">
                      {warning.paydate}
                    </Table.Td>
                  </Table.Tr>
                );
              })}
          </Table.Tbody>
        </Table>
      </SliderPanel>
      <Toast
        onClose={() => setShowToastAll(false)}
        show={showToastAll}
        style={{
          position: "fixed",
          top: "4rem",
          right: "1rem",
          zIndex: "100",
        }}
        className="info-toast"
        delay={500000}
        autohide
      >
        <Toast.Body>
          <div className="d-flex justify-content-between">
            <div className="info-text">
              <FontAwesomeIcon
                icon={faExclamationTriangle}
                color="#FF9716"
                className="pointer ft-24 tri-claim"
              />
              <span className="warning-text ft-12">All Warning Accepted</span>
            </div>
            <div>
              <FontAwesomeIcon
                icon={faTimesCircle}
                color="#000"
                onClick={() => setShowToastAll(false)}
                className="pointer"
              />
            </div>
          </div>
          <div className="d-flex justify-content-between mt-10">
            <div className="total-record">5 Records Accepted</div>
            <div className="warning-undo-btn" onClick={undoAll}>
              Undo
            </div>
          </div>
        </Toast.Body>
      </Toast>
      <Toast
        onClose={() => setShowToast(false)}
        show={showToast}
        style={{
          position: "fixed",
          top: "4rem",
          right: "1rem",
          zIndex: "99999",
        }}
        className="info-toast"
        delay={5000}
        autohide
      >
        <Toast.Body>
          <div className="d-flex justify-content-between">
            <div className="info-text">
              <FontAwesomeIcon
                icon={faExclamationTriangle}
                color="#FF9716"
                className="pointer ft-24 tri-claim"
              />
              <span className="warning-text ft-12">Warning Accepted</span>
            </div>
            <div>
              <FontAwesomeIcon
                icon={faTimesCircle}
                color="#000"
                onClick={() => setShowToast(false)}
                className="pointer"
              />
            </div>
          </div>
          <div>
            <ul className="warning-list">
              {showAllToastMsg &&
                showAllToastMsg.map((warning) => <li>{warning.warning}</li>)}
            </ul>
          </div>
          <div className="d-flex justify-content-between">
            <div className="total-record">
              {showAllToastMsg &&
                showAllToastMsg[0] &&
                showAllToastMsg[0].warningCount}{" "}
              Records Accepted
            </div>
            <div className="warning-undo-btn" onClick={undo}>
              Undo
            </div>
          </div>
        </Toast.Body>
      </Toast>
    </div>
  );
};

export default WarningReports;
