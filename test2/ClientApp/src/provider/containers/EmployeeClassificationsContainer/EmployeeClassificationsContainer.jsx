import React, { useContext, useState } from "react";
import { Formik, Field } from "formik";
import { get, isEmpty, find, values } from "lodash";
import { Row, Col, Form, Modal, Button } from "react-bootstrap";
import { faPencilAlt } from "@fortawesome/pro-light-svg-icons";
import {
  faTimes,
  faTrashAlt,
  faExclamationTriangle,
} from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as Yup from "yup";
import {
  ManageCompanyLayout,
  AddCompanyItemsLayout,
  AddButton,
  CsplTable as Table,
  FieldInput,
  FieldDropSide,
  DatePicker,
  Link,
} from "../../components";
import {
  MANAGE_COMPANY_ROUTES,
  manageCompanyFormNames,
  formFields,
  FLOW_TYPES,
  getPathWithParam,
  getAdvancedPathWithParam,
  usDateFormat,
  required,
} from "../../utils";
import { useRouterParams, useRequest } from "../../abstracts";
import {
  manageCompanyStore,
  setManageCompanyToastInfo,
  setManageCompanyLocalCache,
} from "../../contexts";
import { checkClassificationCanBeDeleted } from "../../services";

const columns = [
  {
    label: "Attribute Name",
    className: "column-attribute-name",
    columnName: "name",
    link: MANAGE_COMPANY_ROUTES.MANAGE_EMPLOYEE_CLASSIFICATIONS_ATTRIBUTE,
  },
  {
    label: "Value",
    className: "column-attribute-value",
    columnName: "value",
  },
];

