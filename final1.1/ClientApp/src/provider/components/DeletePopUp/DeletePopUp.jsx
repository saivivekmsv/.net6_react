import React, { useEffect, useState } from "react";
import { Prompt } from "react-router-dom";
import { Button, Modal } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ssnMasking, usDateFormat } from "../../utils";
import {
  faTrashAlt,
  faExclamationTriangle,
  faTimes,
} from "@fortawesome/pro-light-svg-icons";

const DeletePopUp = ({ msg, onclick, modelOpen, modelClose }) => {
  return (
    <Modal show={modelOpen}>
      <Modal.Body style={{ borderTop: "5px solid #f94f50" }}>
        <div className="text-right">
          <FontAwesomeIcon
            icon={faTimes}
            color="#000"
            onClick={() => {
              modelClose(false);
            }}
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
          <div className="remove-text">
            <p>{msg}</p>
            <br />
            <Button
              className="remove-btn mr-4"
              onClick={() => {
                onclick();
              }}
            >
              Delete
            </Button>
            <Button
              className="cancel-btn"
              onClick={() => {
                modelClose(false);
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};
export default DeletePopUp;
