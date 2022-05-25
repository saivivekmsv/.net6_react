import React, { useContext, useState } from "react";
import { get, find, isEmpty, parseInt } from "lodash";
import { Row, Col, Form } from "react-bootstrap";
import { faPencilAlt } from "@fortawesome/pro-light-svg-icons";
import { faTimes, faTrashAlt } from "@fortawesome/pro-light-svg-icons";
import * as Yup from "yup";
import { Field, Formik } from "formik";
import {
  ROUTES,
  MANAGE_COMPANY_ROUTES,
  manageCompanyFormNames,
  formFields,
  FLOW_TYPES,
  getAdvancedPathWithParam,
  required,
} from "../../utils";
import {
  ManageCompanyLayout,
  EmploymentStatusDropdown,
  FieldDropSide,
  FieldInput,
} from "../../components";
import { useRouterParams } from "../../abstracts";
import {
  manageCompanyStore,
  setManageCompanyToastInfo,
  saveCompanyDetails,
} from "../../contexts";
import employmentStatus from "../../mocks/employmentStatus.json";

const schema = Yup.object().shape({});

const EmployeeClassificationsContainer = (props) => {
  const { history } = props;
  const { companyId, flow, statusId } = useRouterParams();
  const intStatusId = parseInt(statusId, 10);

  const { state, dispatch } = useContext(manageCompanyStore);

  const formName = manageCompanyFormNames.EMPLOYMENT_STATUS_MANAGE_COMPANY;
  const employmentStatusData = get(state, "api.data.employmentStatus", []);
  const formValues = find(employmentStatusData, {
    id: intStatusId,
  });
  const fields = formFields[formName];
  const isEdit = flow === FLOW_TYPES.EDIT;
  const isSave = flow === FLOW_TYPES.SAVE;
  const [employmentStatusTypes, setEmploymentStatusTypes] = useState([]);

  const getDataForSave = (values) => {
    if (isEmpty(formValues)) {
      return [
        ...employmentStatusData,
        {
          employmentStatus: values?.employmentStatus,
          employmentStatusCode: values?.employmentStatusCode,
          employmentStatusName: values?.employmentStatusName,
        },
      ];
    }

    return employmentStatusData.map((item) => {
      if (item.id === intStatusId) {
        return { ...item, ...values };
      }
      return item;
    });
  };

  const onFormSubmit = (values, { setFieldError, setFieldTouched }) => {
    saveCompanyDetails(
      {
        employmentStatus: getDataForSave(values),
      },
      dispatch,
      state
    ).then((response) => {
      if (!response.isSuccessful) {
        for (var i = 0; i < response.errorMessages.length; i++) {
          var _ = response.errorMessages[i];
          setFieldTouched(_.controlName, true);
          setFieldError(_.controlName, `${_.errorCode} : ${_.message}`);
        }
      } else {
        history.push(
          getAdvancedPathWithParam({
            path: MANAGE_COMPANY_ROUTES.MANAGE_EMPLOYMENT_STATUS,
            pathParam: [get(state, "flow"), companyId],
          })
        );
        dispatch(
          setManageCompanyToastInfo({
            showToast: true,
            toastMessage: "Data saved successfully",
          })
        );
      }
    });
  };

  const initialValues = {};
  return (
    <Formik
      initialValues={{
        ...initialValues,
        ...formValues,
      }}
      validationSchema={schema}
      onSubmit={onFormSubmit}
      validateOnChange={false}
      validateOnBlur={false}
    >
      {({
        handleChange,
        setFieldValue,
        handleSubmit,
        values,
        setSubmitting,
        ...rest
      }) => {
        const onDeleteClick = () => {
          setSubmitting(true);
          const employmentStatusFormValues = get(state, formName, {});
          saveCompanyDetails(
            {
              employmentStatus: employmentStatusData.filter(
                ({ id }) => id !== intStatusId
              ),
            },
            dispatch,
            state
          ).then(() => {
            dispatch(
              setManageCompanyToastInfo({
                showToast: true,
                toastMessage: `Employment Status ${get(
                  employmentStatusFormValues,
                  "employmentStatus",
                  ""
                )} deleted successfully`,
              })
            );
            history.push(
              getAdvancedPathWithParam({
                path: MANAGE_COMPANY_ROUTES.MANAGE_EMPLOYMENT_STATUS,
                pathParam: [flow, companyId],
              })
            );
          });
        };

        const buttons = [
          {
            label: "Cancel",
            variant: "secondary",
            type: "button",
            flow: [FLOW_TYPES.ADD, FLOW_TYPES.SAVE],
            link: getAdvancedPathWithParam({
              path: MANAGE_COMPANY_ROUTES.MANAGE_EMPLOYMENT_STATUS,
              pathParam: [flow, companyId],
            }),
          },
          {
            label: "Save",
            variant: "primary",
            type: "submit",
            flow: [FLOW_TYPES.ADD, FLOW_TYPES.SAVE],
          },
          {
            label: "",
            variant: "link",
            type: "button",
            flow: [FLOW_TYPES.EDIT],
            icon: faTimes,
            link: getAdvancedPathWithParam({
              path: MANAGE_COMPANY_ROUTES.MANAGE_EMPLOYMENT_STATUS,
              pathParam: [flow, companyId],
            }),
          },
          {
            label: "",
            variant: "link",
            type: "button",
            flow: [FLOW_TYPES.EDIT],
            icon: faPencilAlt,
            onClick: () =>
              history.push(
                getAdvancedPathWithParam({
                  path: MANAGE_COMPANY_ROUTES.EMPLOYMENT_STATUS,
                  pathParam: [FLOW_TYPES.SAVE, companyId, statusId],
                })
              ),
          },
          {
            label: "",
            variant: "link",
            type: "button",
            flow: [FLOW_TYPES.EDIT],
            icon: faTrashAlt,
            onClick: onDeleteClick,
          },
        ];
        return (
          <Form
            autoComplete="off"
            className="h-100"
            onSubmit={handleSubmit}
            validated={rest.submitCount > 0}
          >
            {console.log(values)}
            <ManageCompanyLayout buttons={buttons} pageFlow={flow}>
              <Row>
                <Col>
                  <Field
                    label="Employment Status Name"
                    name={fields.employmentStatus}
                    isRequired
                    value={values[fields.employmentStatusName]}
                    options={employmentStatusTypes}
                    popupContent={
                      <EmploymentStatusDropdown
                        data={employmentStatusTypes}
                        onSelect={(value, name) => {
                          setFieldValue(fields.employmentStatus, value);
                          setFieldValue(fields.employmentStatusName, name);
                        }}
                        value={values[fields.employmentStatusName]}
                        companyId={parseInt(companyId)}
                        setData={(newData) => setEmploymentStatusTypes(newData)}
                      />
                    }
                    disabled={isEdit && !isSave}
                    component={FieldDropSide}
                  />
                  <Field
                    label="Employment Status Code"
                    size="sm"
                    name={fields.employmentStatusCode}
                    type="text"
                    value={values[fields.employmentStatusCode]}
                    onChange={handleChange}
                    autoComplete="nope"
                    disabled={isEdit && !isSave}
                    component={FieldInput}                    
                    isRequired
                  />
                </Col>
              </Row>
            </ManageCompanyLayout>
          </Form>
        );
      }}
    </Formik>
  );
};

export default EmployeeClassificationsContainer;
