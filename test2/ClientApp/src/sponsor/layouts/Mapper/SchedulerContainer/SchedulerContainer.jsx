import React, { useState, Component, useEffect } from "react";
import {
  ManageMapperLayout,
  Dropside,
  SliderPanel,
  FieldInput,
  FieldButtonGroup,
} from "../../../../shared/components";
import { Button, ToggleButton, ToggleButtonGroup } from "react-bootstrap";
import { Field, Formik, Form } from "formik";
import SchedulerSlider from "./SchedulerSlider";
import { components } from "react-select";
import { default as ReactSelect } from "react-select";
import "../../../styles/containers/SchedulerContainer.scss";

const SchedulerContainer = (props) => {
  const buttons = [
    {
      label: "Cancel",
      variant: "secondary",
      type: "button",
    },
    {
      label: "Next",
      variant: "primary",
      type: "submit",
    },
  ];

  const [textDisplay, settextDispay] = useState(null);
  const [isSliderOpen, setSliderOpen] = useState(false);
  const [isFreqSelected, setFreqSelected] = useState(false);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedOptn, setSelectedOptn] = useState(null);
  // const[setOptnText,optnText]=useState(null);
  let optnText = "";

  const initialValues = {
    FURL: "",
    FPath: "",
    FUserName: "",
    FPassword: "",
    SelectedTime: "",
    Optn1: "",
    Optn2: "",
    SelectedFreq: "",
    optnText: "",
    StartHour: "",
    StartMinute: "",
    StartStatement: "",
  };

  const yesNoOptions = [
    {
      label: "Yes",
      value: true,
    },

    {
      label: "No",
      value: false,
    },
  ];

  const [requireFTP, setRequireFTP] = useState(false);

  return (
    <Formik
      initialValues={initialValues}

      //  onSubmit={onSubmit}
    >
      {({ errors, values, touched, setValues, handleChange }) => (
        <ManageMapperLayout buttons={buttons}>
          <div>
            <div className="FTPDetailsText">FTP Details</div>

            <div className="FTPFieldsText">Requires FTP</div>
            <Field
              isRequired
              name="FTP require"
              size="md"
              className="bg-transparent p-0"
              options={yesNoOptions}
              selectedValue={requireFTP}
              onChange={(value) => {
                setRequireFTP(value);
                values.FURL = "";
                values.FPath = "";
                values.FUserName = "";
                values.FPassword = "";
              }}
              component={FieldButtonGroup}
            />

            {requireFTP && (
              <div style={{ width: "20rem", paddingTop: "0.2rem" }}>
                <div className="FTPFieldsText">
                  FTP URL
                  <div>
                    <Field
                      type="text"
                      name="FURL"
                      value={values.FURL}
                      placeholder={"eg : ftp://yourname@host.dom/"}
                      className="FInputs"
                    />
                  </div>
                </div>
                <div className="FTPFieldsText">
                  FTP path
                  <div>
                    <Field
                      type="text"
                      name="FPath"
                      value={values.FPath}
                      className="FInputs"
                      placeholder={"eg : ftp.yourname@host.dom/batchfile"}
                    />
                  </div>
                </div>
                <div className="FTPFieldsText">
                  UserName
                  <div>
                    <Field
                      type="text"
                      name="FUserName"
                      value={values.FUserName}
                      className="FInputs"
                      placeholder={"Enter UserName"}
                    />
                  </div>
                </div>
                <div className="FTPFieldsText">
                  Password
                  <div>
                    <Field
                      type="password"
                      name="FPassword"
                      value={values.FPassword}
                      className="FInputs"
                      placeholder={"Enter Password"}
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="freqText">Frequency</div>
            {isFreqSelected ? (
              <div style={{ display: "flex" }}>
                <div className="mr-2">
                  <p id="freqDisplayText" className="displayOptn">
                    {values.optnText}
                  </p>
                  <p id="freqDisplayText" className="displayOptn">
                    {values.StartStatement}
                  </p>
                </div>
                <i
                  className="far fa-edit"
                  style={{
                    color: " #2F80ED",
                    marginTop: "0.2rem",
                    cursor: "pointer",
                  }}
                  onClick={() => setSliderOpen(true)}
                >
                  {" "}
                </i>
              </div>
            ) : (
              <a className="SliderBtn" onClick={() => setSliderOpen(true)}>
                Click here to select
              </a>
            )}
            <SchedulerSlider
              setSliderOpen={setSliderOpen}
              isSliderOpen={isSliderOpen}
              setFreqSelected={setFreqSelected}
              values={values}
              handleChange={handleChange}
              setSelectedTime={setSelectedTime}
              setSelectedOptn={setSelectedOptn}
              isFreqSelected={isFreqSelected}
            ></SchedulerSlider>
          </div>
          {/* <pre>{JSON.stringify(values, null, 2)}</pre> */}
        </ManageMapperLayout>
      )}
    </Formik>
  );
};

export default SchedulerContainer;
