import { Field, useFormikContext } from "formik";
import React from "react";
import { Col, Row } from "react-bootstrap";
import {
  FieldButtonGroup,
  FieldDropSide,
  FieldInputDecimal,
  FieldInputNumber,
  FieldMultiSelectButtonGroup,
  SearchableList,
} from "../../../components";
import vestingSchedules from "../../../mocks/vestingSchedules.json";
import {
  clearFieldValues,
  OPTIONS_DATA_MAPPER,
  required,
  toOptionValuesFromMapper,
  yesNoOptions,
} from "../../../utils";

const getVestScheduleDetails = (value) => {
  let scheduleDetails = ["%"];

  if (value === 1) {
    scheduleDetails = scheduleDetails.concat([0, 100, 100, 100, 100, 100]);
  } else if (value === 2) {
    scheduleDetails = scheduleDetails.concat([0, 0, 100, 100, 100, 100]);
  } else if (value === 3) {
    scheduleDetails = scheduleDetails.concat([0, 0, 0, 0, 100, 100]);
  } else if (value === 4) {
    scheduleDetails = scheduleDetails.concat([0, 25, 50, 75, 100, 100]);
  } else if (value === 5) {
    scheduleDetails = scheduleDetails.concat([20, 40, 60, 80, 100, 100]);
  } else if (value === 6) {
    scheduleDetails = scheduleDetails.concat([0, 20, 40, 60, 80, 100]);
  }

  return scheduleDetails;
};

