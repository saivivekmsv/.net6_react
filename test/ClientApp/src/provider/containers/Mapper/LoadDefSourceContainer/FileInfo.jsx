import React, { useState, useRef, useContext, useEffect } from "react";
import { Formik, Field } from "formik";
import { manageMapperStore } from "../../../contexts";
import { get, isEmpty } from "lodash";
import {
  FieldButtonGroup,
  FieldDropSide,
  FieldInput,
  FieldInputPassword,
  FieldInputSSN,
  SearchableList,
  Select,
  UploadComponent,
} from "../../../components";
const FileFormatData = [
  {
    label: "Excel",
    value: 3,
  },
  {
    label: "CSV",
    value: 1,
  },
  {
    label: "Fixed Length",
    value: 2,
  },
];

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
const SelectDataFromData = [
  {
    label: "First Sheet",
    value: 1,
  },
  {
    label: "Last Sheet",
    value: 2,
  },
  {
    label: "Sheet Number",
    value: 3,
  },
  {
    label: "Sheet Name",
    value: 4,
  },
];
function FileInfo(props) {
  const {
    values,
    setFieldValue,
    fields,
    isEdit,
    fileUploadRequired,
    state,
    formName,
  } = props;

  const ExcelComponent = () => {
    return (
      <div>
        <Field
          name={fields.selectDataFrom}
          label={"Select Data From"}
          value={values[fields.selectDataFrom]}
          options={SelectDataFromData}
          isRequired
          direction={"bottom"}
          disabled={isEdit || !isEmpty(get(state, formName, []))}
          popupContent={
            <SearchableList
              label={"Select Data From"}
              isNotTypeAhead
              options={SelectDataFromData}
              onSelect={(value) => setFieldValue(fields.selectDataFrom, value)}
              selectedValue={values[fields.selectDataFrom]}
            />
          }
          component={FieldDropSide}
        />

        {values[fields.selectDataFrom] == SelectDataFromData[2].value && (
          <Field
            name={fields.spreadSheetNumber}
            placeholder={SelectDataFromData[2].label}
            label={SelectDataFromData[2].label}
            noLabelTransform
            component={FieldInput}
            type="number"
            disabled={isEdit || !isEmpty(get(state, formName, []))}
            value={values[fields.spreadSheetNumber]}
            isRequired
          />
        )}

        {values[fields.selectDataFrom] == SelectDataFromData[3].value && (
          <Field
            name={fields.spreadSheetName}
            placeholder={SelectDataFromData[3].label}
            label={SelectDataFromData[3].label}
            noLabelTransform
            component={FieldInput}
            disabled={isEdit || !isEmpty(get(state, formName, []))}
            value={values[fields.spreadSheetName]}
            isRequired
          />
        )}
      </div>
    );
  };

  const CSVComponent = () => {
    return (
      <div>
        <div
          style={{ color: "#828282", fontSize: "12px" }}
          className="form-group mb-3"
        >
          <Field
            name={fields.delimiter}
            placeholder={"Delimiter"}
            label={"Delimiter"}
            value={values[fields.delimiter]}
            noLabelTransform
            component={FieldInput}
            isRequired
            disabled={isEdit || !isEmpty(get(state, formName, []))}
          />
        </div>
      </div>
    );
  };

  const fixedLengthComponent = () => {
    return (
      <div
        style={{ color: "#828282", fontSize: "12px" }}
        className="form-group mb-3"
      >
        <Field
          name={fields.recordLength}
          label={"Record Length"}
          noLabelTransform
          component={FieldInput}
          type="number"
          disabled={isEdit || !isEmpty(get(state, formName, []))}
          value={values[fields.recordLength]}
          isRequired
        />
      </div>
    );
  };

  return (
    <div>
      <div style={{ fontSize: "18px", marginBottom: "20px" }}>
        File Information
      </div>

      <Field
        name={fields.fileFormat}
        label={"File format"}
        value={values[fields.fileFormat]}
        options={FileFormatData}
        isRequired
        direction={"bottom"}
        disabled={isEdit || !isEmpty(get(state, formName, []))}
        popupContent={
          <SearchableList
            label={"File Format"}
            isNotTypeAhead
            options={FileFormatData}
            onSelect={(value) => setFieldValue(fields.fileFormat, value)}
            selectedValue={values[fields.fileFormat]}
          />
        }
        component={FieldDropSide}
      />

      {(() => {
        if (values[fields.fileFormat] === 3) {
          return ExcelComponent();
        }
        if (values[fields.fileFormat] === 1) {
          return CSVComponent();
        }
        if (values[fields.fileFormat] === 2) {
          return fixedLengthComponent();
        }
      })()}

      {values[fields.fileFormat] == 3 && (
        <>
          {/* <div className="Load-def-source-selecttaglabel" >Has Header</div> */}
          <Field
            isRequired
            name={fields.hasHeader}
            label="Has Header"
            size="sm"
            options={yesNoOptions}
            disabled={isEdit || !isEmpty(get(state, formName, []))}
            onChange={(value) => {
              setFieldValue(fields.hasHeader, value);
            }}
            selectedValue={values[fields.hasHeader]}
            component={FieldButtonGroup}
          />

          {!values[fields.hasHeader] && (
            <Field
              isRequired
              name={fields.checkForHeaderCountMismatch}
              label="Check for Header Count Mismatch"
              size="sm"
              options={yesNoOptions}
              disabled={isEdit || !isEmpty(get(state, formName, []))}
              onChange={(value) => {
                setFieldValue(fields.checkForHeaderCountMismatch, value);
              }}
              selectedValue={values[fields.checkForHeaderCountMismatch]}
              component={FieldButtonGroup}
            />
          )}
          <br />
          <div className="form-group">
            <Field
              type="number"
              name={fields.contentStartsFrom}
              placeholder={"Content Starts From"}
              label={"Content Starts From (Row)"}
              noLabelTransform
              disabled={isEdit || !isEmpty(get(state, formName, []))}
              value={values[fields.contentStartsFrom]}
              component={FieldInput}
              isRequired
            />
          </div>
        </>
      )}
      {isEdit || !isEmpty(get(state, formName, [])) ? (
        <>
          <div>Uploaded File</div>
          <div>
            {!isEmpty(get(state, formName, []))
              ? get(state, formName, []).uploadSourceFile[0].name
              : values["fileName"]}
          </div>
        </>
      ) : (
        <div style={{ width: "40rem" }}>
          <div>
            <UploadComponent
              name={fields.uploadSourceFile}
              setFieldValue={setFieldValue}
              label="Upload Source File"
            />
          </div>
          <div
            style={{
              fontSize: "0.75rem",
              marginTop: "0rem",
              color: "#ff5050",
            }}
          >
            {fileUploadRequired}
          </div>
        </div>
      )}
    </div>
  );
}

export default FileInfo;
