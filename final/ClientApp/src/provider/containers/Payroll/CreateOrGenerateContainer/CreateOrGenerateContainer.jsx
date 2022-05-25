import React, { useContext, useEffect, useState } from "react";
import {
  ManagePayrollLayout,
  SearchableList,
  FieldDropSide,
  FieldTextarea,
  DatePicker,
} from "../../../components";
import { Form } from "react-bootstrap";
import { Formik, Field, ErrorMessage } from "formik";
import { get, isEmpty, values } from "lodash";
import {
  managePayrollFormNames,
  formFields,
  getPathWithParam,
  getFlowBasedFormValues,
  required,
  usDateFormat,
  FLOW_TYPES,
  MANAGE_PAYROLL_ROUTES,
  getAdvancedPathWithParam,
} from "../../../utils";
import {
  managePayrollStore,
  setManagePageLevelData,
  createPayrollAction,
} from "../../../contexts";
import { useRouterParams, useRequest } from "../../../abstracts";
import {
  getCompanyPlanPayrollFrequencies,
  createPayrollFromUI,
} from "../../../services";
import * as Yup from "yup";
import { fal } from "@fortawesome/pro-light-svg-icons";

const initialValues = {};
const today = new Date();
// const initialFieldValues = {
//   planId: 0,
//   companyId: 0,
//   payrollFrequencyId: 0,
//   paydate: new Date(today.setDate(today.getDate())),
//   description: "string",
// };

const CreateOrGenerateContainer = (props) => {
  const { state, dispatch } = useContext(managePayrollStore);
  const { payrollId, flow } = useRouterParams();
  const formName = managePayrollFormNames.CREATE_OR_GENERATE_FILE;
  const fields = formFields[formName];
  const [fieldValues, setFieldValues] = useState([]);
  const [payrollFrequencies, setpayrollFrequencies] = useState([]);
  const validationSchema = Yup.object().shape({
    description: Yup.string().max(
      150,
      "Description length cannot exceed more than 150 characters"
    ),
    [fields.payDate]: Yup.date()
      .required("Required")
      .test(
        "date greater than 2",
        "Pay Date cannot be more than 30 days",
        (data) => {
          return (
            data <=
            new Date(
              new Date().getFullYear(),
              new Date().getMonth(),
              new Date().getDate() + 30
            )
          );
        }
      ),
  });
  const buttons = [
    {
      link: getPathWithParam({
        path: MANAGE_PAYROLL_ROUTES.UPLOADED_FILES_LISTING,
      }),
      label: "Cancel",
      variant: "secondary",
      type: "button",
    },
    {
      label: "Next",
      variant: "primary",
      type: "submit",
    },
  ];

  const { response: data } = useRequest({
    method: getCompanyPlanPayrollFrequencies,
    defaultResponse: [],
  });
  console.log("Companies & Payrollrequencies data", data);
  const onFormSubmit = (values, { setFieldError }) => {
    console.log(values, "Formik Values");
    const { history } = props;
    setFieldValues(values);
    // let b = isEmpty(values) ? initialFieldValues : values;
    let b = values;

    if (b != null) {
      const apiData = get(state, "api.data", {});
      //apiResponse=createPayrollAction({ history, b }, dispatch, state);
      createPayrollFromUI({
        ...apiData,
        ...b,
      }).then((response) => {
        console.log("AFTERAPI CALL", response);
        if (response && response.isSuccessfull) {
          history.push(
            getAdvancedPathWithParam({
              path: `${MANAGE_PAYROLL_ROUTES.CREATE_PAYROLL_LISTING}`,
              pathParam: [FLOW_TYPES.EDIT, parseInt(response.id)],
            })
          );
        } else {
          console.log(response);
          if (response !== undefined || response !== null)
            setFieldError(
              response.errorMessages?.controlName,
              response.errorMessages?.message
            );
        }
      });
    }
  };

  return (
    <Formik
      validationSchema={validationSchema}
      initialValues={{
        ...initialValues,
        ...getFlowBasedFormValues(get(state, formName, {}), flow),
      }}
      onSubmit={onFormSubmit}
      enableReinitialize
      validateOnChange={false}
      validateOnBlur={false}
    >
      {({
        handleChange,
        setFieldValue,
        handleSubmit,
        values,
        errors,
        touched,
        ...rest
      }) => {
        const onDaySelected = (fieldName, value) => {
          setFieldValue(fieldName, value);
        };

        const filterpayrollfrequencies = (id) => {
          setFieldValue(fields.companyId, id);
          let filteredpayroll = data.payrollFrequencies.filter((e) => {
            return e.companyId == id;
          });
          setpayrollFrequencies(filteredpayroll);
        };

        console.log("FormSelectedValues", values);
        return (
          <Form
            className="mb-20 h-100"
            onSubmit={handleSubmit}
            validated={!isEmpty(rest.errors)}
          >
            <ManagePayrollLayout buttons={buttons}>
              <p className="payroll-sub-heading">Create Payroll</p>
              <Field
                label="Select Company"
                size="md"
                isRequired
                placeholder="Select Company"
                name={fields.companyId}
                value={values[fields.companyId]}
                direction="right"
                options={data.companies}
                popupContent={
                  <SearchableList
                    label="Select a Company"
                    options={data.companies}
                    onSelect={(value) => filterpayrollfrequencies(value)}
                    selectedValue={values[fields.companyId]}
                    name={fields.companyId}
                    // isNotTypeAhead
                    isRadio
                  />
                }
                validate={required}
                component={FieldDropSide}
              />

              {values[fields.companyId] != null && (
                <Field
                  label="Payroll frequency"
                  size="md"
                  isRequired
                  placeholder="Select frequency"
                  name={fields.payrollFrequencyId}
                  value={values[fields.payrollFrequencyId]}
                  direction="right"
                  options={payrollFrequencies}
                  popupContent={
                    <SearchableList
                      label="Select a Payroll Frequency"
                      options={payrollFrequencies}
                      onSelect={(value) =>
                        setFieldValue(fields.payrollFrequencyId, value)
                      }
                      selectedValue={values[fields.payrollFrequencyId]}
                      name={fields.payrollFrequencyId}
                      // isNotTypeAhead
                      isRadio
                    />
                  }
                  validate={required}
                  component={FieldDropSide}
                />
              )}

              <Field
                label="Pay date"
                size="md"
                name={fields.payDate}
                isRequired
                placeholder="Select date"
                value={usDateFormat(values[fields.payDate])}
                direction="right"
                onClear={() => onDaySelected(fields.payDate, "")}
                isDatePicker
                popupContent={
                  <DatePicker
                    onDayClick={(value) => onDaySelected(fields.payDate, value)}
                    value={values[fields.payDate]}
                    // maxDate={
                    //           new Date(
                    //             new Date().getFullYear(),
                    //             new Date().getMonth(),
                    //             new Date().getDate() + 30
                    //           )
                    //         }
                  />
                }
                // validate={required}
                component={FieldDropSide}
              />

              <Field
                name={fields.description}
                size="md"
                placeholder="Enter file description"
                label="Description"
                autoComplete="none"
                value={values[fields.description]}
                onChange={handleChange}
                component={FieldTextarea}
                className={
                  errors.description && touched.description
                    ? "input-error"
                    : null
                }
              />
            </ManagePayrollLayout>
          </Form>
        );
      }}
    </Formik>
  );
};

export default CreateOrGenerateContainer;
