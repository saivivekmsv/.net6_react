import React, { useContext, useState } from "react";
import {
  createPlanStore,
  setManagePlanFullPageData,
  setManageCreateData,
  setManagePlanToastInfo,
  savePlanDetailsAction,
  setManagePlanFlow,
} from "../../../contexts";
import { Breadcrumb, Image, Toast } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationTriangle } from "@fortawesome/pro-light-svg-icons";
import { Formik, Field } from "formik";
import {
  FieldButtonGroup,
  FieldDropSide,
  FieldInput,
  FieldInputPassword,
  FieldInputSSN,
  SearchableList,
  Select,
} from "../../../components";

function APIInfo(props) {
  const [ToastData, setToastData] = useState({
    showToast: false,
    toastTitle: "",
    toastMessage: "",
    event: "",
  });
  let { Data, setData, values, fields, setFieldValue } = props;

  const [state, setstate] = useState([
    { id: 1, value: "value 1" },
    { id: 2, value: "value 2" },
  ]);

  return (
    <div>
      <div style={{ fontSize: "18px", marginBottom: "20px" }}>
        API Information
      </div>
      <div className="form-group ">
        <Field
          name={fields.sourceUrl}
          placeholder={"URL here"}
          label={"URL"}
          noLabelTransform
          component={FieldInput}
          value={values[fields.sourceUrl]}
          isRequired
        />

        <Field
          name={fields.sourceUserName}
          placeholder={"Enter Username"}
          label={"Username"}
          noLabelTransform
          component={FieldInput}
          value={values[fields.sourceUserName]}
          isRequired
        />

        <Field
          name={fields.sourcePassword}
          placeholder={"Enter Password"}
          label={"Password"}
          noLabelTransform
          component={FieldInputPassword}
          value={values[fields.sourcePassword]}
          isRequired
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
          </Toast.Body>
        </Toast>
      </div>
    </div>
  );
}

export default APIInfo;
