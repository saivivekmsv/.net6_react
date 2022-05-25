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
  FieldInputDollar,
} from "../../../components";
import { Field } from "formik";
import { Form, InputGroup } from "react-bootstrap";
import { Formik } from "formik";
import { usDateFormat } from "../../../utils";
import { Button } from "react-bootstrap";
import { faTimes } from "@fortawesome/pro-light-svg-icons";

const initialValues = {
  //companyName: "",
};

export const ColumnMenu = (props) => {
  const { fields, field1, field2, gridFilters, setGridFilters } = props;
  const formValues = gridFilters;
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
    props.onCloseMenu(true);
  };

  const clearFilters = (value) => {
    if (fieldValue2) {
      setGridFilters({
        ...gridFilters,
        [fieldValue1]: null,
        [fieldValue2]: null,
        orderBy: null,
        columnName: null,
      });
    } else {
      setGridFilters({
        ...gridFilters,
        [fieldValue1]: null,
        orderBy: null,
        columnName: null,
      });
    }
    props.onCloseMenu(true);
  };

  const handleSorting = (data) => {
    setGridFilters({
      ...gridFilters,
      orderBy: data,
      columnName: props.column.field,
    });
    props.onCloseMenu(true);
  };

  const clearSorting = (value) => {
    setGridFilters({
      ...gridFilters,
      orderBy: null,
      columnName: null,
    });
    props.onCloseMenu(true);
  };

  return (
    <div style={{ height: "fitContent" }}>
      {/* <GridColumnMenuSort {...props} /> */}

      {/* <GridColumnMenuFilter
        {...props}
        filterUIProps={filterProps}
        setFilterUIProps={setFilterProps}
        expanded={true}
      /> */}
      <div className="disp-flex-col" style={{ marginBottom: "10px" }}>
        <Button
          style={{
            display: "flex",
            background: "none",
            color: "black",
            border: "none",
          }}
          onClick={() => handleSorting("asec")}
        >
          <i class="fas fa-sort-amount-up"></i>
          Sort Ascending
        </Button>
        <Button
          style={{
            display: "flex",
            background: "none",
            color: "black",
            border: "none",
          }}
          onClick={() => handleSorting("desc")}
        >
          <i class="fas fa-sort-amount-down"></i>
          Sort Descending
        </Button>
        <Button
          style={{
            display: "flex",
            background: "none",
            color: "black",
            border: "none",
          }}
          onClick={() => clearSorting()}
        >
          <i class="fa fa-times" aria-hidden="true"></i>
          Clear Sorting
        </Button>
      </div>

      <Formik
        initialValues={{
          ...initialValues,
          ...formValues,
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
                      direction="leftSide"
                      isDatePicker
                      onClear={() => setFieldValue(fieldValue1, "")}
                      popupContent={
                        <DatePicker
                          onDayClick={(value) =>
                            //   setGridFilters({
                            //     [fieldValue1]: usDateFormat(value),
                            //   })
                            setFieldValue(fieldValue1, value)
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
                      direction="leftSide"
                      isDatePicker
                      onClear={() => setFieldValue(fieldValue2, "")}
                      popupContent={
                        <DatePicker
                          onDayClick={(value) =>
                            // setGridFilters({
                            //   [fieldValue2]: usDateFormat(value),
                            // })
                            setFieldValue(fieldValue2, value)
                          }
                          value={values[fieldValue2]}
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
                  <Field
                    size="sm"
                    label="&nbsp;"
                    placeholder="Search"
                    label="Search"
                    isRequired
                    name={fieldValue1}
                    type="text"
                    autoComplete="off"
                    value={values[fieldValue1]}
                    onChange={handleChange}
                    component={FieldInput}
                  />
                </div>
              ) : props.column.filter === "numeric" ? (
                <div className="flex-row">
                  <div className="d-flex ml-3">
                    <Form>
                      <Field
                        size="sm"
                        label="From"
                        style={{ width: "90px" }}
                        placeholder="0"
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
                        placeholder="0"
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
                        component={FieldInputDollar}
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
                        component={FieldInputDollar}
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