const CommonVestingRules = ({
  fields,
  isEdit,
  isSave,
  isAdditionalVesting = false,
}) => {
  const { values, setValues, handleChange, setFieldValue } = useFormikContext();

  const vestingMethod = values[fields.vestingMethod];
  const onImmediateVestingIndicatorChange = (value) => {
    const updatedValues = clearFieldValues({
      values,
      fieldsToClear: [
        fields.vestedAt,
        fields.vestingMethod,
        fields.breakServiceApplicable,
        fields.breakServiceDefinition,
        fields.breakServiceRule,
        fields.disregardPriorService,
        fields.freezeVestingPercentage,
        fields.forfeitureTimings,
        fields.forfeitureTreatment,
        fields.defaultInvestmentId,
        fields.hoursOfService,
        fields.elapsedTime,
        fields.computationPeriod,
        fields.vestingSchedule,
      ],
    });
    setValues({
      ...updatedValues,
      [fields.immediateVestingIndicator]: value,
    });
  };

  const onVestingMethodChange = (value) => {
    let updatedValues = values;
    if (vestingMethod === 1) {
      updatedValues = clearFieldValues({
        values,
        fieldsToClear: [fields.elapsedTime, fields.computationPeriod],
      });
    } else if (vestingMethod === 2) {
      updatedValues = clearFieldValues({
        values,
        fieldsToClear: [fields.hoursOfService, fields.computationPeriod],
      });
    } else if (vestingMethod === 3) {
      updatedValues = clearFieldValues({
        values,
        fieldsToClear: [fields.hoursOfService, fields.elapsedTime],
      });
    }

    setValues({
      ...updatedValues,
      [fields.vestingMethod]: value,
    });
  };

  const validateHoursOfService = (value) => {
    if (!value) return "Required";
    else if (value > 1000)
      return "Number of hours of service should not be greater than 1000";
    return null;
  };

  const validateElapsedTime = (value) => (value ? null : "Required");

  return (
    <>
      <Field
        size="sm"
        name={fields.immediateVestingIndicator}
        label={"Plan has 100% immediate Vesting?"}
        options={yesNoOptions}
        selectedValue={values[fields.immediateVestingIndicator]}
        value={values[fields.immediateVestingIndicator]}
        onChange={onImmediateVestingIndicatorChange}
        component={FieldButtonGroup}
        disabled={isEdit && !isSave}
        isRequired
        validate={isAdditionalVesting && required}
      />
      {values[fields.immediateVestingIndicator] === false && (
        <>
          <Field
            size="lg"
            name={fields.vestedAt}
            label={"100% Vested At"}
            options={toOptionValuesFromMapper(OPTIONS_DATA_MAPPER.VESTED_AT)}
            selectedValue={values[fields.vestedAt]}
            onChange={(value) => {
              setFieldValue(fields.vestedAt, value);
            }}
            component={FieldMultiSelectButtonGroup}
            disabled={isEdit && !isSave}
            isRequired
            validate={isAdditionalVesting && required}
          />
          <Field
            size="xl"
            name={fields.vestingMethod}
            label={"Vesting Method"}
            options={toOptionValuesFromMapper(
              OPTIONS_DATA_MAPPER.VESTING_METHODS
            )}
            selectedValue={values[fields.vestingMethod]}
            value={values[fields.vestingMethod]}
            onChange={onVestingMethodChange}
            component={FieldButtonGroup}
            disabled={isEdit && !isSave}
            isRequired
            validate={isAdditionalVesting && required}
          />
          {vestingMethod === 1 && (
            <Field
              size="sm"
              name={fields.hoursOfService}
              label={"Hours Of Service"}
              type="number"
              autoComplete="off"
              value={values[fields.hoursOfService]}
              onChange={handleChange}
              disabled={isEdit && !isSave}
              component={FieldInputNumber}
              min={0}
              max={9999}
              isRequired
              validate={isAdditionalVesting && validateHoursOfService}
            />
          )}
          {vestingMethod === 2 && (
            <Field
              size="sm"
              name={fields.elapsedTime}
              label={"Elapsed time (Months)"}
              autoComplete="off"
              type="number"
              value={values[fields.elapsedTime]}
              onChange={handleChange}
              disabled={isEdit && !isSave}
              component={FieldInputNumber}
              min={0}
              max={99}
              isRequired
              validate={isAdditionalVesting && validateElapsedTime}
            />
          )}
          {(vestingMethod === 3 || vestingMethod === 1) && (
            <Field
              name={fields.computationPeriod}
              label={"Vesting Computational Period"}
              options={toOptionValuesFromMapper(
                OPTIONS_DATA_MAPPER.VESTING_COMPUTATION_PERIODS
              )}
              selectedValue={values[fields.computationPeriod]}
              value={values[fields.computationPeriod]}
              onChange={(value) => {
                setValues({
                  ...values,
                  [fields.computationPeriod]: value,
                });
              }}
              component={FieldButtonGroup}
              disabled={isEdit && !isSave}
              isRequired
              validate={isAdditionalVesting && required}
            />
          )}
          <Field
            size="md"
            label="Vesting Schedule"
            name={fields.vestingSchedule}
            value={values[fields.vestingSchedule]}
            options={vestingSchedules.data}
            disabled={isEdit && !isSave}
            popupContent={
              <SearchableList
                label="Select a Vesting Schedule"
                isNotTypeAhead
                options={vestingSchedules.data}
                onSelect={(value) =>
                  setFieldValue(fields.vestingSchedule, value)
                }
                selectedValue={values[fields.vestingSchedule]}
                isRadio
              />
            }
            component={FieldDropSide}
            isRequired
            validate={isAdditionalVesting && required}
          />
          {values[fields.vestingSchedule] && (
            <Row>
              {values[fields.vestingSchedule] === 7 ? (
                <Col md="5" className="vesting-table editable">
                  <table className="table table-bordered">
                    <thead>
                      <tr>
                        <th>Year</th>
                        <th>1</th>
                        <th>2</th>
                        <th>3</th>
                        <th>4</th>
                        <th>5</th>
                        <th>6</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>%</td>
                        <td>
                          <Field
                            size="xs"
                            name={fields.firstYear}
                            value={values[fields.firstYear]}
                            onChange={handleChange}
                            disabled={isEdit && !isSave}
                            component={FieldInputDecimal}
                            isRequired
                            validate={isAdditionalVesting && required}
                          />
                        </td>
                        <td>
                          <Field
                            size="xs"
                            name={fields.secondYear}
                            value={values[fields.secondYear]}
                            onChange={handleChange}
                            disabled={isEdit && !isSave}
                            component={FieldInputDecimal}
                            isRequired
                            validate={isAdditionalVesting && required}
                          />
                        </td>
                        <td>
                          <Field
                            size="xs"
                            name={fields.thirdYear}
                            value={values[fields.thirdYear]}
                            onChange={handleChange}
                            disabled={isEdit && !isSave}
                            component={FieldInputDecimal}
                            isRequired
                            validate={isAdditionalVesting && required}
                          />
                        </td>
                        <td>
                          <Field
                            size="xs"
                            name={fields.fourthYear}
                            value={values[fields.fourthYear]}
                            onChange={handleChange}
                            disabled={isEdit && !isSave}
                            component={FieldInputDecimal}
                            isRequired
                            validate={isAdditionalVesting && required}
                          />
                        </td>
                        <td>
                          <Field
                            size="xs"
                            name={fields.fifthYear}
                            value={values[fields.fifthYear]}
                            onChange={handleChange}
                            disabled={isEdit && !isSave}
                            component={FieldInputDecimal}
                            isRequired
                            validate={isAdditionalVesting && required}
                          />
                        </td>
                        <td>100</td>
                      </tr>
                    </tbody>
                  </table>
                </Col>
              ) : (
                <Col md="5" className="vesting-table">
                  <table className="table table-bordered">
                    <thead>
                      <tr>
                        <th>Year</th>
                        <th>1</th>
                        <th>2</th>
                        <th>3</th>
                        <th>4</th>
                        <th>5</th>
                        <th>6</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        {getVestScheduleDetails(
                          values[fields.vestingSchedule]
                        ).map((perc, index) => {
                          return <td key={perc + index}>{perc}</td>;
                        })}
                      </tr>
                    </tbody>
                  </table>
                </Col>
              )}
            </Row>
          )}
        </>
      )}
    </>
  );
};

export default CommonVestingRules;
