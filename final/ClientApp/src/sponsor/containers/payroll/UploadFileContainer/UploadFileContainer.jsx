import React, { useContext, useState,useEffect } from "react";
import {
  ManagePayrollLayout,
  SearchableList,
  FieldDropSide,
  FieldTextarea,
  UploadComponent,
} from "../../../../shared/components"
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
} from "../../../../shared/utils"
import { managePayrollStore, setManagePageLevelData } from "../../../contexts";
import { useRequest,useRouterParams } from "shared/abstracts";
import template from "../../../../shared/mocks/template.json";
import { getMappingProfiles } from "../../../services";
import { fileUploadForPayrollAndCensus } from "../../../contexts/reducers/manage-payroll/actions";
const initialValues = {
  payrollDocument: [],
};

const UploadFileContainer = (props) => {
  const { state, dispatch } = useContext(managePayrollStore);
  const [template, setTemplate] = useState([]);
  const { response, loading, error } = useRequest({
    method: getMappingProfiles,
  });
  useEffect(() => {
    response && setTemplate(response);
  }, [response]);

  const { flow } = useRouterParams();
  const formName = managePayrollFormNames.UPLOAD_FILE;
  const fields = formFields[formName];
  const apiData = get(state, "api", {});
  const [fileUploadRequired, setFileUploadRequired] = useState("");

  const isLoading = get(apiData, "isFetching", true);
  const onSubmit = (values, { setFieldError }) => {
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
          history.push(
            getPathWithParam({
              path: MANAGE_PAYROLL_ROUTES.UPLOADED_FILES_LISTING,
            })
          );
        })
        .catch((error) => {
          history.push(
            getPathWithParam({
              path: MANAGE_PAYROLL_ROUTES.UPLOADED_FILES_LISTING,
            })
          );
          throw error;
        });
      dispatch(
        setManagePageLevelData({
          formName: formName,
          fieldData: values,
        })
      );
    } else {
      setFileUploadRequired("Please upload a valid excel/csv file.");
    }
  };

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
                    onSelect={(value) => setFieldValue(fields.template, value)}
                    selectedValue={values[fields.template]}
                  />
                }
                validate={required}
                component={FieldDropSide}
                isRequired
              />
              <UploadComponent
                name={fields.uploadCensusAndPayroll}
                setFieldValue={setFieldValue}
                label="Upload census and payroll filre"
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
