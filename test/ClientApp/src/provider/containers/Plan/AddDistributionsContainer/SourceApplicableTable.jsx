import React, { useContext, useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import {
  useDeepEffect,
  useRouterParams,
  useTableChecboxSelect,
} from "../../../abstracts";
import {
  CsplTable as Table,
  FieldButtonGroup,
  Select,
} from "../../../components";
import {
  getPathWithParam,
  OPTIONS_DATA_MAPPER,
  toOptionValuesFromMapper,
  yesNoOptions,
} from "../../../utils";
import { find, get, isEmpty, toLower } from "lodash";
import { ErrorMessage, Field, FieldArray } from "formik";
import { createPlanStore, setManagePlanLocalCache } from "../../../contexts";
import { useWithdrawalTableChecboxSelect } from "../../../abstracts/useWithdrawalTableChecboxSelect";

const mockOptions = [
  { label: "All", value: "" },
  { label: "Employee Deferral", value: "Employee Deferral" },
];

const columns = [
  {
    label: "",
    className: "",
    columnName: "",
  },
  {
    label: "Source Name",
    className: "column-distributionName",
    columnName: "sourceName",
  },
  {
    label: "Source Category",
    className: "column-distributionType",
    columnName: "sourceCategory",
    dataMapper: OPTIONS_DATA_MAPPER.DISTRIBUTIONS_SOURCE_CATEGORY,
  },
  {
    label: "With Earning?",
    className: "column-distributionWithEarning",
    columnName: "isWithEarnings",
  },
];

const SourceApplicableTable = ({
  fields,
  isSave,
  isEdit,
  values,
  setFieldValue,
  setValues,
  sources,
}) => {
  const { state, dispatch } = useContext(createPlanStore);
  const { flow, planId } = useRouterParams();

  const {
    data,
    isAllChecked,
    onHeaderCheckboxClick,
    onRowItemClick,
    isShowSelected,
    toggleShowSelected,
    selectedData,
    setWithEarningsValue,
  } = useWithdrawalTableChecboxSelect({
    response: sources,
  });

  useDeepEffect(
    () => {
      setFieldValue([fields.withdrawalSources], selectedData);
    },
    [selectedData],
    true
  );

  const disabled = isEdit && !isSave;

  return (
    <div>
      <div className="d-flex w-100 align-items-center justify-content-between mb-2">
        <p className="w-45 m-0 py-3 plan-sub-heading">Sources Applicable</p>
        <div className="ft-12">{selectedData.length} Selected</div>
        <div className="">
          <Button onClick={toggleShowSelected} className="mr-2">
            {isShowSelected ? "Show All" : "Show Selected"}
          </Button>
        </div>
      </div>
      <div
        style={{
          display: "block",
          fontSize: "0.75rem",
          marginTop: "0rem",
          color: "#ff5050",
        }}
      >
        <ErrorMessage name={fields.withdrawalSources} />
      </div>
      <Table>
        <Table.Thead>
          <Table.Tr>
            {columns.map((item, index) => {
              if (index === 0) {
                return (
                  <Table.Th key={index} className={item.className}>
                    <Form.Check
                      custom
                      name="master-sources-radio-head"
                      type="checkbox"
                      label=""
                      id={`master-sources-radio-head`}
                      onChange={onHeaderCheckboxClick}
                      checked={isAllChecked}
                      disabled={disabled}
                    />
                  </Table.Th>
                );
              }
              return (
                <Table.Th key={index} className={item.className}>
                  {item.label}
                </Table.Th>
              );
            })}
          </Table.Tr>
        </Table.Thead>
        <FieldArray name={fields.withdrawalSources}>
          {() => {
            return (
              <Table.Tbody isLoading={false} totalRecords={data.length}>
                {data.map((source, index) => {
                  const onRowCheckboxClick = () => {
                    onRowItemClick(source, index);
                  };

                  return (
                    <Table.Tr key={index}>
                      {columns.map((item, cellIndex) => {
                        const getContent = () => {
                          if (cellIndex === 0) {
                            return (
                              <Form.Check
                                custom
                                name={`${source.id}.checked`}
                                type="checkbox"
                                label=""
                                id={`${source.id}.checked`}
                                checked={source.checked}
                                onChange={onRowCheckboxClick}
                                disabled={disabled}
                              />
                            );
                          }

                          if (!isEmpty(item.link)) {
                            return (
                              <Link
                                to={getPathWithParam({
                                  path: item.link,
                                  pathParam: [flow, planId, source.id],
                                })}
                              >
                                {source[item.columnName]}
                              </Link>
                            );
                          }

                          if (item.dataMapper) {
                            return item.dataMapper[source[item.columnName]];
                          }

                          if (
                            source.checked &&
                            item.columnName === "isWithEarnings"
                          ) {
                            return (
                              <Field
                                isRequired
                                size="sm"
                                name={`${source.id}.isWithEarnings`}
                                options={yesNoOptions}
                                selectedValue={source["withEarningType"]}
                                component={FieldButtonGroup}
                                disabled={disabled}
                                onChange={(value) => {
                                  setWithEarningsValue(index, value);
                                }}
                              />
                            );
                          }

                          return source[item.columnName];
                        };

                        return (
                          <Table.Td key={cellIndex} className={item.className}>
                            {getContent()}
                          </Table.Td>
                        );
                      })}
                    </Table.Tr>
                  );
                })}
              </Table.Tbody>
            );
          }}
        </FieldArray>
      </Table>
    </div>
  );
};

export default SourceApplicableTable;
