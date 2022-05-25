import * as React from "react";
import {
  GridColumnMenuFilter,
  GridColumnMenuCheckboxFilter,
  GridColumnMenuSort,
} from "@progress/kendo-react-grid";
import products from "../../../mocks/contributionLimit.json";
import { useDeepEffect } from "../../../abstracts";
import { Link } from "react-router-dom";
import { get402gReportInfo } from "../../../services";
import { useState } from "react";
import {
  DatePicker,
  FieldDropSide,
  FormControlSearch,
  FieldInput,
} from "../../../components";
import { Field } from "formik";
import { Form, InputGroup } from "react-bootstrap";
import { Formik } from "formik";
import { usDateFormat } from "../../../utils";

const initialValues = {
  //companyName: "",
};

export const ColumnMenu = (props) => {
  const { fields, field1, field2, gridFilters, setGridFilters } = props;

  const fieldValue1 = fields[field1];
  const fieldValue2 = field2 ? fields[field2] : null;

  const applyFiltersClick = (value) => {
    if (fieldValue2) {
      setGridFilters({
        ...gridFilters,
        [fieldValue1]: value[fieldValue1],
        [fieldValue2]: value[fieldValue2],
      });
    } else {
      setGridFilters({ ...gridFilters, [fieldValue1]: value[fieldValue1] });
    }
  };

  const clearFilters = (value) => {
    if (fieldValue2) {
      setGridFilters({
        ...gridFilters,
        [fieldValue1]: null,
        [fieldValue2]: null,
      });
    } else {
      setGridFilters({ ...gridFilters, [fieldValue1]: null });
    }
  };

  return (
    <div style={{ height: "fitContent" }}>
      <GridColumnMenuSort {...props} />

      {/* <GridColumnMenuFilter
        {...props}
        filterUIProps={filterProps}
        setFilterUIProps={setFilterProps}
        expanded={true}
      /> */}

      <Formik
        initialValues={{
          ...initialValues,
        }}
        onSubmit={applyFiltersClick}
        enableReinitialize
      >
        {({
          handleChange,
          setFieldValue,
          handleSubmit,
          setValues,
          values,
          ...rest
        }) => {
          console.log({ values });
          return (
            <>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  paddingLeft: "30px",
                  paddingRight: "30px",
                }}
              >
                <Link onClick={() => applyFiltersClick(values)}>Apply</Link>
                <Link onClick={() => clearFilters(values)}>Clear</Link>
              </div>

              {props.column.filter === "date" ? (
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <div className="d-flex ml-3" style={{ marginBottom: "10px" }}>
                    <Field
                      size="sm"
                      label="From date "
                      isRequired
                      name={fieldValue1}
                      value={usDateFormat(values[fieldValue1])}
                      direction="bottom"
                      isDatePicker
                      onClear={() => setFieldValue(fieldValue1, "")}
                      popupContent={
                        <DatePicker
                          onDayClick={(value) =>
                            setGridFilters({
                              [fieldValue1]: usDateFormat(value),
                            })
                          }
                          value={values[fieldValue1]}
                        />
                      }
                      component={FieldDropSide}
                    />
                  </div>
                  <div className="d-flex ml-3">
                    <Field
                      size="sm"
                      label="To date"
                      isRequired
                      name={fieldValue2}
                      value={usDateFormat(values[fieldValue2])}
                      direction="bottom"
                      isDatePicker
                      onClear={() => setFieldValue(fieldValue2, "")}
                      popupContent={
                        <DatePicker
                        // onDayClick={(value) =>
                        //     onDaySelected(fields.payDateTo, value)
                        // }
                        // value={values[fields.payDateTo]}
                        />
                      }
                      component={FieldDropSide}
                    />
                  </div>
                </div>
              ) : props.column.filter === "alphaNumeric" ? (
                <div
                  className="disp-flex-col"
                  style={{ padding: "10px 30px 50px 30px " }}
                >
                  <Form>
                    <div className="flex-search">
                      <InputGroup>
                        <InputGroup.Prepend>
                          <div className="search-icon-postion">
                            <i class="fal fa-search" aria-hidden="true"></i>
                          </div>
                        </InputGroup.Prepend>

                        <FormControlSearch
                          size="sm"
                          type="search"
                          placeholder="Search"
                          className="pad-left-search"
                          //onChange={(e) => setSearchString(e.target.value)}
                          //onChange={(e) => setSearchValue(e.target.value)}
                        />
                      </InputGroup>
                    </div>
                  </Form>
                </div>
              ) : props.column.filter === "numeric" ? (
                <div className="flex-row">
                  <div className="d-flex ml-3">
                    <Form>
                      <Field
                        size="sm"
                        label="&nbsp;"
                        style={{ width: "90px" }}
                        placeholder="00"
                        label="from"
                        isRequired
                        name={fieldValue1}
                        type="text"
                        autoComplete="off"
                        value={values[fieldValue1]}
                        onChange={handleChange}
                        component={FieldInput}
                      />
                    </Form>
                  </div>
                  <div className="d-flex ml-3 mr-2">
                    <Form>
                      <Field
                        size="sm"
                        style={{ width: "90px" }}
                        label="&nbsp;"
                        placeholder="00"
                        label="To"
                        isRequired
                        name={fieldValue2}
                        type="text"
                        autoComplete="off"
                        value={values[fieldValue2]}
                        onChange={handleChange}
                        component={FieldInput}
                      />
                    </Form>
                  </div>
                </div>
              ) : props.column.filter === "amount" ? (
                <div className="disp-flex-col">
                  <div className="d-flex ml-3" style={{ marginBottom: "10px" }}>
                    <Form>
                      <Field
                        size="xs"
                        label="&nbsp;"
                        placeholder="$ 00.00"
                        label="Amount From"
                        style={{ width: "150px" }}
                        isRequired
                        name={fieldValue1}
                        type="text"
                        autoComplete="off"
                        value={values[fieldValue1]}
                        onChange={handleChange}
                        component={FieldInput}
                      />
                    </Form>
                  </div>
                  <div className="d-flex ml-3 mr-2">
                    <Form>
                      <Field
                        size="xs"
                        label="&nbsp;"
                        placeholder="$ 00.00"
                        label="Amount to"
                        style={{ width: "150px" }}
                        isRequired
                        name={fieldValue2}
                        type="text"
                        autoComplete="off"
                        value={values[fieldValue2]}
                        onChange={handleChange}
                        component={FieldInput}
                      />
                    </Form>
                  </div>
                </div>
              ) : null}
            </>
          );
        }}
      </Formik>
    </div>
  );
};
export const ColumnMenuCheckboxFilter = (props) => {
  return (
    <div>
      <GridColumnMenuSort {...props} />
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          padding: "0px 10px 0px 10px",
        }}
      >
        <Link>Apply</Link>
        <Link>clear</Link>
      </div>
      <GridColumnMenuCheckboxFilter
        {...props}
        data={products}
        expanded={true}
      />
    </div>
  );
};
