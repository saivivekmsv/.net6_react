import React, { useState, useEffect } from "react";
import { Formik, Field, FieldArray } from "formik";
import { Form, Button } from "react-bootstrap";
import { get, isEmpty, isNaN } from "lodash";
import moment from "moment";
import {
  FieldButtonGroup,
  SliderPanel,
  SearchList,
  FieldDropSide,
  SearchableList,
  SearchDrop,
  FieldInput,
} from "../../../components";
import { toOptionValuesFromMapper } from "../../../utils";
import { SourceFieldComponent } from "./SourceFieldComponent";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/pro-light-svg-icons";
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-csharp";
import "ace-builds/src-noconflict/theme-terminal";
import "ace-builds/src-noconflict/ext-language_tools";
import functionList from "./FunctionList.js";
import { Result } from "./Result";
const initialValues = [];

function isNumber(searchValue) {
  var found = searchValue.search(/^(\d*\.?\d*)$/);
  if (found > -1) {
    return true;
  } else {
    return false;
  }
}
const functionData = functionList.map((fun, ind) => {
  const codeBlock =
    fun.numberOfParameters == 0
      ? []
      : fun.numberOfParameters == 1
      ? [0]
      : [0, 1];
  return { ...fun, label: fun.displayedName, value: ind, codebox: codeBlock };
});

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
  6: "Variable",
};
export const ConfigureTransformations = (props) => {
  const {
    addFieldSlider,
    onCancel,
    itemConfigure,
    setFieldSlider,
    configuredValues,
    setTargetField,
    initialData,
  } = props;

  const [ShowEditorConsole, setShowEditorConsole] = useState(false);
  const [editorConsoleCode, setEditorConsoleCode] = useState("");

  const [updatevalue, setupdatevalue] = useState(0);
  function useForceUpdate() {
    return () => setupdatevalue((updatevalue) => updatevalue + 1);
  }
  const item = !isEmpty(itemConfigure) && itemConfigure.object;
  const itemMapped = !isEmpty(itemConfigure) && itemConfigure.objectMap;
  const itemId = !isEmpty(itemConfigure) && itemConfigure.tId;
  const functionsData = get(item, "fieldOperations", []);
  const pickDataFromInitialValue = get(configuredValues, "dataSource", 1);
  const functionTransformedData =
    !isEmpty(functionsData) &&
    !isEmpty(functionsData[0].transformation) &&
    functionsData.map((e, i) => {
      const trans = e.transformation
        ? e.transformation.split("(").join(",").split(")").join(",").split(",")
        : "";
      let indexOfTheFunction = functionList
        .map((f) => f.displayedName)
        .indexOf(trans[0]);
      let transFunctions = null;

      if (
        !isNaN(indexOfTheFunction) &&
        indexOfTheFunction >= 0 &&
        indexOfTheFunction < functionList.length
      ) {
        transFunctions =
          functionList[indexOfTheFunction].numberOfParameters == 0
            ? {
                id: e.id,
                objectMapId: e.objectMapId,
                function: trans[0],
                returnDataType: functionList[indexOfTheFunction].returnDataType,
              }
            : functionList[indexOfTheFunction].numberOfParameters == 1
            ? {
                id: e.id,
                objectMapId: e.objectMapId,
                function: trans[0],
                code0: trans[2],
                returnDataType: functionList[indexOfTheFunction].returnDataType,
              }
            : functionList[indexOfTheFunction].numberOfParameters == 2
            ? {
                id: e.id,
                objectMapId: e.objectMapId,
                function: trans[0],
                code0: trans[2],
                code1: trans[3],
                returnDataType:
                  functionList[
                    functionList.map((f) => f.displayedName).indexOf(trans[0])
                  ].returnDataType,
              }
            : null;
      }

      return transFunctions;
    });

  const switchView = (
    functionName = "",
    input_value = "",
    arg1 = "",
    arg2,
    itemMapped
  ) => {
    let returnObject = {
      result: null,
    };
    if (input_value == null) {
      return returnObject;
    }
    switch (functionName.toLowerCase()) {
      case "abs":
        returnObject = {
          code: "abs",
          result: !isNaN(input_value) ? parseInt(input_value) : "",
        };
        break;

      case "divide":
        returnObject = {
          code: "divide",
          result:
            !isNaN(parseFloat(input_value)) && !isNaN(parseFloat(arg1))
              ? parseFloat(input_value) / parseFloat(arg1)
              : "",
        };
        break;

      case "ceil":
        returnObject = {
          code: "ceil",
          result: !isNaN(parseFloat(input_value))
            ? Math.ceil(parseFloat(input_value))
            : "",
        };
        break;

      case "strip":
        returnObject = {
          code: "strip",
          result: input_value.split(arg1.slice(1, -1)).join(""),
        };
        break;

      case "floor":
        returnObject = {
          code: "floor",
          result: !isNaN(parseFloat(input_value))
            ? Math.floor(parseFloat(input_value))
            : "",
        };
        break;

      case "max":
        returnObject = {
          code: "max",
          result:
            !isNaN(parseFloat(input_value)) && !isNaN(parseFloat(arg1))
              ? Math.max(parseFloat(input_value), parseFloat(arg1))
              : "",
        };
        break;

      case "min":
        returnObject = {
          code: "min",
          result:
            !isNaN(parseFloat(input_value)) && !isNaN(parseFloat(arg1))
              ? Math.min(parseFloat(input_value), parseFloat(arg1))
              : "",
        };
        break;

      case "modulo":
        returnObject = {
          code: "modulo",
          result:
            !isNaN(parseFloat(input_value)) && !isNaN(parseFloat(arg1))
              ? parseFloat(input_value) % parseFloat(arg1)
              : "",
        };
        break;

      case "sum":
        returnObject = {
          code: "sum",
          result:
            !isNaN(parseFloat(input_value)) && !isNaN(parseFloat(arg1))
              ? parseFloat(input_value) + parseFloat(arg1)
              : "",
        };
        break;

      case "tonumber":
        returnObject = {
          code: "tonumber",
          result: !isNumber(input_value) ? "" : parseInt(input_value),
        };
        break;

      case "indexof":
        returnObject = {
          code: "indexof",
          result: input_value.indexOf(arg1.slice(1, -1)),
        };
        break;

      case "numbertostring":
        returnObject = {
          code: "NumberToString",
          result: !isNaN(input_value) ? input_value.toString() : "",
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
          result: typeof input_value == "string" ? input_value.length : "",
        };
        break;

      case "split":
        let temp_2 = "";
        if (typeof input_value == "string" && isNumber(arg2)) {
          let temp_1 = input_value.split(arg1.slice(1, -1));
          temp_2 =
            parseInt(arg2) < temp_1.length && parseInt(arg2) >= 0
              ? temp_1[parseInt(arg2)]
              : "";
        }
        returnObject = {
          code: "Split",
          result: temp_2,
        };
        break;

      case "substring":
        returnObject = {
          code: "Substring",
          result:
            typeof input_value == "string" && isNumber(arg1) && isNumber(arg2)
              ? input_value.substring(
                  parseInt(arg1),
                  parseInt(arg1) + parseInt(arg2)
                )
              : "",
        };
        break;

      case "tolowercase":
        returnObject = {
          code: "ToLowercase",
          result:
            typeof input_value == "string" ? input_value.toLowerCase() : "",
        };
        break;

      case "touppercase":
        returnObject = {
          code: "ToUppercase",
          result:
            typeof input_value == "string" ? input_value.toUpperCase() : "",
        };
        break;

      case "trim":
        returnObject = {
          code: "Trim",
          result: typeof input_value == "string" ? input_value.trim() : "",
        };
        break;

      case "trimleading":
        returnObject = {
          code: "TrimLeading",
          result: typeof input_value == "string" ? input_value.trimStart() : "",
        };
        break;

      case "trimtrailing":
        returnObject = {
          code: "TrimTrailing",
          result: typeof input_value == "string" ? input_value.trimEnd() : "",
        };
        break;

      case "concat":
        returnObject = {
          code: "Concat",
          result:
            typeof input_value == "string" && typeof arg1 == "string"
              ? input_value + arg1.slice(1, -1)
              : "",
        };
        break;

      case "defaultoption":
        var temp_ = null;
        if (input_value == null || input_value == "") {
          temp_ = arg1.slice(1, -1);
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
          result:
            typeof input_value == "string" &&
            typeof arg1 == "string" &&
            typeof arg2 == "string" &&
            input_value == arg1.slice(1, -1)
              ? arg2.slice(1, -1)
              : input_value,
        };
        break;

      case "replacelookup":
        let temp = input_value;
        if (
          typeof input_value == "string" &&
          typeof arg1 == "string" &&
          typeof arg2 == "string"
        ) {
          let temp_arg1 = arg1;
          temp_arg1 = temp_arg1.replace("[", "");
          temp_arg1 = temp_arg1.replace("]", "");
          temp_arg1 = temp_arg1.split(",");
          temp_arg1 = temp_arg1.map((e) => e.slice(1, -1));
          let temp_arg2 = arg2;
          temp_arg2 = temp_arg2.replace("[", "");
          temp_arg2 = temp_arg2.replace("]", "");
          temp_arg2 = temp_arg2.split(",");
          temp_arg2 = temp_arg2.map((e) => e.slice(1, -1));

          if (temp_arg1.includes(input_value)) {
            temp = temp_arg2[temp_arg1.indexOf(input_value)];
          }
        }
        returnObject = {
          code: "ReplaceLookup",
          result: temp,
        };
        break;

      case "todate":
        let todate_ = "";
        todate_ = [
          "MM/dd/yyyy",
          "M/d/yyyy",
          "M/d/yyyy hh:mm:ss tt",
          "MM-dd-yyyy",
          "M-d-yyyy",
        ].includes(arg1.slice(1, -1))
          ? moment(input_value).format(arg1.slice(1, -1).toUpperCase())
          : "";
        returnObject = {
          code: "ToDate",
          result: todate_,
        };
        break;

      case "startofmonth":
        // let temp1 = input_value;
        // temp1 = temp1.split("");
        // temp1[2] = "0";
        // temp1[3] = "1";
        // temp1 = temp1.join("");
        returnObject = {
          code: "StartOfMonth",
          result: moment().startOf("month").format("MMDDYYYY"),
        };
        break;

      case "endofthemonth":
        returnObject = {
          code: "EndOfTheMonth",
          result: moment().endOf("month").format("MMDDYYYY"),
        };
        break;

      case "today":
        returnObject = {
          code: "Today",
          result: moment().format("MMDDYYYY"),
        };
        break;

      case "elapsedyear":
        let elapsedYear = "";
        let admission = moment(input_value);
        let discharge = moment(arg1, "MM/DD/YYYY");
        let diff = admission.diff(discharge, "years");
        if (admission.isValid && discharge.isValid && diff) {
          elapsedYear = diff;
        }
        returnObject = {
          code: "ElapsedYear",
          result: elapsedYear,
        };
        break;

      case "elapsedmonth":
        let elapsedMonth = "";
        let admission_ = moment(input_value);
        let discharge_ = moment(arg1, "MM/DD/YYYY");
        let diff_ = admission_.diff(discharge_, "months");
        if (admission_.isValid && discharge_.isValid && diff_) {
          elapsedMonth = diff_;
        }
        returnObject = {
          code: "ElapsedMonth",
          result: elapsedMonth,
        };
        break;

      case "elapsedday":
        let elapsedDays = "";
        let admission1 = moment(input_value);
        let discharge1 = moment(arg1, "MM/DD/YYYY");
        let diff1 = admission1.diff(discharge1, "days");
        if (admission1.isValid && discharge1.isValid && diff1) {
          elapsedDays = diff1;
        }
        returnObject = {
          code: "ElapsedDay",
          result: elapsedDays,
        };
        break;

      case "age":
        let ageValue = "";
        let admission2 = moment(input_value);
        let discharge2 = moment();
        let diff2 = discharge2.diff(admission2, "years");
        if (admission2.isValid && discharge2.isValid && diff2) {
          ageValue = diff2;
        }
        returnObject = {
          code: "Age",
          result: ageValue,
        };
        break;

      case "ageason":
        try {
          let ageAsOn = "";
          let admission3 = moment(input_value);
          let discharge3 = moment(arg1, "MM/DD/YYYY");
          let diff3 = discharge3.diff(admission3, "years");
          if (admission3.isValid && discharge3.isValid && diff3) {
            ageAsOn = diff3;
          }
          returnObject = {
            code: "AgeAsOn",
            result: ageAsOn,
          };
        } catch {
          returnObject = {
            code: "AgeAsOn",
            result: "Error happend",
          };
        }
        break;

      default:
        returnObject = {
          result: "",
        };
        break;
    }
    return returnObject;
  };

  const getType = (val) => {
    if (!val) return val;
    if (typeof val === "number") return 2;
    else if (!isNaN(Date.parse(val))) return 4;
    else if (typeof val === "string") return 1;
    else return 3;
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
            get(values.fieldOperations[i], "code1", ""),
            itemMapped
          ).result;
        } else if (values[fields.pickDataFrom] === 1) {
          tempResult = switchView(
            fuData.label,
            itemMapped.datum,
            get(values.fieldOperations[i], "code0", ""),
            get(values.fieldOperations[i], "code1", ""),
            itemMapped
          ).result;
        } else if (values[fields.pickDataFrom] === 2) {
          tempResult = switchView(
            fuData.label,
            itemMapped.fieldName.replace("/", ""),
            get(values.fieldOperations[i], "code0", ""),
            get(values.fieldOperations[i], "code1", ""),
            itemMapped
          ).result;
        } else if (
          values[fields.pickDataFrom] === 3 ||
          values[fields.pickDataFrom] === 6
        ) {
          tempResult = switchView(
            fuData.label,
            get(values, "constantValue", ""),
            get(values.fieldOperations[i], "code0", ""),
            get(values.fieldOperations[i], "code1", ""),
            itemMapped
          ).result;
        }
        if (values[`resultArray`][i]?.result != tempResult) {
          let temp_ = [...values.resultArray];
          temp_[i] = { result: tempResult };
          setFieldValue(`resultArray`, temp_);
        }
      }
      // else {
      //   tempResult = null;
      // }
      return tempResult;
    };

    let resultValue = getResultFromSwitchCase();
    if (resultValue == null && resultValue != values?.resultArray[i]?.result) {
      try {
        setFieldValue(`resultArray[${i}].result`, resultValue);
        setFieldValue(
          `resultArray[${i}].returnDataType`,
          fuData.returnDataType
        );
      } catch {
        // console.log("temp1", "cannot update setFieldValue");
      }
    }
    return resultValue;
    // return tempResult;
  };

  const getFinalResultType = (values) => {
    const pickDataFrom = get(values, "pickDataFrom", 1);
    var results = get(values, "resultArray", null);
    if (
      results &&
      results.length == 1 &&
      results[results.length - 1]?.result == null
    )
      switch (pickDataFrom) {
        case 1:
          results = [{ result: itemMapped?.datum }];
          break;
        case 2:
          results = [{ result: itemMapped?.fieldName?.replace("/", "") }];
          break;
        case 3:
          results = [{ result: get(values, "constantValue", "") }];
          break;
        case 6:
          results = [{ result: get(values, "constantValue", "") }];
          break;
        default:
          results = get(values, "resultArray", []);
          break;
      }
    const finalResult = results.length
      ? results[results.length - 1]?.result
      : null;
    return getType(finalResult);
  };

  const setSave = (values) => {
    const filteredOp = get(values, "fieldOperations", {}).filter((e) => {
      if (!isEmpty(e?.function)) {
        return e;
      }
    });
    const operations =
      filteredOp &&
      filteredOp.map((e, i) => {
        // if (!isEmpty(e?.function)) {
        let indexOfTheFunction = functionList
          .map((f) => f.displayedName)
          .indexOf(e.function);
        let transform = null;
        if (
          !isNaN(indexOfTheFunction) &&
          indexOfTheFunction >= 0 &&
          indexOfTheFunction < functionList.length
        ) {
          transform =
            functionList[indexOfTheFunction].numberOfParameters == 0
              ? `${e.function}(source)`
              : functionList[indexOfTheFunction].numberOfParameters == 1
              ? `${e.function}(source,${e.code0})`
              : functionList[indexOfTheFunction].numberOfParameters == 2
              ? `${e.function}(source,${e.code0},${e.code1})`
              : null;
        }
        return {
          id: get(e, "id", 0),
          objectMapId: get(e, "objectMapId", 0),
          transformation:
            values[fields.pickDataFrom] === 3
              ? ""
              : !isEmpty(transform)
              ? transform
              : "",
          // constantValue: values.constantValue,
          [fields.pickDataFrom]: values[fields.pickDataFrom],
        };
        // }
      });
    if (isEmpty(itemId)) {
      const finalOutput = initialData.map((e) => {
        if (e.tId == item.tId) {
          return {
            ...e,
            fieldOperations: operations ? operations : [],
            dataSource: get(values, "pickDataFrom", 1),
            constantValue: get(values, "constantValue", ""),
            transformedType: getFinalResultType(values),
          };
        }
        return e;
      });
      setTargetField(finalOutput);
    }
    if (!isEmpty(itemId)) {
      const output = initialData.map((e) => {
        if (e.tId == itemId) {
          const childs = e.childObjectMaps.map((f) => {
            if (f.tId == item.tId) {
              return {
                ...f,
                fieldOperations: operations ? operations : [],
                dataSource: get(values, "pickDataFrom", 1),
                constantValue: get(values, "constantValue", ""),
                transformedType: getFinalResultType(values),
              };
            }
            return f;
          });
          return {
            ...e,
            childObjectMaps: childs,
          };
        }
        return e;
      });
      setTargetField(output);
    }
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
                returnDataType: null,
              },
            ],
        [fields.pickDataFrom]: get(item, "dataSource", 1),
        // get(item, "dataSource", 1),
        constantValue: get(item, "constantValue", ""),
        targetFieldRename: item.displayName,
        targetFieldName: item.displayName,
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
      onSubmit={(values) => {
        setSave(values);
        onCancel();
      }}
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

        return (
          <Form autoComplete="off" onSubmit={handleSubmit}>
            <SliderPanel
              isOpen={addFieldSlider}
              size="50"
              onClose={onCancel}
              showCancel={false}
              backdropClicked={() => setFieldSlider(false)}
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
                      // onClick={() => {
                      //   setSave(values);
                      //   onCancel();
                      // }}
                      type="submit"
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
                    <SourceFieldComponent item={itemMapped} />
                    <div className="d-flex mt-4">
                      <Field
                        style={{ width: "14.5rem" }}
                        name={`targetFieldName`}
                        type="text"
                        isRequired
                        label="Target Field Name"
                        size="sm"
                        value={values.targetFieldName}
                        component={FieldInput}
                      />
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
                    {values[fields.pickDataFrom] === 3 ? (
                      <>
                        <div className="function-heading mb-4 mt-5">
                          Constant
                        </div>
                        <div className="d-flex">
                          <Field
                            style={{ width: "14.5rem" }}
                            name={`constantValue`}
                            type="text"
                            isRequired
                            label="Value"
                            size="sm"
                            // value={values.constantValue}
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
                    ) : values[fields.pickDataFrom] === 6 ? (
                      <>
                        <div className="function-heading mb-4 mt-5">
                          Constant
                        </div>
                        <div className="d-flex">
                          <Field
                            style={{ width: "14.5rem" }}
                            name={`constantValue`}
                            type="text"
                            isRequired
                            label="Value"
                            size="sm"
                            // value={values.constantValue}
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
                                        const fuData = functionData.find(
                                          (f) => f.displayedName === e.function
                                        );
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
                                                        `resultArray[${i}].result`,
                                                        { temp_result }
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
                                                  options={functionData.filter(
                                                    (fun1) => {
                                                      if (i == 0) {
                                                        return (
                                                          fun1.dataType ==
                                                          itemMapped.type
                                                        );
                                                      } else {
                                                        return (
                                                          fun1.dataType ==
                                                          values[
                                                            `fieldOperations`
                                                          ][i - 1]
                                                            ?.returnDataType
                                                        );
                                                      }
                                                    }
                                                  )}
                                                  placeholder="Enter Function"
                                                  onSelect={(label, value) => {
                                                    setFieldValue(
                                                      `fieldOperations[${i}].function`,
                                                      label
                                                    );
                                                    let tempIndex = null;
                                                    for (let ind in functionData) {
                                                      if (
                                                        functionData[ind]
                                                          .displayedName ==
                                                        label
                                                      ) {
                                                        tempIndex = ind;
                                                      }
                                                    }
                                                    setFieldValue(
                                                      `fieldOperations[${i}].returnDataType`,
                                                      functionData[tempIndex]
                                                        ?.returnDataType
                                                    );
                                                  }}
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
                                                    tempResultArray.splice(
                                                      i,
                                                      1
                                                    );
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
                                          tempResultArray.push({
                                            result: null,
                                          });
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
                                      {
                                        // (values["fieldOperations"][0].function!="") &&
                                        values["fieldOperations"].map(
                                          (e, i) => {
                                            const fieldOperationValues = get(
                                              values,
                                              `fieldOperations[${i}]`,
                                              ""
                                            );

                                            // if(e==null){
                                            //   setFieldValue(`fieldOperations[${i}]`, {function: '', returnDataType: null})
                                            //   e= {function: '', returnDataType: null}
                                            // }
                                            const fuData = functionData.find(
                                              (f) =>
                                                f.displayedName === e?.function
                                            );
                                            const codeFields = !isEmpty(fuData)
                                              ? !isEmpty(fuData.codebox)
                                                ? fuData.codebox.map(
                                                    (g, index) => (
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
                                                              `resultArray[${i}].result`,
                                                              { temp_result }
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
                                                    )
                                                  )
                                                : null
                                              : null;

                                            return (
                                              <>
                                                <div className="field-operation-functions">
                                                  <div className="function-text-fields">
                                                    <Field
                                                      name={`fieldOperations[${i}].function`}
                                                      label="Function Name"
                                                      options={functionData.filter(
                                                        (fun1) => {
                                                          if (
                                                            values.pickDataFrom ==
                                                            2
                                                          ) {
                                                            return (
                                                              fun1.dataType == 1
                                                            );
                                                          } else if (i == 0) {
                                                            return (
                                                              fun1.dataType ==
                                                              itemMapped.type
                                                            );
                                                          } else {
                                                            return (
                                                              fun1.dataType ==
                                                              values[
                                                                `fieldOperations`
                                                              ][i - 1]
                                                                ?.returnDataType
                                                            );
                                                          }
                                                        }
                                                      )}
                                                      placeholder="Enter Function"
                                                      onSelect={(
                                                        label,
                                                        value
                                                      ) => {
                                                        setFieldValue(
                                                          `fieldOperations[${i}].function`,
                                                          label
                                                        );
                                                        let tempIndex = null;
                                                        for (let ind in functionData) {
                                                          if (
                                                            functionData[ind]
                                                              .displayedName ==
                                                            label
                                                          ) {
                                                            tempIndex = ind;
                                                          }
                                                        }
                                                        setFieldValue(
                                                          `fieldOperations[${i}].returnDataType`,
                                                          functionData[
                                                            tempIndex
                                                          ]?.returnDataType
                                                        );
                                                        // setFieldValue(
                                                        //   `resultArray[${i}].returnDataType`,
                                                        //   functionData[tempIndex].returnDataType
                                                        // );
                                                      }}
                                                      isRequired
                                                      component={SearchDrop}
                                                      autoComplete="off"
                                                    />
                                                  </div>
                                                  {!isEmpty(fuData) &&
                                                    codeFields}
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
                                                        tempResultArray.splice(
                                                          i,
                                                          1
                                                        );
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
                                          }
                                        )
                                      }
                                      <div
                                        className="add-custom-field-text"
                                        style={{ cursor: "pointer" }}
                                        onClick={() => {
                                          const tempResultArray = [
                                            ...values.resultArray,
                                          ];
                                          tempResultArray.push({
                                            result: null,
                                          });
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
          </Form>
        );
      }}
    </Formik>
  );
};
