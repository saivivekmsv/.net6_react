import React, { useContext, useEffect, useState } from "react";
import {
  ManagePayrollLayout,
  SearchableList,
  FieldDropSide,
  FieldTextarea,
  UploadComponent,
  LoaderWrapper,
} from "../../../components";
import { Form } from "react-bootstrap";
import { Formik, Field, ErrorMessage } from "formik";
import { get, isEmpty } from "lodash";
import {
  MANAGE_PAYROLL_ROUTES,
  managePayrollFormNames,
  formFields,
  getPathWithParam,
  getFlowBasedFormValues,
  required,
} from "../../../utils";
import { managePayrollStore, setManagePageLevelData } from "../../../contexts";
import { useRequest, useRouterParams } from "../../../abstracts";
import { fileUploadForPayrollAndCensus } from "../../../contexts/reducers/manage-payroll/actions";
import { getAllProfiles } from "../../../services";
const initialValues = {
  payrollDocument: [],
};

const UploadFileContainer = (props) => {
  const { state, dispatch } = useContext(managePayrollStore);
  const { flow } = useRouterParams();
  const formName = managePayrollFormNames.UPLOAD_FILE;
  const fields = formFields[formName];
  const apiData = get(state, "api", {});
  const [fileUploadRequired, setFileUploadRequired] = useState("");
  const [template, setTemplate] = useState([]);
  const isLoading = get(apiData, "isFetching", true);
  const { response, loading, error } = useRequest({
    method: getAllProfiles,
  });
  useEffect(() => {
    response && setTemplate(response.filter((_) => _.isActive));
  }, [response]);
  function onSubmit(values, { setFieldError }) {
    console.log(values[fields.uploadCensusAndPayroll]);
    if (
      values[fields.uploadCensusAndPayroll] != undefined &&
      values[fields.uploadCensusAndPayroll] != null &&
      values[fields.uploadCensusAndPayroll].length > 0
    ) {
      setFileUploadRequired("");
      const { history } = props;
      fileUploadForPayrollAndCensus(values, dispatch)
        .then((response) => {
          console.log(response);
          if (response.isSuccessful) {
            history.push(
              getPathWithParam({
                path: MANAGE_PAYROLL_ROUTES.UPLOADED_FILES_LISTING,
              })
            );
          } else {
            console.log(response);
            setFileUploadRequired(response.errorMessage);
          }
        })
        .catch((error) => {
          console.log(error);
          throw error;
        });
      dispatch(
        setManagePageLevelData({
          formName: formName,
          fieldData: values,
        })
      );
    } else {
      setFileUploadRequired("FU002 : Please upload a valid file.");
    }
  }

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
      label: "Upload",
      variant: "primary",
      type: "submit",
    },
  ];

  return (
    <Formik
      initialValues={{
        ...initialValues,
        ...getFlowBasedFormValues(get(state, formName, {}), flow),
      }}
      onSubmit={onSubmit}
      enableReinitialize
      validateOnChange={false}
      validateOnBlur={false}
    >
      {({ handleChange, setFieldValue, handleSubmit, values, ...rest }) => {
        console.log(values, "valeus");
        return (
          <Form
            className="mb-20 h-100"
            onSubmit={handleSubmit}
            validated={!isEmpty(rest.errors)}
          >
            <ManagePayrollLayout buttons={buttons} isLoading={isLoading}>
              <p className="payroll-sub-heading">Upload files</p>
              <Field
                label="Template"
                name={fields.template}
                value={values[fields.template]}
                options={template.map((value) => ({
                  label: value.name,
                  value: value.id,
                }))}
                placeholder="Select Template"
                direction="right"
                popupContent={
                  <SearchableList
                    label="Select Template"
                    options={template.map((value) => ({
                      label: value.name,
                      value: value.id,
                    }))}
                    onSelect={(value) => {
                      var data = template.find((val) => val.id === value);
                      setFieldValue(fields.inputType, data.inputType);
                      setFieldValue(fields.format, data.format);
                      setFieldValue(fields.template, value);
                    }}
                    selectedValue={values[fields.template]}
                  />
                }
                validate={(value) => {
                  return [undefined, null, ""].includes(value)
                    ? "FU001 : Required"
                    : undefined;
                }}
                component={FieldDropSide}
                isRequired
              />
              <UploadComponent
                name={fields.uploadCensusAndPayroll}
                setFieldValue={setFieldValue}
                label="Upload census and payroll file"
              />

              {
                <p
                  style={{
                    fontSize: "0.75rem",
                    marginTop: "0rem",
                    color: "#ff5050",
                  }}
                >
                  {fileUploadRequired}
                </p>
              }
              <Field
                name={fields.description}
                placeholder="Enter file description"
                label="Description"
                autoComplete="none"
                value={values[fields.description]}
                onChange={handleChange}
                component={FieldTextarea}
                size="md"
              />
            </ManagePayrollLayout>
          </Form>
        );
      }}
    </Formik>
  );
};

export default UploadFileContainer;
