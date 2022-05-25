import React, { useState } from "react";
import { Formik, Field } from "formik";
import { Form, Button } from "react-bootstrap";
import { get, isEmpty } from "lodash";
import {
  FieldButtonGroup,
  SliderPanel,
  SearchList,
  FieldInput,
} from "../../../../shared/components";
import { toOptionValuesFromMapper } from "../../../../shared/utils";
import { SourceFieldComponent } from "./SourceFieldComponent";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/pro-light-svg-icons";
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-csharp";
import "ace-builds/src-noconflict/theme-terminal";
import "ace-builds/src-noconflict/ext-language_tools";
import functionData from "./FunctionList.js";
const initialValues = [];
const data = {
  field: "EMPLOYEE ID",
  value: "",
  dataType: "Numeric",
  columnName: "Col A",
};

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
};
export const ConfigureTransformations = (props) => {
  const {
    addFieldSlider,
    onCancel,

    setFieldSlider,
  } = props;
  const [ShowEditorConsole, setShowEditorConsole] = useState(false);
  const [editorConsoleCode, setEditorConsoleCode] = useState("");

  const [updatevalue, setupdatevalue] = useState(0);
  function useForceUpdate() {
    return () => setupdatevalue((updatevalue) => updatevalue + 1);
  }

  const [functions, setfunctions] = useState(functionData);
  // const [selectedfunction, setselectedfunction] = useState(null)

  const [funData, setfunData] = useState([
    {
      functionName: "",
      codeName: "",
      resultName: "",
      selectedValue: null,
      codebox: [],
    },
  ]);

  const switchView = (
    functionName = "",
    input_value = "",
    arg1,
    arg2,
    indexOfItem
  ) => {
    let returnObject = null;
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
          code: null,
          result: null,
        };
        break;
    }
    return returnObject;
  };

  const saveConfigureTransformation = () => {
    setFieldSlider(false);
  };

  const CustomFunctionComponent = () => {
    const forceUpdate = useForceUpdate();

    return (
      <>
        {funData.map((item, index) => (
          <Form.Group
            style={{
              width: "20rem",
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
              padding: "0px",
              margin: "0px",
            }}
          >
            <div className="d-flex">
              <SearchList
                label="Function"
                funData={funData}
                setfunData={setfunData}
                fundataIndex={index}
                options={functionData}
                onChange={forceUpdate}
                onSelect={(value, label, codebox) => {
                  let tempFunData = [...funData];
                  tempFunData[index].functionName = label;
                  tempFunData[index].codebox = codebox;
                  setfunData(tempFunData);
                }}
              />
            </div>

            <div>
              {item.codebox.length != 0 && (
                <label
                  style={{ fontSize: "12px", color: "black" }}
                  for={"configure_transform_textbox0" + index}
                  className="ml-3"
                >
                  Code
                </label>
              )}
              <div className="d-flex justify-content-center align-items-center">
                {item.codebox.map((codeNum, codeIndex) => (
                  <textarea
                    style={{
                      color: "black",
                      width: "8rem",
                      height: "36px",
                    }}
                    onChange={forceUpdate}
                    className="form-control ml-3"
                    id={"configure_transform_textbox" + codeNum + index}
                    // value={switchView(item.functionName.trim()).code}
                  />
                ))}
              </div>
            </div>

            <div className="d-flex" style={{ marginLeft: "auto" }}>
              <FontAwesomeIcon
                icon={faTrash}
                size="20px"
                color="#EB5757"
                onClick={() => {
                  let tempFunData = [...funData];
                  // tempFunData.splice(index, 1);
                  let temp = tempFunData.filter((item, ind) => {
                    if (ind == index) {
                      return false;
                    }
                    return true;
                  });
                  setfunData(temp);
                }}
                style={{
                  top: "0px",
                  marginLeft: "10px",
                  cursor: "pointer",
                  marginTop: "20%",
                }}
              />

              <div className="ml-3">
                <label
                  style={{ fontSize: "12px", color: "black" }}
                  for="exampleFormControlTextarea2"
                >
                  Result
                </label>

                <textarea
                  style={{
                    color: "black",
                    width: "10rem",
                    height: "2.25rem",
                    // border: "none",
                  }}
                  onChange={() => {
                    // let temp= [...funData]
                    // temp[index].resultName=this.value
                    // setfunData(funData)
                  }}
                  className="form-control"
                  id={"configure_transform_textbox2" + index}
                  value={
                    item.functionName.trim()
                      ? (() => {
                          let input_term =
                            index == 0
                              ? data["value"]
                              : funData[index - 1].resultName;
                          let resultItem = switchView(
                            item.functionName.trim(),
                            input_term,
                            document.getElementById(
                              "configure_transform_textbox0" + index
                            )
                              ? document.getElementById(
                                  "configure_transform_textbox0" + index
                                ).value
                              : "",
                            document.getElementById(
                              "configure_transform_textbox1" + index
                            )
                              ? document.getElementById(
                                  "configure_transform_textbox1" + index
                                ).value
                              : "",
                            index
                          ).result;

                          if (resultItem != null) {
                            let temp = [...funData];
                            temp[index].resultName = resultItem;
                            setfunData(funData);
                            console.log("funData", funData);
                          }
                          return resultItem;
                        })()
                      : ""
                    // document.getElementById(
                    //   "configure_transform_textbox2" + (index - 1)
                    // ) &&
                    // document.getElementById(
                    //   "configure_transform_textbox2" + (index - 1)
                    // ).value
                  }
                />
              </div>
            </div>
          </Form.Group>
        ))}
        <div
          onClick={() => {
            setfunData([
              ...funData,
              {
                functionName: "",
                codeName: "",
                selectedValue: null,
                resultName: null,
                codebox: [],
              },
            ]);
          }}
          className="add-custom-field-text"
          style={{ cursor: "pointer" }}
        >
          Add more function
        </div>
      </>
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
      initialValues={{ ...initialValues }}
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
          ...rest
        } = formProps;

        return (
          <SliderPanel
            isOpen={addFieldSlider}
            size="50"
            onClose={() => onCancel()}
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
                  <Button variant="secondary" onClick={() => onCancel()}>
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    className="ml-4"
                    onClick={saveConfigureTransformation}
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
                      {data.field}
                    </p>
                    {true ? (
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
                  <SourceFieldComponent item={data} />
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
                        return CustomFunctionComponent();
                      }
                    })()}
                  </div>
                </div>
              </Form>
            </div>
          </SliderPanel>
        );
      }}
    </Formik>
  );
};
