import { Field, Formik } from "formik";
import React, { useState } from "react";
import { FieldButtonGroup } from "../../../../shared/components";
import { ManageMapperLayout } from "../../../../shared/components";
import Select from "react-select";

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

const Target = (props) => {
  const initialValues = {
    OutChoice: "",
    DCFormat: "",
    FileFormat: "",
    FURL: "",
    FPath: "",
    FUserName: "",
    FPassword: "",
    Fg: "",
  };

  const [requireFTP, setRequireFTP] = useState(true);

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

  const typeOptions = [
    { value: 0, label: "CORE" },
    { value: 1, label: "File" },
  ];

  const DCFormatoptions = [
    { value: 0, label: "DC - Payroll & Census" },
    { value: 1, label: "DC - Payroll" },
    { value: 2, label: "DC - Census" },
  ];

  const FileFormOptions = [
    { value: 0, label: "Excel" },
    { value: 1, label: "CSV" },
    { value: 2, label: "JSON" },
    { value: 3, label: "XML" },
    { value: 4, label: "Fixed Width" },
  ];

  function onSubmit(fields) {
    // display form field values on success
    alert("SUCCESS!! :-)\n\n" + JSON.stringify(fields, null, 4));
  }

  const style = {
    dropdownIndicator: (provided) => ({
      ...provided,
      svg: {
        fill: "black",
      },
    }),
    menu: (base) => ({
      ...base,
      zIndex: 100,
    }),
  };

  return (
    <Formik initialValues={initialValues} onSubmit={onSubmit}>
      {({ errors, values, touched, setValues, handleChange }) => (
        <ManageMapperLayout buttons={buttons}>
          <div style={{ paddingTop: "2.5rem" }}>
            <div style={{ paddingBottom: "0.5rem" }} className="Topic">
              Type
            </div>
            <div
              style={{
                width: "20rem",
                fontSize: "14px",
                font: "Poppins",
                fontWeight: "400",
                paddingBottom: "1rem",
              }}
            >
              <Select
                name="OutChoice"
                options={typeOptions}
                components={{
                  IndicatorSeparator: () => null,
                }}
                styles={style}
                isSearchable={false}
                placeholder={"Choose"}
                value={values.OutChoice}
                onChange={(selectedOption) => {
                  let event = {
                    target: { name: "OutChoice", value: selectedOption },
                  };
                  handleChange(event);
                }}
              />
            </div>
            {values.OutChoice.value == 1 ? (
              <div>
                <div className="Topic" style={{ paddingBottom: "0.5rem" }}>
                  File Format
                </div>
                <div
                  style={{
                    width: "20rem",
                    fontSize: "14px",
                    font: "Poppins",
                    fontWeight: "400",
                  }}
                >
                  <Select
                    name="FileFormat"
                    options={FileFormOptions}
                    components={{
                      IndicatorSeparator: () => null,
                    }}
                    styles={style}
                    isSearchable={false}
                    placeholder={"Choose"}
                    value={values.FileFormat}
                    onChange={(selectedOption) => {
                      let event = {
                        target: { name: "FileFormat", value: selectedOption },
                      };
                      handleChange(event);
                    }}
                  />
                  <div>
                    <div
                      className="FTPDetailsText"
                      style={{ paddingTop: "1.5rem", paddingBottom: "0.5rem" }}
                    >
                      FTP Details
                    </div>

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
                      <div style={{ width: "20rem", paddingTop: "0.5rem" }}>
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
                              placeholder={
                                "eg : ftp.yourname@host.dom/batchfile"
                              }
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
                  </div>
                </div>
              </div>
            ) : (
              <> </>
            )}
            {values.OutChoice.value == 0 ? (
              <div>
                <div className="Topic" style={{ paddingBottom: "0.5rem" }}>
                  Data Model
                </div>
                <div
                  style={{
                    width: "20rem",
                    fontSize: "14px",
                    font: "Poppins",
                    fontWeight: "400",
                  }}
                >
                  <Select
                    name="DCFormat"
                    options={DCFormatoptions}
                    components={{
                      IndicatorSeparator: () => null,
                    }}
                    styles={style}
                    isSearchable={false}
                    placeholder={"Choose"}
                    value={values.DCFormat}
                    onChange={(selectedOption) => {
                      let event = {
                        target: { name: "DCFormat", value: selectedOption },
                      };
                      handleChange(event);
                    }}
                  />
                </div>
              </div>
            ) : (
              <></>
            )}
            {/* <pre>{JSON.stringify(values, null, 2)}</pre> */}
          </div>
        </ManageMapperLayout>
      )}
    </Formik>
  );
};

export default Target;
