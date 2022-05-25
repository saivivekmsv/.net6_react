/* eslint-disable eqeqeq */
import { Field } from "formik";
import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { isEmpty } from "lodash";
import {
  DatePicker,
  FieldDropSide,
  SearchableList,
  CsplTable as Table,
} from "../../../../shared/components";
import { usDateFormat } from "../../../../shared/utils";
import company from "../../../../shared/mocksompany.json";
import CensusEmployeeAgeMaster from "../../../../shared/mocksensusEmployeeAgeMaster.json";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faExclamationTriangle,
  faTimes,
} from "@fortawesome/pro-light-svg-icons";

const columns = [
  {
    label: "Hire / rehire date",
    className: "column-rehireDate",
    columnName: "rehireDate",
  },
  {
    label: "Term date",
    className: "column-termDate",
    columnName: "termDate",
  },
];

const EmploymentAgeDetail = (props) => {
  const [isAdd, setIsAdd] = useState(false);
  const toggle = () => {
    setIsAdd(!isAdd);
  };
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);

  const { fields, values, setFieldValue, isEdit, isSave } = props;

  const onDaySelected = (fieldName, value) => {
    setFieldValue(fieldName, value);
  };

  return (
    <div>
      <p className="mt-20 plan-sub-heading">Dates</p>
      <div className="d-flex">
        <Field
          label="Date of Birth"
          size="md"
          name={fields.birthDate}
          value={usDateFormat(values[fields.birthDate])}
          isDatePicker
          onClear={() => onDaySelected(fields.birthDate, "")}
          popupContent={
            <DatePicker
              onDayClick={(value) => onDaySelected(fields.birthDate, value)}
              value={values[fields.birthDate]}
            />
          }
          component={FieldDropSide}
          disabled={isEdit && !isSave}
        />
        {values.birthDate === "" ? (
          ""
        ) : (
          <div
            className="plan-sub-heading mt-20 ml-4"
            style={{ alignSelf: "flex-end" }}
          >
            {Math.abs(
              new Date(values.birthDate).getFullYear() -
                new Date().getFullYear()
            )}{" "}
            year{" "}
            {Math.abs(
              new Date(values.birthDate).getMonth() - new Date().getMonth()
            )}{" "}
            Months
          </div>
        )}
      </div>
      <Field
        label="Hire Date"
        size="md"
        name={fields.hireDate}
        value={usDateFormat(values[fields.hireDate])}
        isDatePicker
        onClear={() => onDaySelected(fields.hireDate, "")}
        popupContent={
          <DatePicker
            onDayClick={(value) => onDaySelected(fields.hireDate, value)}
            value={values[fields.hireDate]}
          />
        }
        component={FieldDropSide}
        disabled={isEdit && !isSave}
      />
      <Field
        size="md"
        isRequired
        name={fields.employmentStatus}
        value={values[fields.employmentStatus]}
        label="Employment Status"
        popupContent={
          <SearchableList
            label="Select Employment Status"
            options={company.data.map((value) => ({
              label: value,
              value,
            }))}
            onSelect={(value) => setFieldValue(fields.employmentStatus, value)}
            selectedValue={values[fields.employmentStatus]}
          />
        }
        component={FieldDropSide}
        disabled={isEdit && !isSave}
      />
      <Field
        label="Most Recent Term Date"
        size="md"
        name={fields.mostRecentTermDate}
        value={usDateFormat(values[fields.mostRecentTermDate])}
        isDatePicker
        onClear={() => onDaySelected(fields.mostRecentTermDate, "")}
        popupContent={
          <DatePicker
            onDayClick={(value) =>
              onDaySelected(fields.mostRecentTermDate, value)
            }
            value={values[fields.mostRecentTermDate]}
          />
        }
        component={FieldDropSide}
        disabled={isEdit && !isSave}
      />
      <Field
        label="Most Recent Rehire Date"
        size="md"
        name={fields.mostRecentRehireDate}
        value={usDateFormat(values[fields.mostRecentRehireDate])}
        isDatePicker
        onClear={() => onDaySelected(fields.mostRecentRehireDate, "")}
        popupContent={
          <DatePicker
            onDayClick={(value) =>
              onDaySelected(fields.mostRecentRehireDate, value)
            }
            value={values[fields.mostRecentRehireDate]}
          />
        }
        component={FieldDropSide}
        disabled={isEdit && !isSave}
      />
      {isEdit == true ? (
        <p className="link-text font-weight-500" onClick={toggle}>
          {isAdd === false ? "View Rehire Details" : "Hide Rehire Details"}
        </p>
      ) : null}
      {isAdd === true ? (
        <div className="border-box w-100 census-rehire">
          <Table>
            <Table.Thead>
              <Table.Tr>
                {columns.map((item, index) => {
                  return (
                    <Table.Th key={index} className={item.className}>
                      {item.label}
                    </Table.Th>
                  );
                })}
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {CensusEmployeeAgeMaster.map((source, index) => {
                return (
                  <Table.Tr key={index}>
                    {columns.map((item, cellIndex) => {
                      return (
                        <Table.Td key={cellIndex} className={item.className}>
                          {!isEmpty(item.link)
                            ? item.dataMapper[source[item.columnName]]
                            : source[item.columnName]}
                        </Table.Td>
                      );
                    })}
                  </Table.Tr>
                );
              })}
            </Table.Tbody>
          </Table>
        </div>
      ) : null}
      <Modal show={show} onHide={handleClose}>
        <Modal.Body style={{ borderTop: "5px solid #f94f50" }}>
          <div className="text-right">
            <FontAwesomeIcon
              icon={faTimes}
              color="#000"
              onClick={handleClose}
            />
          </div>
          <div className="d-flex">
            <div className="pd-15">
              <FontAwesomeIcon
                icon={faExclamationTriangle}
                color="#f94f50"
                size="3x"
              />
            </div>
            <div className="remove-text">
              <h4>Are you sure?</h4>
              <p>You want to remove the Rehire details.</p>
              <Button className="remove-btn mr-4" onClick={handleClose}>
                REMOVE
              </Button>
              <Button className="cancel-btn" onClick={handleClose}>
                Cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default EmploymentAgeDetail;
