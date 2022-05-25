import React, { useState } from "react";
import { Formik, Field } from "formik";
import { Form, Button } from "react-bootstrap";
import {
  DatePicker,
  SearchableList,
  FieldDropSide,
  FieldInput,
} from "../../components";
import { usDateFormat } from "../../utils";
import FilterButtons from "./FilterButtons";

function FilterCard({ FileCount, values, setFieldValue }) {
  const ActiveInactiveData = [
    {
      label: "Active",
      value: 0,
    },
    {
      label: "In Active",
      value: 1,
    },
  ];
  const mapTypeData = [
    {
      label: "Input",
      value: 0,
    },
    {
      label: "Output",
      value: 1,
    },
    {
      label: "Pass through",
      value: 2,
    },
  ];

  return (
    <div className="mb-3">
      <div className="d-flex">
        <div className="mr-5">
          <Field
            size="smdd"
            label="Plan name"
            isRequired
            noLabelTransform
            name={"Plan name"}
            value={"All"}
            direction="bottom"
            popupContent={
              <SearchableList
                label="Select Plan name"
                options={ActiveInactiveData}
                onSelect={(value) => {}}
                selectedValue={0}
              />
            }
            component={FieldDropSide}
          />
        </div>

        <div className="mr-5">
          <Field
            size="smdd"
            label="Profile name"
            isRequired
            noLabelTransform
            name={"Profile name"}
            value={"All"}
            direction="bottom"
            popupContent={
              <SearchableList
                label="Select Profile name"
                options={ActiveInactiveData}
                onSelect={(value) => {}}
                selectedValue={0}
              />
            }
            component={FieldDropSide}
          />
        </div>
        <div className="mr-5">
          <Field
            size="smdd"
            label="Map Type"
            isRequired
            noLabelTransform
            name={"Profile name"}
            value={"All"}
            direction="bottom"
            popupContent={
              <SearchableList
                label="Select Profile name"
                options={mapTypeData}
                onSelect={(value) => {}}
                selectedValue={0}
              />
            }
            component={FieldDropSide}
          />
        </div>

        <div className="d-flex  br-0">
          <Field
            size="sm"
            isRequired
            label="Date range"
            name="From date"
            value={usDateFormat(values.fromDate)}
            isDatePicker
            placeholder="From date"
            direction="bottom"
            onClear={() => {}}
            popupContent={
              <DatePicker
                onDayClick={(value) => {
                  setFieldValue("fromDate", value);
                }}
                value={values.fromDate}
              />
            }
            component={FieldDropSide}
          />
        </div>
        <div className="d-flex bl-0 mr-5">
          <Field
            size="sm"
            label=""
            name="To date"
            isRequired
            placeholder="To date"
            value={usDateFormat(values.toDate)}
            direction="bottom"
            isDatePicker
            onClear={() => {
              setFieldValue("toDate", null);
              setFieldValue("fromDate", null);
            }}
            // onDefaultClearDisplay={values[fields.fromDate]}
            popupContent={
              <DatePicker
                onDayClick={(value) => {
                  setFieldValue("toDate", value);
                }}
                value={values.toDate}
              />
            }
            component={FieldDropSide}
          />
        </div>

        <Field
          size="smd"
          placeholder="Search"
          name={"search"}
          label={""}
          type="text"
          autoComplete="off"
          value={values.searchTerm}
          onChange={(e) => {
            setFieldValue("searchTerm", e.target.value);
          }}
          component={FieldInput}
        />
        <Button
          className="ml-5 sort-button"
          style={{ lineHeight: "19px", marginTop: "30px" }}
          variant="secondary"
          type="submit"
        >
          Search
        </Button>
      </div>
      <div className="d-flex">
        <FilterButtons
          filterValue={values.filterValue}
          setFieldValue={setFieldValue}
        />
        <div className="ml-auto mt-2">{FileCount} Files</div>
      </div>
    </div>
  );
}

export default FilterCard;
