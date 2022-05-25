import React, { useState, useEffect } from "react";
import { Formik, Field, FieldArray } from "formik";
import { Form, Button } from "react-bootstrap";
import { get, isEmpty, isNaN } from "lodash";
import {
  FieldButtonGroup,
  SliderPanel,
  SearchList,
  FieldDropSide,
  SearchableList,
  SearchDrop,
  FieldInput,
} from "../../../../components";
import { toOptionValuesFromMapper } from "../../../../utils";
import { CTTargetComponent } from "./CTTargetComponent";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/pro-light-svg-icons";
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-csharp";
import "ace-builds/src-noconflict/theme-terminal";
import "ace-builds/src-noconflict/ext-language_tools";
import functionData from "./FunctionList.js";
const initialValues = [];

const dataTypes = [
  {
    label: "string",
    value: 1,
  },
  {
    value: 2,
    label: "number",
  },
  {
    value: 3,
    label: "date",
  },
];

const fields = {
  pickDataFrom: "pickDataFrom",
  function: "function",
  code: "code",
};
const valueType = {
  1: "Value",
  2: "Header",
  3: "Constant",
};
export const ConfigureTransformations = (props) => {
  const {
    addFieldSlider,
    onCancel,
    itemConfigure,
    setFieldSlider,
    setFieldOperations,
    configuredValues,
  } = props;
  console.log(configuredValues, "configuresd");
  const [ShowEditorConsole, setShowEditorConsole] = useState(false);
  const [editorConsoleCode, setEditorConsoleCode] = useState("");

  const [updatevalue, setupdatevalue] = useState(0);
  function useForceUpdate() {
    return () => setupdatevalue((updatevalue) => updatevalue + 1);
  }
  const item = !isEmpty(itemConfigure) && itemConfigure.object;
  const itemMapped = !isEmpty(itemConfigure) && itemConfigure.objectMap;
  console.log(item, "items");
  console.log("itemMape", itemMapped);
  const functionsData = get(configuredValues, "fieldOperations", []);
  const pickDataFromInitialValue = get(configuredValues, "dataSource", 1);

  const functionTransformedData =
    !isEmpty(functionsData) &&
    functionsData.map((e, i) => {
      const trans = e.transformation
        .split("(")
        .join(",")
        .split(")")
        .join(",")
        .split(",");
      const transFunctions =
        trans.length === 3
          ? { id: e.id, objectMapId: e.objectMapId, function: trans[0] }
          : trans.length === 4
          ? {
              id: e.id,
              objectMapId: e.objectMapId,
              function: trans[0],
              code0: trans[2],
            }
          : trans.length === 5
          ? {
              id: e.id,
              objectMapId: e.objectMapId,
              function: trans[0],
              code0: trans[2],
              code1: trans[3],
            }
          : null;

      return transFunctions;
    });
  console.log(functionTransformedData, "fields");
  //console.log(functionsData[0].pickDataFrom,"asklflka");
  const [functions, setfunctions] = useState(functionData);
  // const [selectedfunction, setselectedfunction] = useState(null)

  // const [funData, setfunData] = useState(
  //   isEmpty(functionsData)
  //     ? [
  //         {
  //           functionName: "",
  //           codeName: "",
  //           resultName: "",
  //           selectedValue: null,
  //           codebox: [],
  //         },
  //       ]
  //     : functionsData[1]
  // );

  const switchView = (functionName = "", input_value = "", arg1, arg2) => {
    let returnObject = {
      result: null,
    };
    if (input_value == null) {
      return returnObject;
    }
    console.log(functionName);
    console.log(input_value);
    console.log(arg1);
    console.log(arg2);
    console.log(returnObject, "returnOnje");
    switch (functionName.toLowerCase()) {
      case "abs":
        returnObject = {
          code: "abs",
          result: Math.abs(parseInt(input_value)),
        };
        break;

      case "divide":
        returnObject = {
          code: "divide",
          result: parseFloat(input_value) / parseFloat(arg1),
        };
        break;

      case "ceil":
        returnObject = {
          code: "ceil",
          result: Math.ceil(parseFloat(input_value)),
        };
        break;

      case "strip":
        returnObject = {
          code: "strip",
          result: input_value.replaceAll(arg1, ""),
        };
        break;

      case "floor":
        returnObject = {
          code: "floor",
          result: Math.floor(parseFloat(input_value)),
        };
        break;

      case "max":
        returnObject = {
          code: "max",
          result: Math.max(parseFloat(input_value), parseFloat(arg1)),
        };
        break;

      case "min":
        returnObject = {
          code: "min",
          result: Math.min(parseFloat(input_value), parseFloat(arg1)),
        };
        break;

      case "modulo":
        returnObject = {
          code: "modulo",
          result: parseFloat(input_value) % parseFloat(arg1),
        };
        break;

      case "sum":
        returnObject = {
          code: "sum",
          result: parseFloat(input_value) + parseFloat(arg1),
        };
        break;

      case "tonumber":
        returnObject = {
          code: "tonumber",
          result: parseInt(input_value),
        };
        break;

      case "indexof":
        returnObject = {
          code: "indexof",
          result: input_value.indexOf(arg1),
        };
        break;

      case "numbertostring":
        returnObject = {
          code: "NumberToString",
          result: input_value,
        };
        break;

      case "convertemptystringtonull":
        returnObject = {
          code: "ConvertEmptyStringToNull",
          result: input_value == "" ? null : input_value,
        };
        break;

      case "length":
        returnObject = {
          code: "Length",
          result: input_value.length,
        };
        break;

      case "split":
        returnObject = {
          code: "Split",
          result: input_value.split(arg1)[parseInt(arg2)],
        };
        break;

      case "substring":
        returnObject = {
          code: "Substring",
          result: input_value.substring(
            parseInt(arg1),
            parseInt(arg1) + parseInt(arg2)
          ),
        };
        break;

      case "tolowercase":
        returnObject = {
          code: "ToLowercase",
          result: input_value.toLowerCase(),
        };
        break;

      case "touppercase":
        returnObject = {
          code: "ToUppercase",
          result: input_value.toUpperCase(),
        };
        break;

      case "trim":
        returnObject = {
          code: "Trim",
          result: input_value.trim(),
        };
        break;

      case "trimleading":
        returnObject = {
          code: "TrimLeading",
          result: input_value.trimStart(),
        };
        break;

      case "trimtrailing":
        returnObject = {
          code: "TrimTrailing",
          result: input_value.trimEnd(),
        };
        break;

      case "concat":
        returnObject = {
          code: "Concat",
          result: input_value + arg1,
        };
        break;

      case "defaultoption":
        var temp_ = null;
        if (input_value == null || input_value == "") {
          temp_ = arg1;
        } else {
          temp_ = input_value;
        }

        returnObject = {
          code: "DefaultOption",
          result: temp_,
        };
        break;

      case "replace":
        returnObject = {
          code: "Replace",
          result: input_value.replace(arg1, arg2),
        };
        break;

      case "replacelookup":
        let temp = input_value;
        let temp_arg1 = arg1;
        temp_arg1 = temp_arg1.replace("[", "");
        temp_arg1 = temp_arg1.replace("]", "");
        temp_arg1 = temp_arg1.split(",");
        let temp_arg2 = arg2;
        temp_arg2 = temp_arg2.replace("[", "");
        temp_arg2 = temp_arg2.replace("]", "");
        temp_arg2 = temp_arg2.split(",");
        for (let i = 0; i < Math.min(temp_arg1.length, temp_arg2.length); i++) {
          temp = temp.replaceAll(temp_arg1[i].trim(), temp_arg2[i].trim());
        }
        returnObject = {
          code: "ReplaceLookup",
          result: temp,
        };
        break;

      case "todate":
        let todate_ = "";
        if (arg1.toLowerCase() == "ddmmyyyy") {
          todate_ = `${input_value.substring(2, 4)}${input_value.substring(
            0,
            2
          )}${input_value.substring(4)}`;
        } else if (arg1.toLowerCase() == "yyyyddmm") {
          todate_ = `${input_value.substring(4)}${input_value.substring(
            2,
            4
          )}${input_value.substring(0, 2)}`;
        } else if (arg1.toLowerCase() == "yyyymmdd") {
          todate_ = `${input_value.substring(4)}${input_value.substring(
            0,
            2
          )}${input_value.substring(2, 4)}`;
        } else {
          todate_ = input_value;
        }
        returnObject = {
          code: "ToDate",
          result: todate_,
        };
        break;

      case "startofmonth":
        let temp1 = input_value;
        temp1 = temp1.split("");
        temp1[2] = "0";
        temp1[3] = "1";
        temp1 = temp1.join("");
        returnObject = {
          code: "StartOfMonth",
          result: temp1,
        };
        break;

      case "endofmonth":
        let year_ = parseInt(input_value.substring(4));
        const endofmonthJson = {
          "01": 31,
          "02":
            (0 == year_ % 4 && 0 != year_ % 100) || 0 == year_ % 400 ? 29 : 28,
          "03": 31,
          "04": 30,
          "05": 31,
          "06": 30,
          "07": 31,
          "08": 31,
          "09": 30,
          10: 31,
          11: 30,
          12: 31,
        };
        let month_ = input_value.substring(0, 2);
        returnObject = {
          code: "EndOfTheMonth",
          result: endofmonthJson[month_],
        };
        break;

      case "today":
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, "0");
        var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
        var yyyy = today.getFullYear();
        today = mm + dd + yyyy;
        returnObject = {
          code: "Today",
          result: today,
        };
        break;

      case "elapsedyear":
        var temp2 =
          parseInt(arg1.substring(4)) - parseInt(input_value.substring(4));
        returnObject = {
          code: "ElapsedYear",
          result: temp2,
        };
        break;

      case "elapsedmonth":
        var temp3 =
          (parseInt(arg1.substring(4)) - parseInt(input_value.substring(4))) *
          12;
        temp3 =
          temp3 +
          (parseInt(arg1.substring(0, 2)) -
            parseInt(input_value.substring(0, 2)));
        returnObject = {
          code: "ElapsedMonth",
          result: temp3,
        };
        break;

      case "elapsedday":
        function getNumberOfDays(start, end) {
          const date1 = new Date(start);
          const date2 = new Date(end);
          const oneDay = 1000 * 60 * 60 * 24;
          const diffInTime = date2.getTime() - date1.getTime();
          const diffInDays = Math.round(diffInTime / oneDay);
          return diffInDays;
        }
        let elapsed_day = getNumberOfDays(
          `${arg1.substring(4)}-${arg1.substring(0, 2)}-${arg1.substring(
            2,
            4
          )}`,
          `${input_value.substring(4)}-${input_value.substring(
            0,
            2
          )}-${input_value.substring(2, 4)}`
        );

        returnObject = {
          code: "ElapsedDay",
          result: elapsed_day,
        };
        break;

      case "age":
        var today = new Date();
        var yyyy = today.getFullYear();
        returnObject = {
          code: "Age",
          result: parseInt(yyyy) - parseInt(input_value.substring(4)),
        };
        break;

      case "ageason":
        returnObject = {
          code: "AgeAsOn",
          result:
            parseInt(arg1.substring(4)) - parseInt(input_value.substring(4)),
        };
        break;

      default:
        returnObject = {
          result: "no result",
        };
        break;
    }
    return returnObject;
  };

  const getResult = (i, fuData, itemMapped, values, setFieldValue) => {
    const getResultFromSwitchCase = () => {
      let tempResult = null;
      if (!isEmpty(fuData) && !isEmpty(get(values, `fieldOperations[${i}]`))) {
        if (i !== 0) {
          tempResult = switchView(
            fuData.label,
            values.resultArray[i - 1].result,
            get(values.fieldOperations[i], "code0", ""),
            get(values.fieldOperations[i], "code1", "")
          ).result;
        } else {
          tempResult = switchView(
            fuData.label,
            itemMapped.value,
            get(values.fieldOperations[i], "code0", ""),
            get(values.fieldOperations[i], "code1", "")
          ).result;
        }
        // setFieldValue(`resultArray[${i}].result`, tempResult);
      } else {
        tempResult = null;
      }
      return tempResult;
    };

    let resultValue = getResultFromSwitchCase();
    if (resultValue != values.resultArray[i].result) {
      setFieldValue(`resultArray[${i}].result`, resultValue);
    }
    return resultValue;
    // console.log("tempResult", tempResult, "i", i, "values", values)
    // return tempResult;
  };

  const setSave = (values) => {
    const operations =
      !isEmpty(get(values, "fieldOperations", {})) &&
      get(values, "fieldOperations").map((e, i) => {
        const transform =
          Object.keys(e).length === 1
            ? `${e.function}(source)`
            : Object.keys(e).length === 2
            ? `${e.function}(source,${e.code0})`
            : Object.keys(e).length === 3
            ? `${e.function}(source,${e.code0},${e.code1})`
            : null;
        return {
          id: get(e, "id", 0),
          objectMapId: get(e, "objectMapId", 0),
          transformation: !isEmpty(transform) ? transform : null,
        };
      });
    console.log(operations, "operations");
    setFieldOperations(
      get(values, "pickDataFrom", 1),
      operations,
      itemConfigure
    );
  };

  const EditorConsole = () => {
    return (
      <>
        <div className="form-group">
          <label for="codeTextArea" style={{ fontSize: "14px", color: "gray" }}>
            Code{" "}
            <span>
              <i className="far fa-question-circle"></i>
            </span>{" "}
          </label>

          <AceEditor
            style={{ width: "100%", height: "11.25rem" }}
            id="codeTextArea"
            mode="csharp"
            theme="terminal"
            onChange={(val) => {
              setEditorConsoleCode(val);
            }}
            name="UNIQUE_ID_OF_DIV"
            editorProps={{ $blockScrolling: true }}
            showPrintMargin={true}
            showGutter={true}
            highlightActiveLine={true}
            value={editorConsoleCode}
            setOptions={{
              enableBasicAutocompletion: true,
              enableLiveAutocompletion: true,
              enableSnippets: true,
              showLineNumbers: true,
              tabSize: 2,
            }}
          />
        </div>

        <div className="form-group">
          <label
            for="ResultTextArea"
            style={{ fontSize: "14px", color: "gray" }}
          >
            Result{" "}
          </label>
          <textarea
            className="form-control"
            id="ResultTextArea"
            rows="3"
            style={{ fontSize: "14px" }}
          ></textarea>
        </div>
      </>
    );
  };

  return (
    <Formik
      initialValues={{
        ...initialValues,
        fieldOperations: !isEmpty(functionTransformedData)
          ? functionTransformedData
          : [
              {
                function: "",
              },
            ],
        [fields.pickDataFrom]: pickDataFromInitialValue,
        // get(item, "dataSource", 1),
        constantValue: null,
        targetFieldRename: item.field,
        targetFieldName: item.field,
        resultArray: !isEmpty(functionTransformedData)
          ? functionTransformedData.map(() => {
              return { result: null };
            })
          : [
              {
                result: null,
              },
            ],
      }}
      enableReinitialize
      validateOnChange={false}
      validateOnBlur={false}
    >
      {(formProps) => {
        const {
          handleChange,
          setFieldValue,
          handleSubmit,
          setValues,
          setTouched,
          values,
          setSubmitting,
          touched,
          ...rest
        } = formProps;

        console.log("values123", values);

        return (
          <SliderPanel
            isOpen={addFieldSlider}
            size="50"
            onClose={onCancel}
            showCancel={false}
          >
            <div className="inside-content">
              <div className="d-flex justify-content-between align-baseline">
                <div>
                  <p className="investment-heading">
                    Configure Transformations
                  </p>
                </div>
                <div>
                  <Button variant="secondary" onClick={onCancel}>
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    className="ml-4"
                    onClick={() => {
                      setSave(values);
                      onCancel();
                    }}
                  >
                    Save
                  </Button>
                </div>
              </div>
              <div className="break-bar"></div>
              <Form
                autoComplete="off"
                className="h-100"
                onSubmit={handleSubmit}
                validated={!isEmpty(rest.errors)}
              >
                <div className="mt-3">
                  <div className="mb-2" style={{ display: "flex" }}>
                    <p
                      className="m-0 mr-2"
                      style={{ fontSize: "12px", fontWeight: "500" }}
                    >
                      {values.targetFieldName}
                    </p>
                    {get(item, "isRequired", false) ? (
                      <div
                        style={{
                          fontSize: "10px",
                          fontWeight: "400",
                          display: "flex",
                          alignSelf: "flex-end",
                        }}
                      >
                        (Required)
                      </div>
                    ) : (
                      <></>
                    )}
                  </div>
                  <CTTargetComponent item={itemConfigure} />
                  <div className="d-flex mt-4">
                    <Field
                      style={{ width: "14.5rem" }}
                      name={`targetFieldRename`}
                      type="text"
                      isRequired
                      label="Target Field Name"
                      size="sm"
                      value={values.targetFieldRename}
                      component={FieldInput}
                    />
                    <div
                      onClick={() => {
                        setFieldValue(
                          "targetFieldName",
                          values.targetFieldRename
                        );
                      }}
                      style={{
                        color: "#307BF6",
                        fontSize: "14px",
                        marginLeft: "10px",
                        marginTop: "10px",
                        alignSelf: "center",
                        cursor: "pointer",
                      }}
                    >
                      Rename
                    </div>
                  </div>
                  <div className="mt-3">
                    <Field
                      isRequired
                      name={fields.pickDataFrom}
                      label="Pick Data From"
                      options={toOptionValuesFromMapper(valueType)}
                      selectedValue={values[fields.pickDataFrom]}
                      autoComplete="off"
                      onChange={(value) => {
                        setFieldValue(fields.pickDataFrom, value);
                      }}
                      component={FieldButtonGroup}
                    />
                  </div>
                  {values[fields.pickDataFrom] == 3 ? (
                    <>
                      <div className="function-heading mb-4 mt-5">Constant</div>
                      <div className="d-flex">
                        <Field
                          style={{ width: "14.5rem" }}
                          // name={`constantValue`}
                          type="text"
                          isRequired
                          label="Value"
                          size="sm"
                          value={values.constantValue}
                          component={FieldInput}
                        />
                        <FontAwesomeIcon
                          style={{ marginTop: "40px", marginLeft: "10px" }}
                          icon={faTrash}
                          size="20px"
                          color="#EB5757"
                          onClick={() => {
                            setFieldValue("constantValue", "");
                          }}
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="d-flex mt-5">
                        <div className="function-heading">Function</div>
                        <p className="ft-14 black-text ml-5 mr-3">
                          <Form.Check
                            type="switch"
                            id={`custom-switch-1`}
                            label=" "
                            checked={ShowEditorConsole}
                            onChange={() => {
                              setShowEditorConsole(!ShowEditorConsole);
                            }}
                          />
                        </p>
                        <div className="Editor-heading">Editor Console</div>
                      </div>

                      <div>
                        {(() => {
                          if (ShowEditorConsole) {
                            return EditorConsole();
                          } else {
                            return (
                              <FieldArray name="fieldOperations">
                                {(arrayhelpers) => (
                                  <>
                                    {values["fieldOperations"].map((e, i) => {
                                      const fieldOperationValues = get(
                                        values,
                                        `fieldOperations[${i}]`,
                                        ""
                                      );
                                      console.log(
                                        get(values, `fieldOperations[${i}]`),
                                        "fjsaojowej"
                                      );
                                      const fuData = functionData.find(
                                        (f) => f.label === e.function
                                      );
                                      // const result =
                                      //   !isEmpty(fuData) &&
                                      //   !isEmpty(
                                      //     get(values, `fieldOperations[${i}]`)
                                      //   )
                                      //     ? i !== 0
                                      //       ? switchView(
                                      //           fuData.label,
                                      //           get(
                                      //             values,
                                      //             `fieldOperations[${
                                      //               i - 1
                                      //             }].result`,
                                      //             ""
                                      //           ),
                                      //           get(
                                      //             values[
                                      //               `fieldOperations[${i}]`
                                      //             ],
                                      //             "code0",
                                      //             ""
                                      //           ),
                                      //           get(
                                      //             values[
                                      //               `fieldOperations[${i}]`
                                      //             ],
                                      //             "code1",
                                      //             ""
                                      //           )
                                      //         ).result
                                      //       : switchView(
                                      //           fuData.label,
                                      //           itemMapped.value,
                                      //           get(
                                      //             values,
                                      //             `fieldOperations[${i}].code0`,
                                      //             ""
                                      //           ),
                                      //           get(
                                      //             values,
                                      //             `fieldOperations[${i}]code1`,
                                      //             ""
                                      //           )
                                      //         ).result
                                      //     : "";

                                      console.log(fieldOperationValues.code0);
                                      const codeFields = !isEmpty(fuData)
                                        ? !isEmpty(fuData.codebox)
                                          ? fuData.codebox.map((g, index) => (
                                              <div className="function-text-fields">
                                                <Field
                                                  name={`fieldOperations[${i}].code${index}`}
                                                  id={`resultDisplay${i}code${index}`}
                                                  type="text"
                                                  isRequired
                                                  label="Code"
                                                  size="sm"
                                                  onChange={(e) => {
                                                    handleChange(e);
                                                    let temp_result = getResult(
                                                      i,
                                                      fuData,
                                                      itemMapped,
                                                      values,
                                                      setFieldValue
                                                    );
                                                    setFieldValue(
                                                      `resultArray[${i}]`,
                                                      { result: temp_result }
                                                    );
                                                    console.log(
                                                      "value123",
                                                      "resultArray",
                                                      temp_result,
                                                      "value",
                                                      get(
                                                        values.fieldOperations[
                                                          i
                                                        ],
                                                        "code0",
                                                        ""
                                                      ),
                                                      "e.target.value",
                                                      e.target.value
                                                    );
                                                  }}
                                                  value={
                                                    !isEmpty(
                                                      get(
                                                        fieldOperationValues,
                                                        `code${index}`
                                                      )
                                                    )
                                                      ? get(
                                                          fieldOperationValues,
                                                          `code${index}`
                                                        )
                                                      : null
                                                  }
                                                  component={FieldInput}
                                                />
                                              </div>
                                            ))
                                          : null
                                        : null;

                                      return (
                                        <>
                                          <div className="field-operation-functions">
                                            <div className="function-text-fields">
                                              <Field
                                                name={`fieldOperations[${i}].function`}
                                                label="Function Name"
                                                options={functionData}
                                                placeholder="Enter Function"
                                                onSelect={(label, value) =>
                                                  setFieldValue(
                                                    `fieldOperations[${i}].function`,
                                                    label
                                                  )
                                                }
                                                isRequired
                                                component={SearchDrop}
                                              />
                                            </div>
                                            {!isEmpty(fuData) && codeFields}
                                            <div className="delete-function-icon">
                                              <FontAwesomeIcon
                                                icon={faTrash}
                                                size="20px"
                                                color="#EB5757"
                                                onClick={() => {
                                                  const tempFieldOperations = [
                                                    ...values.fieldOperations,
                                                  ];
                                                  const tempResultArray = [
                                                    ...values.resultArray,
                                                  ];
                                                  tempResultArray.splice(i, 1);
                                                  tempFieldOperations.splice(
                                                    i,
                                                    1
                                                  );
                                                  setFieldValue(
                                                    `fieldOperations`,
                                                    tempFieldOperations
                                                  );
                                                  setFieldValue(
                                                    "resultArray",
                                                    tempResultArray
                                                  );
                                                }}
                                              />
                                            </div>
                                            <div className="function-result-field">
                                              <Field
                                                name={`fieldOperations[${i}].result`}
                                                type="text"
                                                isRequired
                                                label="Result"
                                                size="sm"
                                                disabled
                                                value={getResult(
                                                  i,
                                                  fuData,
                                                  itemMapped,
                                                  values,
                                                  setFieldValue
                                                )}
                                                component={FieldInput}
                                              />
                                            </div>
                                          </div>
                                        </>
                                      );
                                    })}
                                    <div
                                      className="add-custom-field-text"
                                      style={{ cursor: "pointer" }}
                                      onClick={() => {
                                        const tempResultArray = [
                                          ...values.resultArray,
                                        ];
                                        tempResultArray.push({ result: null });
                                        setFieldValue(
                                          "resultArray",
                                          tempResultArray
                                        );
                                        arrayhelpers.push({ function: "" });
                                      }}
                                    >
                                      Add More Functions
                                    </div>
                                  </>
                                )}
                              </FieldArray>
                            );
                          }
                        })()}
                      </div>
                    </>
                  )}
                </div>
              </Form>
            </div>
          </SliderPanel>
        );
      }}
    </Formik>
  );
};
