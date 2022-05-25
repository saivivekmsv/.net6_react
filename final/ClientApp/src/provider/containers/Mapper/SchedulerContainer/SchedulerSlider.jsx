import React, { useState, Component, useEffect } from "react";
import {
  Dropside,
  SliderPanel,
  Select,
  FieldButtonGroup,
  SchedulerCheckList,
  MapperSchedDropDown,
  SchedulerDropDown,
} from "../../../components";
import { Button, ToggleButton, ToggleButtonGroup } from "react-bootstrap";
import { Field } from "formik";
import { get, isEmpty } from "lodash";

import { Global } from "recharts";

const SchedulerSlider = ({
  setSliderOpen,
  isSliderOpen,
  isFreqSelected,
  setFreqSelected,
  values,
  handleChange,
  setFieldValue,
}) => {
  const genList = (min, max) => {
    const listOptions = [];
    obj = {};
    for (var i = min; i < max; i++) {
      var obj = {};
      obj["id"] = i;
      obj["value"] = i;
      obj["label"] = i;
      listOptions.push(obj);
    }
    return listOptions;
  };
  // useEffect(()=>{
  //   setDropDown1("");
  // },[minuteOption,hourOption,dayOption])

  const dblList = (min, max) => {
    const listOptions = [];
    obj = {};
    for (var i = min; i < max; i++) {
      var obj = {};
      if (i < 10) {
        obj["id"] = i;
        obj["value"] = i;
        obj["label"] = `0${i}`;
        listOptions.push(obj);
      } else {
        obj["id"] = i;
        obj["value"] = i;
        obj["label"] = i;
        listOptions.push(obj);
      }
    }
    return listOptions;
  };

  const datesList = (min, max) => {
    const listOptions = [];
    obj = {};
    for (var i = min; i < max; i++) {
      var obj = {};
      if (i == 1 || i == 21 || i == 31) {
        obj["id"] = i;
        obj["value"] = i;
        obj["label"] = `${i}st`;
        listOptions.push(obj);
      } else if (i == 2 || i == 22) {
        obj["id"] = i;
        obj["value"] = i;
        obj["label"] = `${i}nd`;
        listOptions.push(obj);
      } else if (i == 3 || i == 23) {
        obj["id"] = i;
        obj["value"] = i;
        obj["label"] = `${i}rd`;

        listOptions.push(obj);
      } else {
        obj["id"] = i;
        obj["value"] = i;
        obj["label"] = `${i}th`;
        listOptions.push(obj);
      }
    }
    return listOptions;
  };

  const timeOptions = [
    {
      label: "Minutes",
      value: 0,
    },

    {
      label: "Hours",
      value: 1,
    },
    {
      label: "Days",
      value: 2,
    },
  ];

  const daysList = [
    { id: 0, label: "Sunday" },
    { id: 1, label: "Monday" },
    { id: 2, label: "Tuesday" },
    { id: 3, label: "Wednesday" },
    { id: 4, label: "Thursday" },
    { id: 5, label: "Friday" },
    { id: 6, label: "Saturday" },
  ];
  const dropDownSetter = () => {
    const intToDay = {
      1: "Sunday",
      2: "Monday",
      3: "Tuesday",
      4: "Wednesday",
      5: "Thursday",
      6: "Friday",
      7: "Saturday",
    };

    let dropDownValues = [values.Optn1, values.Optn2];
    if (
      values.SelectedTime == 2 &&
      (values.SelectedFreq == 1 || values.SelectedFreq == 6)
    ) {
      dropDownValues[1] = intToDay[values.Optn2];
    }
    return dropDownValues;
  };
  const dropDownValues = dropDownSetter();
  const [dropDown1, setDropDown1] = useState(dropDownValues[0]);
  const [dropDown2, setDropDown2] = useState(dropDownValues[1]);
  const [startHour, setStartHour] = useState(values.StartHour);
  const [startMinute, setStartMinute] = useState(values.StartMinute);
  const [timeSelector, settimeSelector] = useState(values.SelectedTime);

  const onCancel = () => {
    if (isFreqSelected) {
      setSliderOpen(false);
    } else {
      setSliderOpen(false);
      setFreqSelected(false);
      // settimeSelector(0);
      // values.SelectedTime = "";
      // values.SelectedFreq = "";
      // values.Optn1 = "";
      // values.Optn2 = "";
      // values.optnText = "";
      // setMinuteOption("");
      // setHourOption("");
      // setDayOption("");
    }
  };

  const saveFunc = (e) => {
    e.preventDefault();
    setFreqSelected(true);
    setSliderOpen(false);
    if (timeSelector === 0) {
      setFieldValue("SelectedTime", 0);
      setFieldValue("SelectedFreq", minuteOption);
      setFieldValue("Optn1", dropDown1);
      setFieldValue("Optn2", dropDown2);

      if (minuteOption === 0) {
      } else if (minuteOption === 1) {
        if (values.Optn1 === null || values.Optn2 === null) {
          alert("Please select an option from the dropdown");
          setSliderOpen(true);
          setFreqSelected(false);
        }
      } else if (minuteOption === 2) {
        if (values.Optn1 === null) {
          alert("Please select an option from the dropdown");
          setSliderOpen(true);
          setFreqSelected(false);
        }
      } else if (minuteOption === 3) {
        if (values.Optn1 === null || values.Optn2 === null) {
          alert("Please select an option from the dropdown");
          setSliderOpen(true);
          setFreqSelected(false);
        }
      }
    } else if (timeSelector === 1) {
      setFieldValue("SelectedTime", 1);
      setFieldValue("SelectedFreq", hourOption);
      setFieldValue("Optn1", dropDown1);
      setFieldValue("Optn2", dropDown2);
      if (hourOption === 0) {
      } else if (hourOption === 1) {
        if (values.Optn1 === null || values.Optn2 === null) {
          alert("Please select an option from the dropdown");
          setSliderOpen(true);
          setFreqSelected(false);
        }
      } else if (hourOption === 2) {
        if (values.Optn1 === null) {
          alert("Please select an option from the dropdown");
          setSliderOpen(true);
          setFreqSelected(false);
        }
      } else if (hourOption === 3) {
        if (values.Optn1 === null || values.Optn2 === null) {
          alert("Please select an option from the dropdown");
          setSliderOpen(true);
          setFreqSelected(false);
        }
      } else if (hourOption === 4) {
        if (values.Optn1 === null || values.Optn2 === null) {
          alert("Please select an option from the dropdown");
          setSliderOpen(true);
          setFreqSelected(false);
        }
      }
    } else if (timeSelector === 2) {
      // values.SelectedTime = 2;
      setFieldValue("SelectedTime", 2);
      // values.SelectedFreq = dayOption;
      setFieldValue("SelectedFreq", dayOption);
      // values.Optn1 = dropDown1;
      setFieldValue("Optn1", dropDown1);
      // values.Optn2 = dropDown2;
      setFieldValue("Optn2", dropDown2);
      // values.StartHour = startHour;
      setFieldValue("StartHour", startHour);
      // values.StartMinute = startMinute;
      setFieldValue("StartMinute", startMinute);

      if (dayOption === 0) {
      } else if (dayOption === 1) {
        if (values.Optn1 === null || values.Optn2 === null) {
          alert("Please select an option from the dropdown");
          setSliderOpen(true);
          setFreqSelected(false);
        } else {
          if (
            isEmpty(get(values, "StartHour")) ||
            isEmpty(get(values, "StartMinute"))
          ) {
            alert("Please select start time");
            setSliderOpen(true);
            setFreqSelected(false);
          }
        }
      } else if (dayOption === 2) {
        if (values.Optn1 === null || values.Optn2 === null) {
          alert("Please select an option from the dropdown");
          setSliderOpen(true);
          setFreqSelected(false);
        } else {
          if (values.StartHour === null || values.StartMinute === null) {
            alert("Please select start time");
            setSliderOpen(true);
            setFreqSelected(false);
          }
        }
      } else if (dayOption === 3) {
        if (values.Optn1 === null) {
          alert("Please select options from the check-list");
          setSliderOpen(true);
          setFreqSelected(false);
        } else {
          if (values.StartHour === null || values.StartMinute === null) {
            alert("Please select start time");
            setSliderOpen(true);
            setFreqSelected(false);
          }
        }
      } else if (dayOption === 4) {
        if (values.Optn1 === null) {
          alert("Please select options from the check-list");
          setSliderOpen(true);
          setFreqSelected(false);
        } else {
          if (values.StartHour === null || values.StartMinute === null) {
            alert("Please select start time");
            setSliderOpen(true);
            setFreqSelected(false);
          }
        }
      } else if (dayOption === 5) {
        if (values.Optn1 === null) {
          alert("Please select an option from the dropdown");
          setSliderOpen(true);
          setFreqSelected(false);
        } else {
          if (values.StartHour === null || values.StartMinute === null) {
            alert("Please select start time");
            setSliderOpen(true);
            setFreqSelected(false);
          }
        }
      } else if (dayOption === 6) {
        if (values.Optn1 === null || values.Optn2 === null) {
          alert("Please select an option from the dropdown");
          setSliderOpen(true);
          setFreqSelected(false);
        } else {
          if (values.StartHour === null || values.StartMinute === null) {
            alert("Please select start time");
            setSliderOpen(true);
            setFreqSelected(false);
          }
        }
      }
    }
  };

  const [minuteOption, setMinuteOption] = useState(values.SelectedFreq);
  const [hourOption, setHourOption] = useState(values.SelectedFreq);
  const [dayOption, setDayOption] = useState(values.SelectedFreq);

  return (
    <SliderPanel
      isOpen={isSliderOpen}
      size="60"
      showCancel={false}
      backdropClicked={() => {
        setSliderOpen(false);
        setMinuteOption("");
        setHourOption("");
        setDayOption("");
      }}
      className="freqSlider"
    >
      <div style={{ overflow: "scroll" }}>
        <div className="sliderHeader">
          <div
            style={{
              fontSize: "18px",
              display: "flex",
              alignItems: "center",
            }}
          >
            {" "}
            Select Frequency
          </div>
          <div>
            <Button variant="secondary" onClick={() => onCancel()}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={saveFunc}
              className="ml-4"
              type="submit"
            >
              Save
            </Button>
          </div>
        </div>

        <div id="btnGrp" style={{ marginTop: "20px" }}>
          <Field
            isRequired
            name="SelectedTime"
            size="md"
            className="bg-transparent p-0"
            style={{ font: "Poppins" }}
            options={timeOptions}
            selectedValue={timeSelector}
            onChange={(value) => {
              settimeSelector(value);
              setMinuteOption("");
              setHourOption("");
              setDayOption("");
              // values.SelectedTime = value;
              // setFieldValue("SelectedTime", value);
            }}
            component={FieldButtonGroup}
          />
        </div>
        {/* ---------------------------------------------------------------------------------------------------- */}

        <div style={{ marginTop: "42px" }}>
          {timeSelector === 0 && (
            <div>
              <label className="btnLabel">
                <input
                  type="radio"
                  name="minuteOptions"
                  value={0}
                  className="radioBtn"
                  onChange={(e) => {
                    setMinuteOption(0);
                    setDropDown1(null);
                    setDropDown2(null);
                  }}
                  checked={minuteOption === 0}
                />
                <div className="labelText">Every minute</div>
              </label>

              <label className="btnLabel">
                <input
                  type="radio"
                  name="minuteOptions"
                  value={1}
                  className="radioBtn"
                  onChange={(e) => {
                    setMinuteOption(1);
                    setDropDown1(null);
                    setDropDown2(null);
                  }}
                  checked={minuteOption === 1}
                />
                <div className="labelText"> Every {"\u00A0"}</div>
                <MapperSchedDropDown
                  isselected={minuteOption === 1}
                  valuesOption={values.Optn1}
                  timeSelector={timeSelector}
                  timeOption={minuteOption}
                  selectedOptn={dropDown1}
                  setSelectedOptn={setDropDown1}
                  data={genList(1, 61)}
                ></MapperSchedDropDown>
                <div className="labelText">
                  {" "}
                  {"\u00A0"} minute(s) starting at minute {"\u00A0"}{" "}
                </div>
                <MapperSchedDropDown
                  isselected={minuteOption === 1}
                  valuesOption={values.Optn2}
                  timeSelector={timeSelector}
                  timeOption={minuteOption}
                  selectedOptn={dropDown2}
                  setSelectedOptn={setDropDown2}
                  data={dblList(0, 60)}
                ></MapperSchedDropDown>
              </label>

              <label className="btnLabel">
                <input
                  type="radio"
                  name="minuteOptions"
                  value={2}
                  className="radioBtn"
                  onChange={(e) => {
                    setMinuteOption(2);
                    setDropDown1(null);
                    setDropDown2(null);
                  }}
                  checked={minuteOption === 2}
                />
                <div className="labelText">
                  {" "}
                  Specific minute (choose one or many) {"\u00A0"}
                </div>
                <SchedulerCheckList
                  data={dblList(0, 60)}
                  timeOption={minuteOption}
                  selectedOptn={dropDown1}
                  setSelectedOptn={setDropDown1}
                  isselected={minuteOption === 2}
                  valuesOption={values.Optn1}
                ></SchedulerCheckList>
              </label>

              <label className="btnLabel">
                <input
                  type="radio"
                  name="minuteOptions"
                  value={3}
                  className="radioBtn"
                  onChange={(e) => {
                    setMinuteOption(3);
                    setDropDown1(null);
                    setDropDown2(null);
                  }}
                  checked={minuteOption === 3}
                />
                <div className="labelText">
                  {" "}
                  Every minute between minute {"\u00A0"}
                </div>
                <MapperSchedDropDown
                  isselected={minuteOption === 3}
                  valuesOption={values.Optn1}
                  timeOption={minuteOption}
                  selectedOptn={dropDown1}
                  setSelectedOptn={setDropDown1}
                  data={dblList(0, 60)}
                ></MapperSchedDropDown>
                <div className="labelText">
                  {" "}
                  {"\u00A0"} and minute {"\u00A0"}{" "}
                </div>
                <MapperSchedDropDown
                  isselected={minuteOption === 3}
                  valuesOption={values.Optn2}
                  timeOption={minuteOption}
                  selectedOptn={dropDown2}
                  setSelectedOptn={setDropDown2}
                  data={dblList(0, 60)}
                ></MapperSchedDropDown>
              </label>
            </div>
          )}

          {timeSelector === 1 && (
            <div>
              <label className="btnLabel">
                <input
                  type="radio"
                  name="hourOptions"
                  value={0}
                  className="radioBtn"
                  onChange={(e) => {
                    setHourOption(0);
                    setDropDown1(null);
                    setDropDown2(null);
                  }}
                  checked={hourOption === 0}
                />
                <div className="labelText">Every hour</div>
              </label>

              <label className="btnLabel">
                <input
                  type="radio"
                  name="hourOptions"
                  value={1}
                  className="radioBtn"
                  onChange={(e) => {
                    setHourOption(1);
                    setDropDown1(null);
                    setDropDown2(null);
                  }}
                  checked={hourOption === 1}
                />
                <div className="labelText"> Every {"\u00A0"}</div>
                <MapperSchedDropDown
                  isselected={hourOption === 1}
                  valuesOption={values.Optn1}
                  timeOption={hourOption}
                  selectedOptn={dropDown1}
                  setSelectedOptn={setDropDown1}
                  data={genList(1, 25)}
                ></MapperSchedDropDown>
                <div className="labelText">
                  {" "}
                  {"\u00A0"} hour(s) starting at hour {"\u00A0"}{" "}
                </div>
                <MapperSchedDropDown
                  isselected={hourOption === 1}
                  valuesOption={values.Optn2}
                  timeOption={hourOption}
                  selectedOptn={dropDown2}
                  setSelectedOptn={setDropDown2}
                  data={dblList(0, 24)}
                ></MapperSchedDropDown>
              </label>

              <label className="btnLabel">
                <input
                  type="radio"
                  name="hourOptions"
                  value={2}
                  className="radioBtn"
                  onChange={(e) => {
                    setHourOption(2);
                    setDropDown1(null);
                    setDropDown2(null);
                  }}
                  checked={hourOption === 2}
                />
                <div className="labelText">
                  {" "}
                  Specific hour (choose one or many) {"\u00A0"}
                </div>
                <SchedulerCheckList
                  data={dblList(0, 24)}
                  timeOption={hourOption}
                  selectedOptn={dropDown1}
                  setSelectedOptn={setDropDown1}
                  isselected={hourOption === 2}
                  valuesOption={values.Optn1}
                ></SchedulerCheckList>
              </label>

              <label className="btnLabel">
                <input
                  type="radio"
                  name="hourOptions"
                  value={3}
                  className="radioBtn"
                  onChange={(e) => {
                    setHourOption(3);
                    setDropDown1(null);
                    setDropDown2(null);
                  }}
                  checked={hourOption === 3}
                />
                <div className="labelText">
                  {" "}
                  Every hour between hour {"\u00A0"}
                </div>
                <MapperSchedDropDown
                  isselected={hourOption === 3}
                  valuesOption={values.Optn1}
                  timeOption={hourOption}
                  selectedOptn={dropDown1}
                  setSelectedOptn={setDropDown1}
                  data={dblList(0, 24)}
                ></MapperSchedDropDown>
                <div className="labelText">
                  {" "}
                  {"\u00A0"} and hour {"\u00A0"}{" "}
                </div>
                <MapperSchedDropDown
                  isselected={hourOption === 3}
                  valuesOption={values.Optn2}
                  timeOption={hourOption}
                  selectedOptn={dropDown2}
                  setSelectedOptn={setDropDown2}
                  data={dblList(0, 24)}
                ></MapperSchedDropDown>
              </label>

              <label className="btnLabel">
                <input
                  type="radio"
                  name="hourOptions"
                  value={4}
                  className="radioBtn"
                  onChange={(e) => {
                    setHourOption(4);
                    setDropDown1(null);
                    setDropDown2(null);
                  }}
                  checked={hourOption === 4}
                />
                <div className="labelText"> Starts at hour{"\u00A0"}</div>
                <MapperSchedDropDown
                  isselected={hourOption === 4}
                  valuesOption={values.Optn1}
                  timeOption={hourOption}
                  selectedOptn={dropDown1}
                  setSelectedOptn={setDropDown1}
                  data={dblList(0, 24)}
                ></MapperSchedDropDown>
                <div className="labelText">
                  {" "}
                  {"\u00A0"} and minute {"\u00A0"}{" "}
                </div>
                <MapperSchedDropDown
                  isselected={hourOption === 4}
                  valuesOption={values.Optn2}
                  timeOption={hourOption}
                  selectedOptn={dropDown2}
                  setSelectedOptn={setDropDown2}
                  data={dblList(0, 60)}
                ></MapperSchedDropDown>
              </label>
            </div>
          )}

          {timeSelector === 2 && (
            <div>
              <label className="btnLabel">
                <input
                  type="radio"
                  name="dayOptions"
                  value={0}
                  className="radioBtn"
                  onChange={(e) => {
                    setDayOption(0);
                    setDropDown1(null);
                    setDropDown2(null);
                  }}
                  checked={dayOption === 0}
                />
                <div className="labelText">Every day</div>
              </label>

              <div style={{ position: "relative" }}>
                <label className="btnLabel">
                  <input
                    type="radio"
                    name="dayOptions"
                    value={1}
                    onChange={(e) => {
                      setDayOption(1);
                      setDropDown1(null);
                      setDropDown2(null);
                    }}
                    checked={dayOption === 1}
                    className="radioBtn"
                  />

                  <div className="labelText"> Every {"\u00A0"}</div>
                  <MapperSchedDropDown
                    isselected={dayOption === 1}
                    valuesOption={values.Optn1}
                    timeOption={dayOption}
                    selectedOptn={dropDown1}
                    setSelectedOptn={setDropDown1}
                    data={genList(1, 8)}
                  ></MapperSchedDropDown>
                  <div className="labelText">
                    {" "}
                    {"\u00A0"} days(s) starting on {"\u00A0"}{" "}
                  </div>
                  <MapperSchedDropDown
                    isselected={dayOption === 1}
                    valuesOption={values.Optn2}
                    timeOption={dayOption}
                    selectedOptn={dropDown2}
                    setSelectedOptn={setDropDown2}
                    data={daysList}
                  ></MapperSchedDropDown>
                </label>
              </div>
              <div style={{ position: "relative" }}>
                <label className="btnLabel">
                  <input
                    type="radio"
                    name="dayOptions"
                    value={2}
                    onChange={(e) => {
                      setDayOption(2);
                      setDropDown1(null);
                      setDropDown2(null);
                    }}
                    checked={dayOption === 2}
                    className="radioBtn"
                  />
                  <div className="labelText"> Every {"\u00A0"}</div>
                  <MapperSchedDropDown
                    isselected={dayOption === 2}
                    valuesOption={values.Optn1}
                    timeOption={dayOption}
                    selectedOptn={dropDown1}
                    setSelectedOptn={setDropDown1}
                    data={genList(1, 32)}
                  ></MapperSchedDropDown>
                  <div className="labelText">
                    {" "}
                    {"\u00A0"} days(s) starting on the {"\u00A0"}{" "}
                  </div>
                  <MapperSchedDropDown
                    isselected={dayOption === 2}
                    valuesOption={values.Optn2}
                    timeOption={dayOption}
                    selectedOptn={dropDown2}
                    setSelectedOptn={setDropDown2}
                    data={datesList(1, 32)}
                  ></MapperSchedDropDown>
                </label>
              </div>
              <div style={{ position: "relative" }}>
                <label className="btnLabel">
                  <input
                    type="radio"
                    name="dayOptions"
                    value={3}
                    onChange={(e) => {
                      setDayOption(3);
                      setDropDown1(null);
                      setDropDown2(null);
                    }}
                    checked={dayOption === 3}
                    className="radioBtn"
                  />
                  <div className="labelText">
                    {" "}
                    Specific day of the week (choose one or many) {"\u00A0"}
                  </div>
                  <SchedulerCheckList
                    data={daysList}
                    timeOption={dayOption}
                    selectedOptn={dropDown1}
                    setSelectedOptn={setDropDown1}
                    isselected={dayOption === 3}
                    valuesOption={values.Optn1}
                  ></SchedulerCheckList>
                </label>
              </div>
              <div style={{ position: "relative" }}>
                <label className="btnLabel">
                  <input
                    type="radio"
                    name="dayOptions"
                    value={4}
                    onChange={(e) => {
                      setDayOption(4);
                      setDropDown1(null);
                      setDropDown2(null);
                    }}
                    checked={dayOption === 4}
                    className="radioBtn"
                  />
                  <div className="labelText">
                    {" "}
                    Specific day of the month (choose one or many) {"\u00A0"}
                  </div>
                  <SchedulerCheckList
                    data={datesList(1, 32)}
                    timeOption={dayOption}
                    selectedOptn={dropDown1}
                    setSelectedOptn={setDropDown1}
                    isselected={dayOption === 4}
                    valuesOption={values.Optn1}
                  ></SchedulerCheckList>
                </label>
              </div>

              <div style={{ position: "relative" }}>
                <label className="btnLabel">
                  <input
                    type="radio"
                    name="dayOptions"
                    value={5}
                    onChange={(e) => {
                      setDayOption(5);
                      setDropDown1(null);
                      setDropDown2(null);
                    }}
                    checked={dayOption === 5}
                    className="radioBtn"
                  />
                  <div className="labelText">
                    {" "}
                    Nearest weekday (Monday to Friday) to the {"\u00A0"}
                  </div>
                  <MapperSchedDropDown
                    isselected={dayOption === 5}
                    valuesOption={values.Optn1}
                    timeOption={dayOption}
                    selectedOptn={dropDown1}
                    setSelectedOptn={setDropDown1}
                    data={datesList(1, 32)}
                  ></MapperSchedDropDown>
                </label>
              </div>
              <div style={{ position: "relative" }}>
                <label className="btnLabel">
                  <input
                    type="radio"
                    name="dayOptions"
                    value={6}
                    onChange={(e) => {
                      setDayOption(6);
                      setDropDown1(null);
                      setDropDown2(null);
                    }}
                    checked={dayOption === 6}
                    className="radioBtn"
                  />
                  <div className="labelText"> On the {"\u00A0"}</div>
                  <MapperSchedDropDown
                    isselected={dayOption === 6}
                    valuesOption={values.Optn1}
                    timeOption={dayOption}
                    selectedOptn={dropDown1}
                    data={datesList(1, 32)}
                    setSelectedOptn={setDropDown1}
                  ></MapperSchedDropDown>
                  {"\u00A0"}
                  {"\u00A0"}
                  <MapperSchedDropDown
                    isselected={dayOption === 6}
                    valuesOption={values.Optn2}
                    data={daysList}
                    timeOption={dayOption}
                    selectedOptn={dropDown2}
                    setSelectedOptn={setDropDown2}
                  ></MapperSchedDropDown>
                  {"\u00A0"}
                  <div className="labelText"> of the month</div>
                </label>
              </div>
              <div style={{ height: "200px" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    position: "relative",
                  }}
                >
                  <div> Start at hour {"\u00A0"}</div>
                  <MapperSchedDropDown
                    setSelectedOptn={setStartHour}
                    isselected={true}
                    timeOption={dayOption}
                    selectedOptn={startHour}
                    valuesOption={values.StartHour}
                    data={dblList(0, 24)}
                  ></MapperSchedDropDown>
                  {"\u00A0"} and at minute
                  {"\u00A0"}
                  <MapperSchedDropDown
                    setSelectedOptn={setStartMinute}
                    isselected={true}
                    timeOption={dayOption}
                    selectedOptn={startMinute}
                    valuesOption={values.StartMinute}
                    data={dblList(0, 60)}
                  ></MapperSchedDropDown>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </SliderPanel>
  );
};

export default SchedulerSlider;
