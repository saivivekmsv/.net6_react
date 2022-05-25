import React, { useContext, useState } from "react";
import {
  createPlanStore,
  setManagePlanFullPageData,
  setManageCreateData,
  setManagePlanToastInfo,
  savePlanDetailsAction,
  setManagePlanFlow,
} from "../../../contexts"
import { Breadcrumb, Image, Toast } from "react-bootstrap";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationTriangle } from "@fortawesome/pro-light-svg-icons";

function APIInfo(props) {
  const [ToastData, setToastData] = useState({
    showToast: false,
    toastTitle: "",
    toastMessage: "",
    event: "",
  });
  let { Data, setData } = props;


  const [state, setstate]= useState([
    { id:1, value:'value 1'},
    { id:2, value:'value 2'},
  ])

  return (
    <div>
      <div style={{ fontSize: "18px", marginBottom:'20px' }}>
        API Information
      </div>
      <div className="form-group ">
        <label
          className="Load-def-source-selecttaglabel"
          for="ContentStartsFrom"
        >
          URL
        </label>
        <input
          style={{ width: "320px" }}
          className="form-control mb-3"
          id="ContentStartsFrom"
          placeholder="URL here"
          onChange={(event) => {
            let TempData = { ...Data };
            TempData.API = { ...TempData.API, URL: event.target.value };
            setData(TempData);
          }}
        />

        <label
          className="Load-def-source-selecttaglabel"
          for="ContentStartsFrom"
        >
          Username
        </label>
        <input
          style={{ width: "320px" }}
          className="form-control mb-3"
          id="ContentStartsFrom"
          placeholder="Enter Username"
          onChange={(event) => {
            let TempData = { ...Data };
            TempData.API = { ...TempData.API, Username: event.target.value };
            setData(TempData);
          }}
        />

        <label
          className="Load-def-source-selecttaglabel"
          for="ContentStartsFrom"
        >
          Password
        </label>
        <input
          style={{ width: "320px" }}
          type="password"
          className="form-control mb-3"
          id="ContentStartsFrom"
          placeholder="Enter Password"
          onChange={(event) => {
            let TempData = { ...Data };
            TempData.API = { ...TempData.API, Password: event.target.value };
            setData(TempData);
          }}
        />

        <button
          type="button"
          onClick={() => {
            setToastData({
              ...ToastData,
              showToast: true,
              event: "failed",
              toastMessage: "Username & Password mismatch",
              toastTitle: "Unable to connect",
            });
          }}
          className="btn btn-outline-primary"
        >
          Test Connection
        </button>

        <Toast
          onClose={() => {}}
          show={ToastData.showToast}
          style={{
            position: "fixed",
            top: "10rem",
            right: "2rem",
            zIndex: "100",
            border: "solid",
            borderColor: ToastData.event == "failed" ? "red" : "green",
            borderWidth: "5px 0px 0px 0px",
          }}
          delay={3000}
          autohide
        >
          <Toast.Body className="d-flex">
            {ToastData.event == "failed" ? (
              <FontAwesomeIcon
                icon={faExclamationTriangle}
                color="#EB5757"
                className="fa-3x mr-3"
              />
            ) : (
              <i class="fas fa-check-circle fa-3x mr-3"></i>
            )}
            <div>
              <div className="mr-2">
                <div style={{ fontSize: "18px" }}>{ToastData.toastTitle}</div>
              </div>
              <div style={{ fontSize: "14px" }}>{ToastData.toastMessage}</div>
            </div>
            {/* <div className="ml-2">
                            {true ? (
                                <FontAwesomeIcon
                                    icon={faTimesCircle}
                                    color="#000000"
                                    size="md"
                                    onClick={() =>{}}
                                />
                            ) : (
                                ""
                            )}
                        </div> */}
          </Toast.Body>
        </Toast>
      </div>
    </div>
  );
}

export default APIInfo;
