/* eslint-disable eqeqeq */
import { Field } from "formik";
import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { isEmpty, get } from "lodash";
import {
  DatePicker,
  FieldDropSide,
  SearchableList,
  CsplTable as Table,
} from "../../../../shared/components";
import { usDateFormat } from "../../../../shared/utils"
import company from "../../../../shared/mocks/company.json";
import CensusEmployeeAgeMaster from "../../../../shared/mocks/CensusEmployeeAgeMaster.json";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faExclamationTriangle,
  faTimes,
} from "@fortawesome/pro-light-svg-icons";
import { getEmployeeRehireDetails,getEmploymentStatusList } from "../../../services";
import { useRouterParams, useRequest } from "../../../../shared/abstracts";


const columns = [
  {
    label: "Hire / rehire date",
    className: "column-rehireDate",
    columnName: "rehireDate",
  },
  {
    label: "Term date",
    className: "column-termDate",
    columnName: "terminationDate",
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
  const { censusId } = useRouterParams();
  //const intcensusId = parseInt(censusId, 10);

  const onDaySelected = (fieldName, value) => {
    setFieldValue(fieldName, value);
  };

  // const { loading: IsLoading, response: rehireDetails } = useRequest({
  //   method: getEmployeeRehireDetails,
  //   payload: censusId,
  //   defaultResponse: [],
  // });

  const rehireDetails = get(values, "rehireDetails", []);

  const { response: employmentStatusList } = useRequest({
    method: getEmploymentStatusList,
    payload: get(values, "companyId", 0),
    defaultResponse: [],
  });
  const masterEmploymentStatusId = employmentStatusList.find(
    ({ id }) => id === values[fields.employmentStatusId]
  )
    ? employmentStatusList.find(
        ({ id }) => id === values[fields.employmentStatusId]
      ).employmentStatus
    : 0;

  return (
    <div>
      <p className="mt-20 plan-sub-heading">Dates</p>
      <div className="d-flex">
        <Field
          isRequired
          label="Date of Birth"
          size="md"
          name={fields.birthDate}
          value={usDateFormat(values[fields.birthDate])}
          isDatePicker
          onClear={() => onDaySelected(fields.birthDate, null)}
          popupContent={
            <DatePicker
              onDayClick={(value) => onDaySelected(fields.birthDate, value)}
              value={values[fields.birthDate]}
            />
          }
          component={FieldDropSide}
          disabled={isEdit && !isSave}
        />
        {values.birthDate === undefined ? (
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
        isRequired
        label="Hire Date"
        size="md"
        name={fields.hireDate}
        value={usDateFormat(values[fields.hireDate])}
        isDatePicker
        onClear={() => onDaySelected(fields.hireDate, null)}
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
        name={fields.employmentStatusId}
        value={values[fields.employmentStatusId]}
        options={
          employmentStatusList &&
          employmentStatusList.map((status, index) => ({
            label: status.employmentStatusName,
            value: status.id,
          }))
        }
        label="Employment Status"
        popupContent={
          <SearchableList
            label="Select Employment Status"
            options={
              employmentStatusList &&
              employmentStatusList.map((status, index) => ({
                label: status.employmentStatusName,
                value: status.id,
              }))
            }
            onSelect={(value) => {
              setFieldValue(fields.employmentStatusId, value);
            }}
            selectedValue={values[fields.employmentStatusId]}
            value={values[fields.employmentStatusId]}
          />
        }
        component={FieldDropSide}
        disabled={isEdit && !isSave}
      />
      {console.log(employmentStatusList)}
      {masterEmploymentStatusId === 4 && (
        <Field
          label="Leave Start Date"
          isRequired
          size="md"
          name={fields.leaveStartDate}
          value={usDateFormat(values[fields.leaveStartDate])}
          isDatePicker
          onClear={() => onDaySelected(fields.leaveStartDate, null)}
          popupContent={
            <DatePicker
              onDayClick={(value) =>
                onDaySelected(fields.leaveStartDate, value)
              }
              value={values[fields.leaveStartDate]}
            />
          }
          component={FieldDropSide}
          disabled={isEdit && !isSave}
        />
      )}

      {masterEmploymentStatusId === 4 && (
        <Field
          label="Leave End Date"
          size="md"
          name={fields.leaveEndDate}
          value={usDateFormat(values[fields.leaveEndDate])}
          isDatePicker
          onClear={() => onDaySelected(fields.leaveEndDate, null)}
          popupContent={
            <DatePicker
              onDayClick={(value) => onDaySelected(fields.leaveEndDate, value)}
              value={values[fields.leaveEndDate]}
            />
          }
          component={FieldDropSide}
          disabled={isEdit && !isSave}
        />
      )}
      <Field
        label="Most Recent Term Date"
        size="md"
        name={fields.terminationDate}
        value={usDateFormat(values[fields.terminationDate])}
        isDatePicker
        onClear={() => onDaySelected(fields.terminationDate, null)}
        popupContent={
          <DatePicker
            onDayClick={(value) => onDaySelected(fields.terminationDate, value)}
            value={values[fields.terminationDate]}
          />
        }
        component={FieldDropSide}
        disabled={masterEmploymentStatusId === 1 ? true : isEdit && !isSave}
      />
      <Field
        label="Most Recent Rehire Date"
        size="md"
        name={fields.reHireDate}
        value={usDateFormat(values[fields.reHireDate])}
        isDatePicker
        onClear={() => onDaySelected(fields.reHireDate, null)}
        popupContent={
          <DatePicker
            onDayClick={(value) => onDaySelected(fields.reHireDate, value)}
            value={values[fields.reHireDate]}
          />
        }
        component={FieldDropSide}
        disabled={masterEmploymentStatusId === 2 ? true : isEdit && !isSave}
      />
      {isEdit == true || censusId != undefined ? (
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
              {rehireDetails &&
                rehireDetails.map((source, index) => {
                  return (
                    <Table.Tr key={index}>
                      {columns.map((item, cellIndex) => {
                        return (
                          <Table.Td key={cellIndex} className={item.className}>
                            {!isEmpty(item.link)
                              ? item.dataMapper[source[item.columnName]]
                              : usDateFormat(source[item.columnName])}
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
