import React, { useEffect, useState } from "react";
import {
  includeExcludeIgnoreOptions,
  yesNoOptions,
  OPTIONS_DATA_MAPPER,
  required,
  toOptionValuesFromMapper,
  managePlanFormNames,
  formFields,
  FLOW_TYPES,
  getPathWithParam,
} from "../../utils";
import { Formik, Field, FieldArray } from "formik";
import { CompensationTable, FieldButtonGroup } from "../../components";
import { useDeepEffect, useRouterParams } from "../../abstracts";
import { get, isEmpty } from "lodash";

const ManageCompensationCategory = (props) => {
  // const { data, hideField = false } = props;
  const { values, setFieldValue, subName, category } = props;
  const { flow, planId, compensationId } = useRouterParams();
  const [newFlow, setNewFlow] = useState(compensationId ? flow : "");
  console.log(values, "valuse");
  console.log(category, "newVals");
  const columns = [
    {
      label: "Compensation categories",
      className: "compensation-categories-head",
      columnName: "name",
    },
    {
      label: "Plan compensation calculation",
      className: "plan-compensation-head",
      columnName: "calculationType",
    },
  ];

  const isEdit = flow === FLOW_TYPES.EDIT;
  const isSave = newFlow === FLOW_TYPES.SAVE;

  return (
    <FieldArray name={subName}>
      {({ push, remove }) => {
        console.log(subName, "suName");
        console.log(category, "name");
        return (
          <CompensationTable className="compensation-table compensation-table_category">
            <CompensationTable.Thead>
              <CompensationTable.Tr>
                {columns.map((item, index) => {
                  return (
                    <CompensationTable.Th
                      key={index}
                      className={item.className}
                    >
                      {item.label}
                    </CompensationTable.Th>
                  );
                })}
              </CompensationTable.Tr>
            </CompensationTable.Thead>
            <CompensationTable.Tbody>
              {!isEmpty(category) &&
                category.map((item, index) => {
                  return (
                    <CompensationTable.Tr key={index}>
                      <CompensationTable.Td className="compensation-categories">
                        <label> {item.name}</label>
                      </CompensationTable.Td>
                      <CompensationTable.Td className="plan-compensation">
                        <Field
                          isRequired
                          size="xxl"
                          name={`${subName}.${index}.calculationType`}
                          options={toOptionValuesFromMapper(
                            OPTIONS_DATA_MAPPER.COMPENSATION_CATEGORY_CALCULATIONS
                          )}
                          selectedValue={item.calculationType}
                          onChange={(value) => {
                            setFieldValue(
                              `${subName}.${index}.calculationType`,
                              value
                            );
                          }}
                          component={FieldButtonGroup}
                          validate={required}
                          disabled={isEdit && !isSave}
                        />
                      </CompensationTable.Td>
                    </CompensationTable.Tr>
                  );
                })}
            </CompensationTable.Tbody>
          </CompensationTable>
        );
      }}
    </FieldArray>
  );
};

export default ManageCompensationCategory;
