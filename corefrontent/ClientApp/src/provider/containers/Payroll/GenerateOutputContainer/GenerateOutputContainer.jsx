import { Button, Card } from "react-bootstrap";
import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/pro-light-svg-icons";
import {
  Select,
  DatePicker,
  FieldDropSide,
  FieldInput,
  SearchableList,
} from "../../../components";
import { usDateFormat } from "../../../utils";
import { Form, Formik, Field } from "formik";
import { FileList, planNames } from "./SampleData";

const initialValues = {
  SearchDate: 0,
  PlanNameDropdown: "",
  PlanNameSearch: "",
  MapNameDropdown: "",
  FilterSelect: "",
};

const GenerateOutputContainer = (props) => {
  const [SumList, setSumList] = useState(0);
  const [SelectedList, setSelectedList] = useState([]);
  let selectedItems = [];

  const FilterOptions = ["All", "New", "Generated"];
  const [alteredFileList, setAlteredFileList] = useState(
    FileList.map((item) => {
      return {
        ...item,
        selected: false,
      };
    })
  );

  useEffect(() => {
    let Gtotal = 0;
    alteredFileList
      .filter((item) => {
        if (item.selected) {
          return item;
        }
      })
      .map((item) => {
        Gtotal = Gtotal + item.FileTotal;
      });
    setSumList(Gtotal);
  }, [alteredFileList]);

  return (
    <Formik
      initialValues={initialValues}
      enableReinitialize
      validateOnChange={false}
    >
      {({ handleChange, setFieldValue, handleSubmit, values, ...rest }) => {
        const onDaySelected = (fieldName, value) => {
          setFieldValue(fieldName, value);
        };
        return (
          <Form autoComplete="off" onSubmit={handleSubmit}>
            <div className="PayrollGenerateOutputContainer">
              <div className="PayrollHeaderandButton">
                <div className="PayrollPageHeaderFont">Generate Output</div>
              </div>
              <div className="PayrollFilterContainer">
                <div className="PayrollDropDown">
                  <Field
                    name="PlanNameSearch"
                    size="smdd"
                    label="Search"
                    noLabelTransform
                    component={FieldInput}
                    onChange={handleChange}
                    isRequired
                  />
                </div>
                <div className="PayrollDropDown">
                  <Field
                    size="smdd"
                    label="Plan Name"
                    isRequired
                    noLabelTransform
                    name={"PlanNameDropdown"}
                    value={values.PlanNameDropdown}
                    options={planNames}
                    direction="bottom"
                    popupContent={
                      <SearchableList
                        label="Select Plan name"
                        options={planNames}
                        isNotTypeAhead
                        onSelect={(value) => {
                          setFieldValue("PlanNameDropdown", value);
                        }}
                        selectedValue={values["PlanNameDropdown"]}
                      />
                    }
                    component={FieldDropSide}
                  />
                </div>
                <div className="PayrollDropDown">
                  <Field
                    size="smdd"
                    label="Map Name"
                    isRequired
                    noLabelTransform
                    name={"MapNameDropdown"}
                    value={values.MapNameDropdown}
                    options={planNames}
                    direction="bottom"
                    popupContent={
                      <SearchableList
                        label="Select Map name"
                        options={planNames}
                        isNotTypeAhead
                        onSelect={(value) => {
                          setFieldValue("MapNameDropdown", value);
                        }}
                        selectedValue={values["MapNameDropdown"]}
                      />
                    }
                    component={FieldDropSide}
                  />
                </div>
                <div style={{ paddingRight: "2rem" }}>
                  <div>
                    <Field
                      size="sm"
                      isRequired
                      label="Date"
                      name="SearchDate"
                      value={usDateFormat(values.SearchDate)}
                      isDatePicker
                      placeholder="Date"
                      direction="bottom"
                      onClear={() => setFieldValue("SearchDate", null)}
                      popupContent={
                        <DatePicker
                          onDayClick={(value) =>
                            setFieldValue("SearchDate", value)
                          }
                          value={values["SearchDate"]}
                        />
                      }
                      component={FieldDropSide}
                    />
                  </div>
                </div>
                <div style={{ paddingTop: "1.75rem" }}>
                  <Button
                    type="button"
                    variant="secondary"
                    size="lg"
                    //OnClick = Function to set The search parameters
                  >
                    Search
                  </Button>
                </div>
                <div>
                  <Button
                    type="button"
                    variant="primary"
                    size="lg"
                    style={{
                      position: "absolute",
                      right: "1rem",
                      top: "1.75rem",
                    }}
                    //OnClick = Function to generate the output with selected inputs
                  >
                    <div style={{ display: "flex" }}>
                      <div>Generate Files</div>
                    </div>
                  </Button>
                </div>
              </div>
              <div className="PayrollPlanDetailsContainer">
                <div className="PayrollPlanListingContainer">
                  <div className="PayrollFileDetails">
                    <div>
                      <form name="FilterDetails">
                        <div
                          style={{
                            paddingTop: "0.375rem",
                            paddingLeft: "0.5rem",
                          }}
                          className="optionsDiv"
                        >
                          <input
                            type="radio"
                            id={FilterOptions[0]}
                            className="optionBtn"
                            name={"radioButton"}
                            value={FilterOptions[0]}
                            checked={values.FilterSelect == FilterOptions[0]}
                            onChange={(e) =>
                              setFieldValue("FilterSelect", FilterOptions[0])
                            }
                          />
                          <label
                            className={"optionLabel"}
                            for={FilterOptions[0]}
                          >
                            {FilterOptions[0]}
                          </label>
                          <input
                            type="radio"
                            id={FilterOptions[1]}
                            className="optionBtn"
                            name={"radioButton"}
                            value={FilterOptions[1]}
                            checked={values.FilterSelect == FilterOptions[1]}
                            onChange={(e) =>
                              setFieldValue("FilterSelect", FilterOptions[1])
                            }
                          />
                          <label
                            className={"optionLabel"}
                            for={FilterOptions[1]}
                          >
                            {FilterOptions[1]}
                          </label>

                          <input
                            type="radio"
                            id={FilterOptions[2]}
                            className="optionBtn"
                            name={"radioButton"}
                            value={FilterOptions[2]}
                            checked={values.FilterSelect == FilterOptions[2]}
                            onChange={(e) =>
                              setFieldValue("FilterSelect", FilterOptions[2])
                            }
                          />
                          <label
                            className={"optionLabel"}
                            for={FilterOptions[2]}
                            style={{ marginRight: "5px" }}
                          >
                            {FilterOptions[2]}
                          </label>
                        </div>
                      </form>
                    </div>

                    <div className="PayrollOuptutFileDetails">
                      {alteredFileList.length} Files
                      {/* Variable to be substituted here */}
                    </div>
                    <div
                      style={{
                        position: "absolute",
                        right: "0.5rem",
                        alignSelf: "center",
                      }}
                    >
                      <Button type="button" variant="outline-danger" size="lg">
                        Delete
                      </Button>
                    </div>
                  </div>
                  <div className="PayrollCardContainer">
                    {alteredFileList.map((element, index) => {
                      return (
                        <Card className="PayrollCard">
                          <div
                            style={{
                              display: "flex",
                              position: "absolute",
                              left: "3%",
                              height: "100%",
                              width: "2%",
                              alignItems: "center",
                            }}
                          >
                            <input
                              type="checkbox"
                              className="largerCheckbox"
                              style={{
                                display: "flex",
                                alignSelf: "center",
                                width: "1.5rem",
                              }}
                              value=""
                              onChange={() => {
                                let newfields = [...alteredFileList];
                                newfields[index]["selected"] = !newfields[
                                  index
                                ]["selected"];
                                setAlteredFileList(newfields);
                                // selectedItems.push(element);
                              }}
                              checked={element.selected}
                            ></input>
                          </div>
                          <div
                            style={{ left: "10%" }}
                            className="FieldDataContainer"
                          >
                            <div style={{ display: "block" }}>
                              <div className="heading">File name</div>
                              <div className="content">{element.FileName}</div>
                            </div>
                          </div>
                          <div
                            style={{ left: "25%" }}
                            className="FieldDataContainer"
                          >
                            <div style={{ display: "block" }}>
                              <div className="heading">Pay date</div>
                              <div className="content">{element.PayDate}</div>
                            </div>
                          </div>
                          <div
                            style={{ left: "45%" }}
                            className="FieldDataContainer"
                          >
                            <div style={{ display: "block" }}>
                              <div className="heading">Map Name</div>
                              <div className="content">{element.MapName}</div>
                            </div>
                          </div>
                          <div
                            style={{ left: "65%" }}
                            className="FieldDataContainer"
                          >
                            <Button
                              type="button"
                              variant="outline-success"
                              disabled
                            >
                              {element.Category}
                            </Button>
                          </div>
                          <div
                            style={{ left: "85%" }}
                            className="FieldDataContainer"
                          >
                            <div style={{ display: "block" }}>
                              <div className="heading">File Total</div>
                              <div className="contentTotal">
                                $ {element.FileTotal}
                              </div>
                            </div>
                          </div>
                        </Card>
                      );
                    })}
                  </div>
                </div>
                <div className="PayrollSumContainer">
                  <div className="HeaderContainer">
                    <div className="Metrics">Metrics</div>
                    <div
                      style={{ alignSelf: "flex-end" }}
                      className="FileDetails"
                    >
                      {
                        alteredFileList.filter((item) => {
                          if (item.selected) {
                            return item;
                          }
                        }).length
                      }{" "}
                      Files
                    </div>
                  </div>
                  <div>
                    <Card className="GrandTotal">
                      <div style={{ paddingTop: "1rem", paddingLeft: "1rem" }}>
                        <div className="Title">File Total</div>
                        <div className="Sum">$ {SumList}</div>
                      </div>
                    </Card>
                  </div>
                </div>
              </div>
              <div>
                {/* <pre>{JSON.stringify(SumList, null, 2)}</pre>
								<pre>{JSON.stringify(alteredFileList, null, 2)}</pre> */}
              </div>
            </div>
          </Form>
        );
      }}
    </Formik>
  );
};

export default GenerateOutputContainer;
