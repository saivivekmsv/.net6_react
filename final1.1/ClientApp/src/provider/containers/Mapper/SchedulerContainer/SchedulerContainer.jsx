import React, {
  useState,
  Component,
  useContext,
  useEffect,
  useRef,
} from "react";
import {
  ManageMapperLayout,
  Dropside,
  SliderPanel,
  FieldInput,
  FieldButtonGroup,
  FieldInputPassword,
} from "../../../components";
import { get, isEmpty } from "lodash";
import { Button, ToggleButton, ToggleButtonGroup } from "react-bootstrap";
import { onSchedulerSave } from "../../../services";
import { Field, Formik, Form } from "formik";
import SchedulerSlider from "./SchedulerSlider";
import { components } from "react-select";
import { default as ReactSelect } from "react-select";
import "../../../styles/containers/SchedulerContainer.scss";
import {
  getPathWithParam,
  MANAGE_MAPPER_ROUTES,
  manageMapperFormNames,
  FLOW_TYPES,
} from "../../../utils";
import { useRouterParams } from "../../../abstracts";
import * as Yup from "yup";
import { manageMapperStore, setMapperPageLevelData } from "../../../contexts";

const convertIntToString = (intValue) => {
  const keyValuePair = {
    0: "00",
    1: "01",
    2: "02",
    3: "03",
    4: "04",
    5: "05",
    6: "06",
    7: "07",
    8: "08",
    9: "09",
  };
  if (intValue in keyValuePair) {
    return keyValuePair[intValue];
  }
  return intValue.toString();
};

const formName = manageMapperFormNames.SCHEDULER;
const decodecronExpression = (cronExp = "") => {
  const values = {
    SelectedTime: null,
    Optn1: null,
    Optn2: null,
    SelectedFreq: null,
    StartHour: null,
    StartMinute: null,
  };
  if (cronExp == "" || cronExp == null) {
    return values;
  }
  const cronExpressionSplit = cronExp.split(" ");
  if (
    cronExp.includes("* * * *") ||
    (cronExp.includes("* * *") &&
      (cronExp.includes("-") ||
        cronExp.includes(",") ||
        cronExp.includes("/"))) ||
    cronExp.includes("1/1 * *")
  ) {
    if (
      (cronExp[0] == "0" && cronExp[1] == " ") ||
      cronExp.includes("1/1 * *")
    ) {
      values.SelectedTime = 1;
      if (cronExp.includes("1/1 * *")) {
        values.SelectedFreq = 4;
        const temp = cronExpressionSplit;
        values.Optn2 = temp[0];
        values.Optn1 = temp[1];
        return values;
      } else if (cronExp == "0 * * * *") {
        values.SelectedFreq = 0;
        return values;
      } else if (cronExp.includes("/")) {
        values.SelectedFreq = 1;
        const temp = cronExpressionSplit[1].split("/");
        values.Optn1 = temp[1];
        values.Optn2 = temp[0];
        return values;
      } else if (cronExp.includes("-")) {
        values.SelectedFreq = 3;
        const temp = cronExpressionSplit[1].split("-");
        values.Optn1 = temp[0];
        values.Optn2 = temp[1];
        return values;
      } else {
        values.SelectedFreq = 2;
        values.Optn1 = cronExpressionSplit[1].split(",").join(",");
        return values;
      }
    } else {
      values.SelectedTime = 0;
      if (cronExp == "* * * *") {
        values.SelectedFreq = 0;
        return values;
      } else if (cronExp.includes("/")) {
        values.SelectedFreq = 1;
        const options_ = cronExp.split("/");
        values.Optn2 = options_[0];
        values.Optn1 = options_[1].split(" ")[0];
        return values;
      } else if (cronExp.includes("-")) {
        values.SelectedFreq = 3;
        const options_ = cronExp.split("-");
        values.Optn1 = options_[0];
        values.Optn2 = options_[1].split(" ")[0];
        return values;
      } else {
        values.SelectedFreq = 2;
        const options_ = cronExpressionSplit[0];
        values.Optn1 = options_.split(",").join(",");
        return values;
      }
    }
  } else {
    values.SelectedTime = 2;
    const temp = cronExpressionSplit;
    values.StartMinute = convertIntToString(parseInt(temp[0]));
    values.StartHour = convertIntToString(parseInt(temp[1]));
    if (cronExp.includes("* * *")) {
      values.SelectedFreq = 0;
      return values;
    } else if (cronExp.includes("/")) {
      if (cronExp[cronExp.length - 1] == "*") {
        values.SelectedFreq = 2;
        const temp2_ = cronExpressionSplit;
        values.Optn1 = temp2_[2].split("/")[1];
        values.Optn2 = temp2_[2].split("/")[0];
        return values;
      } else {
        values.SelectedFreq = 1;
        const temp2_ = cronExpressionSplit;
        values.Optn1 = temp2_[4].split("/")[1];
        values.Optn2 = temp2_[4].split("/")[0];
        return values;
      }
    } else if (cronExp.includes("W")) {
      values.SelectedFreq = 5;
      const temp2_ = cronExpressionSplit;
      values.Optn1 = temp2_[2].substring(0, temp2_[2].length - 1);
      return values;
    } else if (cronExp.includes("#")) {
      values.SelectedFreq = 6;
      const temp2_ = cronExpressionSplit;
      values.Optn1 = temp2_[4].split("#")[1];
      values.Optn2 = temp2_[4].split("#")[0];
      return values;
    } else {
      if (cronExp[cronExp.length - 1] == "*") {
        values.SelectedFreq = 4;
        const temp2_ = cronExpressionSplit;
        values.Optn1 = temp2_[2].split(",").join(",");
        return values;
      } else {
        values.SelectedFreq = 3;
        const temp2_ = cronExpressionSplit;
        values.Optn1 = temp2_[temp2_.length - 1].split(",").join(",");
        return values;
      }
    }
  }
};

