import React from "react";
import { Field, useFormikContext } from "formik";
import { get, isEmpty } from "lodash";
import {
  clearFieldValues,
  FLOW_TYPES,
  getPathWithParam,
  MANAGE_PLAN_ROUTES,
  OPTIONS_DATA_MAPPER,
  required,
  toMultiSelectValue,
  toOptionValuesFromMapper,
  tranformListToDropdownValues,
  usDateFormat,
  yesNoOptions,
  toMultiSelectValueById,
} from "../../../utils";
import {
  AddPlans,
  DatePicker,
  FieldButtonGroup,
  FieldDropSide,
  FieldInput,
  FieldTextarea,
  MultiSelectDropdown,
  SearchableList,
  CsplTable as Table,
  Link,
  AddButton,
} from "../../../components";
import { useRouterParams } from "../../../abstracts";

const columns = [
  {
    label: "Effective Start Date",
    className: "column-inv-effective-start-date",
    columnName: "effectiveStartDate",
    link: MANAGE_PLAN_ROUTES.ADD_INVESTMENTS_RESTRICTIONS,
  },
  {
    label: "Effective End Date",
    className: "column-inv-effective-end-date",
    columnName: "effectiveEndDate",
    type: "date",
  },
  {
    label: "Applicable Types",
    className: "column-inv-applicable-types",
    columnName: "applicableTypes",
    dataMapper: OPTIONS_DATA_MAPPER.TEMP_APPLICABLE_TYPES,
  },
];
const initialValues = {};
const NonModalInvestmentForm = ({
  fields,
  isEdit,
  isSave,
  restrictionsList,
  investmentsList,
}) => {
  const {
    values,
    handleChange,
    setFieldValue,
    setValues,
    setTouched,
  } = useFormikContext();

  const { planId, investmentId } = useRouterParams();
  const intInvestmentId = parseInt(investmentId, 10);
  const onInvestmentStatusChange = (value) => {
    const updatedValues = clearFieldValues({
      values,
      fieldsToClear: [fields.closureDate],
    });
    setValues({
      ...updatedValues,
      [fields.investmentStatus]: value,
    });
    setTouched({
      [fields.closureDate]: false,
    });
  };

  const onInvestmentComputingFundChange = (value) => {
    const updatedValues = clearFieldValues({
      values,
      fieldsToClear: [fields.applicableInvesments],
    });
    setValues({
      ...updatedValues,
      [fields.isInvestmentOfComputingFundApplicable]: value,
    });
    setTouched({
      [fields.applicableInvestments]: false,
    });
  };

  const onProspectusDeliveryTransactionChange = (value) => {
    const updatedValues = clearFieldValues({
      values,
      fieldsToClear: [
        fields.prospectusDeliveryMethod,
        fields.frequencyOfProspectusDisclaimer,
      ],
    });
    setValues({
      ...updatedValues,
      [fields.isProspectusDeliveryWith1stTransferApplicable]: value,
    });
    setTouched({
      [fields.prospectusDeliveryMethod]: false,
      [fields.frequencyOfProspectusDisclaimer]: false,
    });
  };
  const selectApplicableInvestmentForComputingFund =
    values[fields.applicableInvestments];
  const typeOfEarnings = values[fields.typeOfEarnings];
  const dividends = values[fields.typeOfEarnings] === 3;
  const dividendType = values[fields.dividendType];
  const equity = values[fields.dividendType] === 2;
  return (
    <div>
      <Field
        size="md"
        isRequired
        name={fields.investmentCategory}
        label={"Investment Category"}
        value={values[fields.investmentCategory]}
        onChange={handleChange}
        disabled={isEdit && !isSave}
        options={toOptionValuesFromMapper(
          OPTIONS_DATA_MAPPER.INVESTMENT_CATEGORY
        )}
        popupContent={
          <SearchableList
            label="Select an Investment Category"
            isNotTypeAhead
            isRadio
            selectedValue={values[fields.investmentCategory]}
            options={toOptionValuesFromMapper(
              OPTIONS_DATA_MAPPER.INVESTMENT_CATEGORY
            )}
            onSelect={(value) =>
              setFieldValue(fields.investmentCategory, value)
            }
          />
        }
        component={FieldDropSide}
        // validate={required}
      />
      <Field
        size="md"
        isRequired
        name={fields.investmentName}
        label={"Investment Name"}
        type="text"
        autoComplete="off"
        value={values[fields.investmentName]}
        onChange={handleChange}
        disabled={isEdit && !isSave}
        component={FieldInput}
        // validate={required}
      />
      <Field
        size="lg"
        isRequired
        name={fields.investmentDescription}
        label={"Investment Description"}
        type="text"
        autoComplete="off"
        value={values[fields.investmentDescription]}
        onChange={handleChange}
        disabled={isEdit && !isSave}
        component={FieldTextarea}
        // validate={required}
      />
      <div className="d-flex">
        <Field
          isRequired
          name={fields.investmentStatus}
          label={"Investment Status"}
          value={values[fields.investmentStatus]}
          disabled={isEdit && !isSave}
          options={toOptionValuesFromMapper(
            OPTIONS_DATA_MAPPER.INVESTMENT_STATUS
          )}
          popupContent={
            <SearchableList
              label="Select an Investment Status"
              isNotTypeAhead
              isRadio
              selectedValue={values[fields.investmentStatus]}
              options={toOptionValuesFromMapper(
                OPTIONS_DATA_MAPPER.INVESTMENT_STATUS
              )}
              onSelect={onInvestmentStatusChange}
            />
          }
          component={FieldDropSide}
          //validate={required}
        />
        &nbsp;&nbsp;&nbsp;
        {values[fields.investmentStatus] === 1 && (
          <Field
            size="smd"
            isRequired
            name={fields.closureDate}
            label={"Closure Date"}
            value={usDateFormat(values[fields.closureDate])}
            isDatePicker
            onClear={() => setFieldValue(fields.closureDate, "")}
            popupContent={
              <DatePicker
                onDayClick={(value) => setFieldValue(fields.closureDate, value)}
                value={values[fields.closureDate]}
              />
            }
            disabled={isEdit && !isSave}
            component={FieldDropSide}
            // validate={required}
          />
        )}
      </div>
      <Field
        size="smd"
        isRequired
        name={fields.inceptionDate}
        label={"Investment Inception Date"}
        value={usDateFormat(values[fields.inceptionDate])}
        isDatePicker
        onClear={() => setFieldValue(fields.inceptionDate, "")}
        popupContent={
          <DatePicker
            maxDate={new Date()}
            onDayClick={(value) => setFieldValue(fields.inceptionDate, value)}
            value={values[fields.inceptionDate]}
          />
        }
        disabled={isEdit && !isSave}
        component={FieldDropSide}
        //validate={required}
      />
      <Field
        isRequired
        name={fields.fundCode}
        label={"Fund Code"}
        type="text"
        autoComplete="off"
        value={values[fields.fundCode]}
        onChange={handleChange}
        disabled={isEdit && !isSave}
        component={FieldInput}
        // validate={required}
      />
      <Field
        isRequired
        name={fields.CUSIP}
        label={"CUSIP"}
        type="text"
        autoComplete="off"
        value={values[fields.CUSIP]}
        onChange={handleChange}
        disabled={isEdit && !isSave}
        component={FieldInput}
        //validate={required}
      />
      <Field
        size="smd"
        isRequired
        name={fields.tickerSymbol}
        label={"Ticker Symbol"}
        type="text"
        autoComplete="off"
        value={values[fields.tickerSymbol]}
        onChange={handleChange}
        disabled={isEdit && !isSave}
        component={FieldInput}
        // validate={required}
      />
      <Field
        size="smd"
        isRequired
        name={fields.shareClass}
        label={"Share Class"}
        value={values[fields.shareClass]}
        disabled={isEdit && !isSave}
        options={toOptionValuesFromMapper(
          OPTIONS_DATA_MAPPER.INVESTMENT_SHARE_CLASS
        )}
        popupContent={
          <SearchableList
            label="Select a Share Class"
            isNotTypeAhead
            isRadio
            selectedValue={values[fields.shareClass]}
            options={toOptionValuesFromMapper(
              OPTIONS_DATA_MAPPER.INVESTMENT_SHARE_CLASS
            )}
            onSelect={(value) => setFieldValue(fields.shareClass, value)}
          />
        }
        component={FieldDropSide}
        //validate={required}
      />
      <Field
        size="lg"
        isRequired
        name={fields.typeOfEarnings}
        label={"Type Of Earnings"}
        options={toOptionValuesFromMapper(OPTIONS_DATA_MAPPER.TYPE_OF_EARNINGS)}
        selectedValue={typeOfEarnings}
        value={typeOfEarnings}
        onChange={(value) => {
          setFieldValue(fields.typeOfEarnings, value);
        }}
        component={FieldButtonGroup}
        //validate={required}
        disabled={isEdit && !isSave}
      />
      {dividends && (
        <>
          <Field
            isRequired
            name={fields.dividendType}
            label={"Dividend Type"}
            options={toOptionValuesFromMapper(
              OPTIONS_DATA_MAPPER.DIVIDEND_TYPE
            )}
            selectedValue={values[fields.dividendType]}
            value={values[fields.dividendType]}
            onChange={(value) => {
              setFieldValue(fields.dividendType, value);
            }}
            component={FieldButtonGroup}
            // validate={required}
            disabled={isEdit && !isSave}
          />
        </>
      )}

      {equity && (
        <>
          <Field
            size="lg"
            isRequired
            name={fields.dividendProcessingFrequency}
            label={"Dividend Processing Date"}
            options={toOptionValuesFromMapper(
              OPTIONS_DATA_MAPPER.DIVIDEND_PROCESSING_DATE
            )}
            selectedValue={values[fields.dividendProcessingFrequency]}
            value={values[fields.dividendProcessingFrequency]}
            onChange={(value) => {
              setFieldValue(fields.dividendProcessingFrequency, value);
            }}
            component={FieldButtonGroup}
            //validate={required}
            disabled={isEdit && !isSave}
          />
        </>
      )}

      <Field
        size="sm"
        isRequired
        name={fields.isInvestmentQDIA}
        label={"Investment is QDIA?"}
        options={yesNoOptions}
        selectedValue={values[fields.isInvestmentQDIA]}
        value={values[fields.isInvestmentQDIA]}
        onChange={(value) => {
          setFieldValue(fields.isInvestmentQDIA, value);
        }}
        component={FieldButtonGroup}
        //  validate={required}
        disabled={isEdit && !isSave}
      />
      <Field
        isRequired
        name={fields.investmentObjective}
        label={"Investment Objective"}
        value={values[fields.investmentObjective]}
        disabled={isEdit && !isSave}
        options={toOptionValuesFromMapper(
          OPTIONS_DATA_MAPPER.INVESTMENT_OBJECTIVE
        )}
        popupContent={
          <SearchableList
            label="Select an Investment Objective"
            isNotTypeAhead
            isRadio
            selectedValue={values[fields.investmentObjective]}
            options={toOptionValuesFromMapper(
              OPTIONS_DATA_MAPPER.INVESTMENT_OBJECTIVE
            )}
            onSelect={(value) =>
              setFieldValue(fields.investmentObjective, value)
            }
          />
        }
        component={FieldDropSide}
        // validate={required}
      />
      <Field
        isRequired
        name={fields.volatility}
        label={"Volatility"}
        value={values[fields.volatility]}
        disabled={isEdit && !isSave}
        options={toOptionValuesFromMapper(
          OPTIONS_DATA_MAPPER.INVESTMENT_VOLATILITY
        )}
        popupContent={
          <SearchableList
            label="Select a Volatility"
            isNotTypeAhead
            isRadio
            selectedValue={values[fields.volatility]}
            options={toOptionValuesFromMapper(
              OPTIONS_DATA_MAPPER.INVESTMENT_VOLATILITY
            )}
            onSelect={(value) => setFieldValue(fields.volatility, value)}
          />
        }
        component={FieldDropSide}
        //validate={required}
      />
      <Field
        size="sm"
        isRequired
        name={fields.isInvestmentOfComputingFundApplicable}
        label={"Investment for Computing Fund?"}
        options={yesNoOptions}
        selectedValue={values[fields.isInvestmentOfComputingFundApplicable]}
        value={values[fields.isInvestmentOfComputingFundApplicable]}
        onChange={onInvestmentComputingFundChange}
        component={FieldButtonGroup}
        // validate={required}
        disabled={isEdit && !isSave}
      />
      {values[fields.isInvestmentOfComputingFundApplicable] && (
        <Field
          isRequired
          name={fields.applicableInvestments}
          label={"Applicable Investments for Computing Fund"}
          isMultiSelect
          value={toMultiSelectValueById(
            selectApplicableInvestmentForComputingFund,
            investmentsList
          )}
          popupContent={
            <MultiSelectDropdown
              label="Select Applicable Investments"
              name={fields.applicableInvestments}
              isTypeAhead
              onSelect={(value) =>
                setFieldValue(fields.applicableInvestments, value)
              }
              value={values[fields.applicableInvestments]}
              options={investmentsList}
              disabled={isEdit && !isSave}
              height="350px"
            />
          }
          //validate={required}
          component={FieldDropSide}
          disabled={isEdit && !isSave}
        />
      )}
      <Field
        size="sm"
        isRequired
        name={fields.isProspectusDeliveryWith1stTransferApplicable}
        label={"Prospectus Delivery with 1st transfer transaction"}
        options={yesNoOptions}
        selectedValue={
          values[fields.isProspectusDeliveryWith1stTransferApplicable]
        }
        value={values[fields.isProspectusDeliveryWith1stTransferApplicable]}
        onChange={onProspectusDeliveryTransactionChange}
        component={FieldButtonGroup}
        //validate={required}
        disabled={isEdit && !isSave}
      />
      {values[fields.isProspectusDeliveryWith1stTransferApplicable] && (
        <>
          <Field
            isRequired
            name={fields.prospectusDeliveryMethod}
            label={"Prospectus Delivery Method"}
            options={toOptionValuesFromMapper(
              OPTIONS_DATA_MAPPER.PROSPECTUS_DELIVERY_METHOD
            )}
            selectedValue={values[fields.prospectusDeliveryMethod]}
            value={values[fields.prospectusDeliveryMethod]}
            onChange={(value) => {
              setFieldValue(fields.prospectusDeliveryMethod, value);
            }}
            component={FieldButtonGroup}
            //validate={required}
            disabled={isEdit && !isSave}
          />
          <Field
            size="xxl"
            isRequired
            name={fields.prospectusDeliveryFrequency}
            label="Frequency of Prospectus disclaimer notice for transfers"
            options={toOptionValuesFromMapper(
              OPTIONS_DATA_MAPPER.FREQUENCY_OF_PROSPECTUS_DISCLAIMER
            )}
            selectedValue={values[fields.prospectusDeliveryFrequency]}
            value={values[fields.prospectusDeliveryFrequency]}
            onChange={(value) => {
              setFieldValue(fields.prospectusDeliveryFrequency, value);
            }}
            component={FieldButtonGroup}
            //validate={required}
            disabled={isEdit && !isSave}
          />
        </>
      )}
      {!isNaN(intInvestmentId) && (
        <div>
          <div className="w-100">
            <div className="line-separator"></div>
            <div className="d-flex justify-content-between mb-4 bg-white p-3">
              <div className="">
                <div className="m-0 plan-heading">Restrictions</div>
              </div>
              <div>
                <Link
                  disabled={isEdit && !isSave}
                  to={getPathWithParam({
                    path: MANAGE_PLAN_ROUTES.ADD_INVESTMENTS_RESTRICTIONS,
                    pathParam: [FLOW_TYPES.ADD, planId, intInvestmentId],
                  })}
                >
                  <AddButton disabled={isEdit && !isSave} />
                </Link>
              </div>
            </div>
          </div>
          {isEmpty(restrictionsList) && (
            <AddPlans
              content="No Restrictions"
              buttonLabel="ADD Restrictions"
              link={getPathWithParam({
                path: MANAGE_PLAN_ROUTES.ADD_INVESTMENTS_RESTRICTIONS,
                pathParam: [FLOW_TYPES.ADD, planId, intInvestmentId],
              })}
              className="h-auto"
              disabled={isEdit && !isSave}
            />
          )}
          {!isEmpty(restrictionsList) && (
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
                {restrictionsList.map((restriction, index) => {
                  return (
                    <Table.Tr key={index}>
                      {columns.map((item, cellIndex) => {
                        const getContent = () => {
                          if (item.link) {
                            return (
                              <Link
                                to={getPathWithParam({
                                  path: item.link,
                                  pathParam: [
                                    FLOW_TYPES.EDIT,
                                    planId,
                                    investmentId,
                                    restriction.id,
                                  ],
                                })}
                              >
                                {usDateFormat(restriction[item.columnName])}
                              </Link>
                            );
                          }
                          if (item.type === "date") {
                            return usDateFormat(restriction[item.columnName]);
                          }
                          if (item.columnName === "applicableTypes") {
                            return (get(restriction, "applicableTypes") || [])
                              .map((val) => {
                                return item.dataMapper[val];
                              })
                              .join(", ");
                          }
                          return restriction[item.columnName];
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
            </Table>
          )}
          <br />
          <Link
            to={getPathWithParam({
              path: MANAGE_PLAN_ROUTES.VIEW_INV_RESTRICTION_HISTORY,
              pathParam: [FLOW_TYPES.EDIT, planId, intInvestmentId],
            })}
            disabled={isEdit && !isSave}
            className="blue-link"
          >
            Resitriction History
          </Link>
        </div>
      )}
    </div>
  );
};

export default NonModalInvestmentForm;
