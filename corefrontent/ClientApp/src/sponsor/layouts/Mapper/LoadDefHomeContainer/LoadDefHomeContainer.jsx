import React, { useState } from "react";
import { ManageMapperLayout } from "../../../../shared/components";
import { Field, Formik } from "formik";
import Select from "react-select";

const LoadDefHomeContainer = (props) => {
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

  const initialValues = {
    ProfileName: "",
    ProfileType: {
      value: 0,
      label: "Input Profile",
    },
  };
  const typeOptions = [
    { value: 0, label: "Input Profile" },
    { value: 1, label: "Output Profile" },
  ];
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
    <Formik
      initialValues={initialValues}
      // onSubmit={onSubmit}
    >
      {({ errors, values, touched, setValues, handleChange }) => (
        <ManageMapperLayout buttons={buttons}>
          <div
            style={{
              fontSize: "18px",
              fontWeight: "500",
              color: " #494F5A",
              paddingBottom: "1.5rem",
            }}
          >
            Define your profile name
          </div>
          <div>
            <div className="Topic">
              Profile Name
              <div>
                <Field
                  type="text"
                  name="ProfileName"
                  className="FInputs"
                  value={values.ProfileName}
                  placeholder={"Enter the profile name"}
                />
              </div>
            </div>
            <div
              style={{ paddingBottom: "0.5rem", paddingTop: "1.5rem" }}
              className="Topic"
            >
              Profile Type
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
                name="ProfileType"
                options={typeOptions}
                components={{
                  IndicatorSeparator: () => null,
                }}
                styles={style}
                isSearchable={false}
                value={values.ProfileType}
                onChange={(selectedOption) => {
                  let event = {
                    target: { name: "ProfileType", value: selectedOption },
                  };
                  handleChange(event);
                }}
              />
            </div>
            {/* <pre>{JSON.stringify(values, null, 2)}</pre> */}
          </div>
        </ManageMapperLayout>
      )}
    </Formik>
  );
};

export default LoadDefHomeContainer;
