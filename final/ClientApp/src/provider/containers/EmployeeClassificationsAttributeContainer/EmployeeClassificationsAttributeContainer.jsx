import React, { useContext } from "react";
import { get, find, isEmpty, max } from "lodash";
import { Row, Col, Form } from "react-bootstrap";
import { faPencilAlt } from "@fortawesome/pro-light-svg-icons";
import { faTimes, faTrashAlt } from "@fortawesome/pro-light-svg-icons";
import * as Yup from "yup";
import { Field, Formik } from "formik";
import {
  MANAGE_COMPANY_ROUTES,
  manageCompanyFormNames,
  formFields,
  FLOW_TYPES,
  getAdvancedPathWithParam,
  required,
} from "../../utils";
import { useRouterParams } from "../../abstracts";
import { ManageCompanyLayout, FieldInput } from "../../components";
import {
  manageCompanyStore,
  setManageCompanyToastInfo,
  setManageCompanyLocalCache,
} from "../../contexts";

const EmployeeClassificationsContainer = (props) => {
  const { history } = props;
  const { state, dispatch } = useContext(manageCompanyStore);
  const {
    companyId,
    flow,
    classificationType,
    classificationId,
    attributeId,
  } = useRouterParams();
  const classifications = get(state, "classifications", []);
  const intClassificationId = parseInt(classificationId, 10);
  const intClassificationType = parseInt(classificationType, 10);
  const intAttributeId = parseInt(attributeId, 10);

  const exployeeClassificationsTypeDetails = get(
    classifications,
    intClassificationType,
    {}
  );
  const classificationCodes = get(
    exployeeClassificationsTypeDetails,
    "employeeClassificationCodes",
    []
  );

  const employeeClassificationDetails = get(
    classificationCodes,
    intClassificationId,
    {}
  );
  const attributes = get(employeeClassificationDetails, "attributes", []);
  const attributeDetails = get(attributes, intAttributeId, {});

  const schema = Yup.object().shape({
    name: Yup.string()
      .required("CM056 : Required")
      .max(50, "CM057 : Attribute Name length should not exceed 50 characters.")
      .test(
        "name",
        "CM058 : Attribute name should be unique in nature",
        (val) => !checkAttributeName(val)
      ),
    value: Yup.string()
      .required("CM059 : Required")
      .max(
        10,
        "CM060 : Attribute Value length should not exceed 10 characters."
      ),
  });
  const checkAttributeName = (val) => {
    const temp = attributes.map((item, index) => {
      if (item.name === val && index !== intAttributeId) return true;
      else return false;
    });
    return temp.includes(true);
  };

  const formName =
    manageCompanyFormNames.MANAGE_EMPLOYEE_CLASSIFICATIONS_ATTRIBUTE_MANAGE_COMPANY;
  const fields = formFields[formName];

  const goBack = (flowType) => {
    history.push(
      getAdvancedPathWithParam({
        path: MANAGE_COMPANY_ROUTES.EMPLOYEE_CLASSIFICATIONS,
        pathParam: [
          flowType,
          companyId,
          intClassificationType,
          intClassificationId,
        ],
      })
    );
  };

  const onCancelClick = () => {
    history.push(
      getAdvancedPathWithParam({
        path: MANAGE_COMPANY_ROUTES.EMPLOYEE_CLASSIFICATIONS,
        pathParam: [flow, companyId, classificationType, classificationId],
      })
    );
  };

  const getValuesForSave = (values) => {
    const updatedClassificationsAttrs = classifications.map((item, index) => {
      if (index === intClassificationType) {
        const currentClassificationCodes = get(
          item,
          "employeeClassificationCodes",
          []
        );
        return {
          ...item,
          employeeClassificationCodes: currentClassificationCodes.map(
            (codeItem, codeIndex) => {
              const currentClassificationAttributes = get(
                codeItem,
                "attributes",
                []
              );
              if (codeIndex === intClassificationId) {
                let attributes = [];

                if (attributeId) {
                  attributes = currentClassificationAttributes.map(
                    (attrItem, attrIndex) => {
                      if (attrIndex === intAttributeId) {
                        return {
                          ...attrItem,
                          ...values,
                        };
                      }
                      return attrItem;
                    }
                  );
                } else {
                  attributes.push(...currentClassificationAttributes, {
                    ...values,
                  });
                }
                return {
                  ...codeItem,
                  attributes,
                };
              }
              return codeItem;
            }
          ),
        };
      }
      return item;
    });

    return updatedClassificationsAttrs;
  };

  const getValuesForDelete = () => {
    const updatedClassificationsAttrs = classifications.map((item, index) => {
      if (index === intClassificationType) {
        const currentClassificationCodes = get(
          item,
          "employeeClassificationCodes",
          []
        );
        return {
          ...item,
          employeeClassificationCodes: currentClassificationCodes.map(
            (codeItem, codeIndex) => {
              const currentClassificationAttributes = get(
                codeItem,
                "attributes",
                []
              );
              if (codeIndex === intClassificationId) {
                let attributes = [];

                if (attributeId) {
                  currentClassificationAttributes.forEach(
                    (attrItem, attrIndex) => {
                      if (attrIndex !== intAttributeId) {
                        attributes.push({
                          ...attrItem,
                        });
                      }
                    }
                  );
                }
                return {
                  ...codeItem,
                  attributes,
                };
              }
              return codeItem;
            }
          ),
        };
      }
      return item;
    });

    return updatedClassificationsAttrs;
  };

  const onSaveFormValues = (values) => {
    dispatch(
      setManageCompanyLocalCache({
        model: "classifications",
        data: getValuesForSave(values),
      })
    );
    // dispatch(setManageCompanySetClassificationData(getValuesForSave(values)));
  };

  const onDeleteClick = () => {
    const formValues = get(state, formName, {});
    dispatch(
      setManageCompanyLocalCache({
        model: "classifications",
        data: getValuesForDelete(),
      })
    );
    dispatch(
      setManageCompanyToastInfo({
        showToast: true,
        toastMessage: `Attribute ${get(
          formValues,
          "attributeName",
          ""
        )} deleted successfully`,
      })
    );
    goBack(FLOW_TYPES.SAVE);
  };

  const onSaveClick = (values) => {
    onSaveFormValues(values);
    goBack(FLOW_TYPES.SAVE);
  };

  const isEdit = flow === FLOW_TYPES.EDIT;
  const isSave = flow === FLOW_TYPES.SAVE;

  const initialValues = {};
  return (
    <Formik
      initialValues={{
        ...initialValues,
        ...attributeDetails,
      }}
      validationSchema={schema}
      onSubmit={onSaveClick}
      validateOnChange={false}
      validateOnBlur={false}
    >
      {({
        handleChange,
        setFieldValue,
        handleSubmit,
        values,
        validateForm,
        setTouched,
        ...rest
      }) => {
        const buttons = [
          {
            label: "Cancel",
            variant: "secondary",
            type: "button",
            flow: [FLOW_TYPES.ADD, FLOW_TYPES.SAVE],
            onClick: onCancelClick,
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
            onClick: onCancelClick,
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
                  path:
                    MANAGE_COMPANY_ROUTES.MANAGE_EMPLOYEE_CLASSIFICATIONS_ATTRIBUTE,
                  pathParam: [
                    FLOW_TYPES.SAVE,
                    companyId,
                    classificationType,
                    classificationId,
                    attributeId,
                  ],
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
            <ManageCompanyLayout
              buttons={buttons}
              pageFlow={flow}
              layoutHeader={
                !isEmpty(employeeClassificationDetails) && "Attribute"
              }
            >
              <Row>
                <Col>
                  <Field
                    isRequired
                    label="Attribute name"
                    name={fields.attributeName}
                    type="text"
                    value={values[fields.attributeName]}
                    onChange={handleChange}
                    autoComplete="nope"
                    disabled={isEdit && !isSave}
                    validate={required}
                    component={FieldInput}
                  />

                  <Field
                    isRequired
                    label="Value"
                    name={fields.attributeValue}
                    type="text"
                    value={values[fields.attributeValue]}
                    onChange={handleChange}
                    autoComplete="nope"
                    disabled={isEdit && !isSave}
                    validate={required}
                    component={FieldInput}
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