const EmployeeClassificationsContainer = (props) => {
  const { history } = props;
  const {
    companyId,
    flow,
    classificationType,
    classificationId,
  } = useRouterParams();
  const intClassificationId = parseInt(classificationId, 10);
  const intClassificationType = parseInt(classificationType, 10);
  const { state, dispatch } = useContext(manageCompanyStore);
  const classifications = get(state, "classifications", []);

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
  const [isModalOpen, setIsModalOpen] = useState(0);

  const handleClose = () => {
    setIsModalOpen(false);
  };

  const { response: checkTypeCanBeDeleted } = useRequest({
    method: checkClassificationCanBeDeleted,
    payload: parseInt(exployeeClassificationsTypeDetails.id, 10),
    defaultResponse: false,
  });
  const attributes = get(employeeClassificationDetails, "attributes", []);

  const formName =
    manageCompanyFormNames.EMPLOYEE_CLASSIFICATIONS_MANAGE_COMPANY;

  const fields = formFields[formName];

  const schema = Yup.object().shape({
    value: Yup.string()
      .required("CM026 : Required")
      .max(
        50,
        "CM028 : Classification Name length should not exceed 50 characters"
      )
      .test(
        "value",
        "CM036 : Classification Name must be unique within the Classification Type",
        (val) => !checkClassificationName(val)
      ),
    code: Yup.string()
      .required("CM031 : Required")
      .max(
        10,
        "CM032 : Classification code length should not exceed 10 characters"
      )
      .test(
        "code",
        "CM033 : Classification Code must be unique within the Classification Type",
        (val) => !checkClassificationCode(val)
      ),
    effectiveStartDate: Yup.date().nullable(),
    effectiveEndDate: Yup.date()
      .nullable()
      .when("effectiveStartDate", {
        is: null,
        otherwise: Yup.date().when("effectiveEndDate", {
          is: null,
          otherwise: Yup.date().min(
            Yup.ref("effectiveStartDate"),
            "CM037:Effective End Date must be after the Effective Start Date"
          ),
        }),
      }),
  });

  const goBack = (flow) => {
    history.push(
      getAdvancedPathWithParam({
        path: MANAGE_COMPANY_ROUTES.EMPLOYEE_CLASSIFICATIONS_TYPE,
        pathParam: [flow || get(state, "flow"), companyId, classificationType],
      })
    );
  };

  const onCancelClick = () => {
    history.push(
      getAdvancedPathWithParam({
        path: MANAGE_COMPANY_ROUTES.EMPLOYEE_CLASSIFICATIONS_TYPE,
        pathParam: [flow, companyId, classificationType],
      })
    );
  };

  const goForward = (newclassificationId, flowType) => {
    const addAttrPathParams = [classificationType, newclassificationId, 0];
    history.push(
      getAdvancedPathWithParam({
        path: MANAGE_COMPANY_ROUTES.MANAGE_EMPLOYEE_CLASSIFICATIONS_ATTRIBUTE,
        pathParam: [flowType, companyId, ...addAttrPathParams],
      })
    );
  };

  const getValuesForSave = (values) => {
    const updatedClassifications = classifications.map((item, index) => {
      if (index === intClassificationType) {
        const currentClassificationCodes = get(
          item,
          "employeeClassificationCodes",
          []
        );
        let employeeClassificationCodes = [];

        if (classificationId) {
          employeeClassificationCodes = currentClassificationCodes.map(
            (codeItem, codeIndex) => {
              if (codeIndex === intClassificationId) {
                return {
                  ...codeItem,
                  ...values,
                };
              }
              return codeItem;
            }
          );
          let modifiedEntry = employeeClassificationCodes.splice(
            intClassificationId,
            1
          );
          employeeClassificationCodes.unshift(...modifiedEntry);
        } else {
          employeeClassificationCodes.push(
            { ...values },
            ...currentClassificationCodes
          );
        }
        return {
          ...item,
          employeeClassificationCodes,
        };
      }
      return {
        ...item,
      };
    });
    return updatedClassifications;
  };

  const getValuesForDelete = () => {
    const updatedClassifications = classifications.map((item, index) => {
      if (index === intClassificationType) {
        const currentClassificationCodes = get(
          item,
          "employeeClassificationCodes",
          []
        );
        let employeeClassificationCodes = [];

        if (classificationId) {
          currentClassificationCodes.map((codeItem, codeIndex) => {
            if (codeIndex !== intClassificationId) {
              employeeClassificationCodes.push({
                ...codeItem,
              });
            }
            return codeItem;
          });
        }
        return {
          ...item,
          employeeClassificationCodes,
        };
      }
      return {
        ...item,
      };
    });
    return updatedClassifications;
  };

  const checkClassificationCode = (val) => {
    const temp = classificationCodes.map((item, index) => {
      if (item.code === val && index !== intClassificationId) return true;
      else return false;
    });
    return temp.includes(true);
  };

  const checkClassificationName = (val) => {
    const temp = classificationCodes.map((item, index) => {
      if (item.value === val && index !== intClassificationId) return true;
      else return false;
    });
    return temp.includes(true);
  };

  const onSaveFormValues = (values) => {
    // console.log(values);
    const updatedData = getValuesForSave(values);
    // console.log(updatedData);
    dispatch(
      setManageCompanyLocalCache({
        model: "classifications",
        data: updatedData,
      })
    );
    return updatedData;
  };

  const onSaveClick = (values) => {
    onSaveFormValues(values);
    goBack(flow || get(state, "flow"));
  };

  const onDeleteClick = () => {
    if (!checkTypeCanBeDeleted) {
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
          toastMessage: `Employee Classification ${get(
            formValues,
            "classificationName",
            ""
          )} deleted successfully`,
        })
      );
      goBack(FLOW_TYPES.SAVE);
    } else {
      setIsModalOpen(true);
    }
  };
  const isEdit = flow === FLOW_TYPES.EDIT;
  const isSave = flow === FLOW_TYPES.SAVE;

  const initialValues = {};
  return (
    <Formik
      initialValues={{
        ...initialValues,
        ...employeeClassificationDetails,
      }}
      validationSchema={schema}
      onSubmit={onSaveClick}
      enableReinitialize
      validateOnChange={false}
      validateOnBlur={false}
    >
      {({
        handleChange,
        setFieldValue,
        setValues,
        handleSubmit,
        submitForm,
        errors,
        values,
        validateForm,
        setTouched,
        setSubmitting,
        ...rest
      }) => {
        const onAddClick = (values) => {
          setSubmitting(true);
          var updatedValues = onSaveFormValues(values);
          var updatedExployeeClassificationsTypeDetails = get(
            updatedValues,
            classificationType,
            {}
          );

          var updateClassificationCodes = get(
            updatedExployeeClassificationsTypeDetails,
            "employeeClassificationCodes",
            []
          );

          var newClassificationId =
            classificationId === undefined
              ? updateClassificationCodes.length - 1
              : classificationId;

          window.setTimeout(
            () => {
              history.push(
                getAdvancedPathWithParam({
                  path:
                    MANAGE_COMPANY_ROUTES.MANAGE_EMPLOYEE_CLASSIFICATIONS_ATTRIBUTE,
                  pathParam: [
                    FLOW_TYPES.ADD,
                    companyId,
                    classificationType,
                    newClassificationId,
                  ],
                })
              );
            },
            //onSaveFormValues(values);
            //goForward(newClassificationId, FLOW_TYPES.ADD);},
            100
          );
        };

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
            onClick: () => {
              history.push(
                getAdvancedPathWithParam({
                  path: MANAGE_COMPANY_ROUTES.EMPLOYEE_CLASSIFICATIONS,
                  pathParam: [
                    FLOW_TYPES.SAVE,
                    companyId,
                    classificationType,
                    classificationId,
                  ],
                })
              );
            },
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

        const onDaySelected = (fieldName, value) => {
          setFieldValue(fieldName, value);
        };

        const onEditAttributes = (e, link, attrId) => {
          e.preventDefault();
          setSubmitting(true);

          dispatch(
            setManageCompanyLocalCache({
              model: "classifications",
              data: getValuesForSave(values),
            })
          );
          window.setTimeout(() => {
            history.push(
              getPathWithParam({
                path: link,
                pathParam: [
                  FLOW_TYPES.EDIT,
                  companyId,
                  classificationType,
                  classificationId,
                  attrId,
                ],
              })
            );
          }, 100);
        };

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
                !isEmpty(employeeClassificationDetails) &&
                "Employee Classification"
              }
            >
              <Row>
                <Col>
                  <Field
                    label="Classification name"
                    name={fields.classificationName}
                    isRequired
                    type="text"
                    value={values[fields.classificationName]}
                    onChange={handleChange}
                    autoComplete="nope"
                    disabled={isEdit && !isSave}
                    component={FieldInput}
                  />

                  <Field
                    label="Classification Code"
                    name={fields.classificationCode}
                    size="xs"
                    isRequired
                    type="text"
                    value={values[fields.classificationCode]}
                    onChange={handleChange}
                    autoComplete="nope"
                    disabled={isEdit && !isSave}
                    component={FieldInput}
                  />
                  <Field
                    label="Effective start date"
                    name={fields.effectiveStartDate}
                    size="smd"
                    value={usDateFormat(values[fields.effectiveStartDate])}
                    isDatePicker
                    onClear={() =>
                      onDaySelected(fields.effectiveStartDate, null)
                    }
                    popupContent={
                      <DatePicker
                        onDayClick={(value) =>
                          onDaySelected(fields.effectiveStartDate, value)
                        }
                        value={values[fields.effectiveStartDate]}
                      />
                    }
                    disabled={isEdit && !isSave}
                    component={FieldDropSide}
                  />
                  <Field
                    label="Effective end date"
                    name={fields.effectiveEndDate}
                    size="smd"
                    value={usDateFormat(values[fields.effectiveEndDate])}
                    isDatePicker
                    onClear={() => onDaySelected(fields.effectiveEndDate, null)}
                    popupContent={
                      <DatePicker
                        onDayClick={(value) =>
                          onDaySelected(fields.effectiveEndDate, value)
                        }
                        value={values[fields.effectiveEndDate]}
                      />
                    }
                    disabled={isEdit && !isSave}
                    component={FieldDropSide}
                  />
                </Col>
              </Row>
              <div className="line-separator"></div>
              <Row>
                <Col>
                  <div className="w-100 bg-white p-3">
                    <div className="d-flex align-items-center">
                      <h5 className="m-0">Attributes</h5>
                      <div className="ml-auto">
                        <AddButton
                          disabled={isEdit && !isSave}
                          onAddClick={() => onAddClick(values)}
                        />
                      </div>
                    </div>

                    {classificationId && !isEmpty(attributes) && (
                      <div className="py-3">
                        <Table>
                          <Table.Thead>
                            <Table.Tr>
                              {columns.map((item, index) => {
                                return (
                                  <Table.Th
                                    key={index}
                                    className={item.className}
                                    isSortable={item.isSortable}
                                  >
                                    {item.label}
                                  </Table.Th>
                                );
                              })}
                            </Table.Tr>
                          </Table.Thead>
                          <Table.Tbody>
                            {attributes.map((attribute, index) => {
                              return (
                                <Table.Tr key={index}>
                                  {columns.map((item, cellIndex) => {
                                    return (
                                      <Table.Td
                                        key={cellIndex}
                                        className={item.className}
                                      >
                                        {!isEmpty(item.link) ? (
                                          <Link
                                            onClick={(e) =>
                                              onEditAttributes(
                                                e,
                                                item.link,
                                                index
                                              )
                                            }
                                          >
                                            {attribute[item.columnName]}
                                          </Link>
                                        ) : (
                                          attribute[item.columnName]
                                        )}
                                      </Table.Td>
                                    );
                                  })}
                                </Table.Tr>
                              );
                            })}
                          </Table.Tbody>
                        </Table>
                      </div>
                    )}
                  </div>
                </Col>
              </Row>
              {(!classificationId || isEmpty(attributes)) && (
                <Row>
                  <Col>
                    <AddCompanyItemsLayout
                      content="No attributes created for this classification"
                      buttonLabel="Add Attribute"
                      className="mt-2"
                      onPrimaryClick={() => onAddClick(values)}
                      disabled={isEdit && !isSave}
                    />
                  </Col>
                </Row>
              )}

              <Modal show={isModalOpen} onHide={handleClose}>
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
                      <p>
                        The Employee Classification Code has dependencies and
                        cannot be removed.
                      </p>
                      <br />

                      <Button className="cancel-btn" onClick={handleClose}>
                        Ok
                      </Button>
                    </div>
                  </div>
                </Modal.Body>
              </Modal>
            </ManageCompanyLayout>
          </Form>
        );
      }}
    </Formik>
  );
};

export default EmployeeClassificationsContainer;