const SchedulerContainer = (props) => {
  const { flow, profileId } = useRouterParams();
  const { state, dispatch } = useContext(manageMapperStore);
  const ftpDetails = !isEmpty(get(state, formName, []))
    ? get(state, formName, []).ftpChannel
    : get(state, "api.data.ftpChannel");
  const formikComponent = useRef(null);
  const isEdit = flow === FLOW_TYPES.EDIT;

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
      // onClick: onSubmit,
      // link: getPathWithParam({
      //   path: `${MANAGE_MAPPER_ROUTES.REVIEW_AND_CONFIRM}`,
      //   pathParam: [flow, profileId],
      // }),
    },
  ];

  const [textDisplay, settextDispay] = useState(null);
  const [isSliderOpen, setSliderOpen] = useState(false);
  const [isFreqSelected, setFreqSelected] = useState(false);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedOptn, setSelectedOptn] = useState(null);
  // const[setOptnText,optnText]=useState(null);
  let optnText = "";
  const initialValuesFromCron = {
    ...decodecronExpression(
      !isEmpty(get(state, formName, []))
        ? get(state, formName, []).cronExpression
        : get(state, "api.data.cronExpression", "")
    ),
  };

  const initialValues = {
    SelectedTime: initialValuesFromCron.SelectedTime,
    Optn1: initialValuesFromCron.Optn1,
    Optn2: initialValuesFromCron.Optn2,
    SelectedFreq: initialValuesFromCron.SelectedFreq,
    // optnText: "",
    StartHour: initialValuesFromCron.StartHour,
    StartMinute: initialValuesFromCron.StartMinute,
    // StartStatement: "",
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

  const [requireFTP, setRequireFTP] = useState(true);
  const ValidationSchema = Yup.object().shape({
    FURL: Yup.string().when("FTPDetails", {
      is: true,
      then: Yup.string().required("URL Required"),
    }),
    // sourceUserName: Yup.string().when("fileType", {
    //   is: 1,
    //   then: Yup.string().required("Username Required"),
    // }),
    // sourcePassword: Yup.string().when("fileType", {
    //   is: 1,
    //   then: Yup.string().required("Password Required"),
    // }),
  });
  const consoleLog = (value) => {
    console.log("1234values", value);
  };

  const getCronText = (values) => {
    let cronText = "";
    if (values.SelectedTime === 0) {
      switch (parseInt(values.SelectedFreq)) {
        case 0:
          cronText = "Every Minute";
          break;

        case 1:
          cronText = `Every ${get(
            values,
            "Optn1"
          )} minute(s) starting at minute ${get(values, "Optn2")}`;
          break;

        case 2:
          cronText = `Specific minute(s) ${get(values, "Optn1")} `;
          break;

        case 3:
          cronText = `Every minute between minute ${get(
            values,
            "Optn1"
          )} and minute ${get(values, "Optn2")}`;
          break;
      }
    } else if (values.SelectedTime === 1) {
      switch (parseInt(values.SelectedFreq)) {
        case 0:
          cronText = "Every Hour";
          break;

        case 1:
          cronText = `Every ${get(
            values,
            "Optn1"
          )} hours(s) starting at hour ${get(values, "Optn2")}`;
          break;

        case 2:
          cronText = `Specific hour(s) ${get(values, "Optn1")} `;
          break;

        case 3:
          cronText = `Every hour between hour ${get(
            values,
            "Optn1"
          )} and hour ${get(values, "Optn2")}`;
          break;

        case 4:
          cronText = `Starts at hour ${get(values, "Optn1")} and minute ${get(
            values,
            "Optn2"
          )}`;
          break;
      }
    } else if (values.SelectedTime === 2) {
      switch (parseInt(values.SelectedFreq)) {
        case 0:
          cronText = "Every Day";
          break;

        case 1:
          cronText = `Every ${get(values, "Optn1")} days(s) starting on ${get(
            values,
            "Optn2"
          )}`;
          break;

        case 2:
          cronText = `Every ${get(
            values,
            "Optn1"
          )} days(s) starting on the ${get(values, "Optn2")}`;
          break;

        case 3:
          cronText = `Specific day(s) of the week ${get(values, "Optn1")} `;
          break;

        case 4:
          cronText = `Specific day(s) of the month ${get(values, "Optn1")} `;
          break;

        case 5:
          cronText = `Nearest weekday(Monday to Friday) to the  ${get(
            values,
            "Optn1"
          )} `;
          break;

        case 6:
          cronText = `On the ${get(values, "Optn1")} ${get(
            values,
            "Optn2"
          )} of the month `;
          break;
      }
    }
    return cronText;
  };

  const getCronExpression = (values) => {
    let cronValue = "";
    if (values.SelectedTime === 0) {
      switch (parseInt(values.SelectedFreq)) {
        case 0:
          cronValue = "* * * *";
          break;

        case 1:
          cronValue = `${parseInt(values.Optn2)}/${values.Optn1} * * * *`;
          break;

        case 2:
          cronValue = `${values.Optn1.split(",")
            .map((val1) => parseInt(val1.trim()))
            .join(",")} * * * *`;
          break;

        case 3:
          cronValue = `${parseInt(values.Optn1)}-${parseInt(
            values.Optn2
          )} * * * *`;
          break;
      }
    } else if (values.SelectedTime === 1) {
      switch (parseInt(values.SelectedFreq)) {
        case 0:
          cronValue = "0 * * * *";
          break;

        case 1:
          cronValue = `0 ${parseInt(values.Optn2)}/${parseInt(
            values.Optn1
          )} * * *`;
          break;

        case 2:
          cronValue = `0 ${values.Optn1.split(",")
            .map((val1) => parseInt(val1.trim()))
            .join(",")} * * *`;
          break;

        case 3:
          cronValue = `0 ${parseInt(values.Optn1)}-${parseInt(
            values.Optn2
          )} * * *`;
          break;

        case 4:
          cronValue = `${parseInt(values.Optn2)} ${parseInt(
            values.Optn1
          )} 1/1 * *`;
          break;
      }
    } else if (values.SelectedTime === 2) {
      const intToDay = {
        1: "sunday",
        2: "monday",
        3: "tuesday",
        4: "wednesday",
        5: "thursday",
        6: "friday",
        7: "saturday",
      };
      const startHour = values.StartHour;
      const startMin = values.StartMinute;
      const dayMapToInt = (dayString) => {
        switch (dayString) {
          case "sunday":
            return 1;
            break;
          case "monday":
            return 2;
            break;
          case "tuesday":
            return 3;
            break;
          case "wednesday":
            return 4;
            break;
          case "thursday":
            return 5;
            break;
          case "friday":
            return 6;
            break;
          case "saturday":
            return 7;
            break;
        }
      };
      switch (parseInt(values.SelectedFreq)) {
        case 0:
          cronValue = `${parseInt(startMin)} ${parseInt(startHour)} * * *`;
          break;

        case 1:
          cronValue = `${parseInt(startMin)} ${parseInt(
            startHour
          )} * * ${dayMapToInt(intToDay[values.Optn2.trim().toLowerCase()])}/${
            values.Optn1
          }`;
          break;

        case 2:
          cronValue = `${parseInt(startMin)} ${parseInt(startHour)} ${
            values.Optn2
          }/${values.Optn1} * *`;
          break;

        case 3:
          cronValue = `${parseInt(startMin)} ${parseInt(
            startHour
          )}  * * ${values.Optn1.split(",")
            .map((dayString) => dayString.trim().substring(0, 3).toUpperCase())
            .join(",")}`;
          break;

        case 4:
          cronValue = `${parseInt(startMin)} ${parseInt(startHour)} ${
            values.Optn1
          } * *`;
          break;

        case 5:
          cronValue = `${parseInt(startMin)} ${parseInt(startHour)} ${
            values.Optn1
          }W * *`;
          break;

        case 6:
          cronValue = `${parseInt(startMin)} ${parseInt(
            startHour
          )} * * ${dayMapToInt(
            intToDay[values.Optn2.trim().toLowerCase()]
          )}#${values.Optn1.substring(0, 1)}`;
          break;
      }
    }
    return cronValue;
  };

  const onSubmit = (values) => {
    // const values= formikComponent.current.values
    const { history } = props;
    const payload = {
      ...get(state, "api.data"),
      cronExpression: getCronExpression(values),
      ftpChannel: {
        url: values.FURL,
        filepath: values.FPath,
        username: values.FUserName,
        password: values.FPassword,
      },
    };

    onSchedulerSave(payload)
      .then((res) => {
        dispatch(
          setMapperPageLevelData({
            formName: formName,
            fieldData: {
              cronExpression: getCronExpression(values),
              ftpChannel: {
                url: values.FURL,
                filePath: values.FPath,
                userName: values.FUserName,
                password: values.FPassword,
              },
            },
          })
        );
        if (isEdit) {
          history.push(`${MANAGE_MAPPER_ROUTES.OVERVIEW}/${profileId}`);
        } else if (!isEdit) {
          history.push(
            `${MANAGE_MAPPER_ROUTES.REVIEW_AND_CONFIRM}/${profileId}`
          );
        }
      })
      .catch((err) => {
        console.log("1234err", err);
      });
  };
  return (
    <Formik
      initialValues={{
        ...initialValues,
        FTPDetails: !isEmpty(ftpDetails) ? true : false,
        FURL: !isEmpty(ftpDetails) ? get(ftpDetails, "url", "") : "",
        FPath: !isEmpty(ftpDetails) ? get(ftpDetails, "filePath", "") : "",
        FUserName: !isEmpty(ftpDetails) ? get(ftpDetails, "userName", "") : "",
        FPassword: !isEmpty(ftpDetails) ? get(ftpDetails, "password", "") : "",
        FCronExpression: !isEmpty(get(state, "api.data"))
          ? get(state, "api.data.cronExpression", "")
          : "",
      }}
      innerRef={formikComponent}
      onSubmit={onSubmit}
      enableReinitialize
      validateOnChange={false}
      validateOnBlur={false}
    >
      {({
        errors,
        values,
        touched,
        setValues,
        handleChange,
        setFieldValue,
        handleSubmit,
      }) => (
        <Form autoComplete="off" onSubmit={handleSubmit}>
          <ManageMapperLayout buttons={buttons}>
            <div>
              <div className="SFTPDetailsText">FTP Details</div>

              <div className="SFTPFieldsText">Requires FTP</div>
              <Field
                isRequired
                name="FTPDetails"
                size="md"
                className="bg-transparent p-0"
                options={yesNoOptions}
                selectedValue={values.FTPDetails}
                onChange={(val) => {
                  setFieldValue("FTPDetails", val);
                  setRequireFTP(val);
                }}
                component={FieldButtonGroup}
              />

              {values["FTPDetails"] && (
                <div style={{ width: "20rem", paddingTop: "0.2rem" }}>
                  <Field
                    name="FURL"
                    placeholder={"eg : ftp://yourname@host.dom/"}
                    label={"FTP URL"}
                    noLabelTransform
                    onChange={handleChange}
                    component={FieldInput}
                    isRequired
                  />

                  <Field
                    name="FPath"
                    placeholder={"eg : ftp.yourname@host.dom/batchfile"}
                    label={"FTP path"}
                    noLabelTransform
                    onChange={handleChange}
                    component={FieldInput}
                    isRequired
                  />

                  <Field
                    name="FUserName"
                    placeholder={"Enter UserName"}
                    label={"UserName"}
                    onChange={handleChange}
                    noLabelTransform
                    component={FieldInput}
                    isRequired
                  />
                  <Field
                    name="FPassword"
                    onChange={handleChange}
                    placeholder={"Enter Password"}
                    label={"Password"}
                    noLabelTransform
                    component={FieldInputPassword}
                    isRequired
                  />
                  <Field
                    name="FCronExpression"
                    label={"Cron Expression"}
                    value={
                      isEmpty(getCronExpression(values))
                        ? get(values, "FCronExpression")
                        : getCronExpression(values)
                    }
                    onChange={handleChange}
                    disabled
                    noLabelTransform
                    component={FieldInput}
                  />
                </div>
              )}
              <Field
                name="FCronExpression"
                // placeholder={"Enter UserName"}
                label={"Cron Expression"}
                value={getCronExpression(values)}
                onChange={handleChange}
                disabled
                noLabelTransform
                component={FieldInput}
              />
              <div
                // onClick={() => {
                //   onSubmit();
                // }}
                className="freqText"
              >
                Frequency
              </div>
              {values.SelectedTime !== null &&
              values.SelectedTime !== undefined &&
              values.SelectedFreq !== null &&
              values.SelectedFreq !== undefined ? (
                <div style={{ display: "flex" }}>
                  <div className="mr-2">
                    <p id="freqDisplayText" className="displayOptn">
                      {/* {values.optnText} */}
                      {getCronText(values)}
                    </p>
                    <p id="freqDisplayText" className="displayOptn">
                      {/* {values.StartStatement} */}
                      {values["SelectedTime"] == 2 &&
                        `Start at hour ${values.StartHour} and minute ${values.StartMinute}`}
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
                setFieldValue={setFieldValue}
              ></SchedulerSlider>
            </div>
            {/* <pre>{JSON.stringify(values, null, 2)}</pre> */}
          </ManageMapperLayout>
        </Form>
      )}
    </Formik>
  );
};

export default SchedulerContainer;
