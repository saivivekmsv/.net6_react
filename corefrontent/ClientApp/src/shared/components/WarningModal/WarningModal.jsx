import React from "react";
import {
  faExclamationTriangle,
  faTimesCircle,
} from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Modal } from "react-bootstrap";

const WarningModal = ({ show, onHide, children }) => {
  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Body
        style={{
          borderTop: "5px solid #f94f50",
        }}
      >
        <div className="close-button text-right">
          <FontAwesomeIcon
            icon={faTimesCircle}
            color="#000"
            onClick={onHide}
            size="lg"
          />
        </div>
        <div className="d-flex">
          <div className="pd-15">
            <FontAwesomeIcon
              icon={faExclamationTriangle}
              color="#f94f50"
              size="3x"
            />
          </div>
          {children}
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default WarningModal;
