import React, { useContext, useState } from "react";
import { Field, Formik } from "formik";
import { Link } from "react-router-dom";
import { get, isEmpty, parseInt, union } from "lodash";
import { Row, Col, Form, Button, Modal } from "react-bootstrap";
import { faPencilAlt } from "@fortawesome/pro-light-svg-icons";
import {
  faTimes,
  faTrashAlt,
  faExclamationTriangle,
} from "@fortawesome/pro-light-svg-icons";
import { checkClassificationCanBeDeleted } from "../../services";
import * as Yup from "yup";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  ManageCompanyLayout,
  EmployeeClassificationTypeDropdown,
  AddCompanyItemsLayout,
  AddButton,
  CsplTable as Table,
  FieldDropSide,
  FieldButtonGroup,
} from "../../components";
import {
  ROUTES,
  MANAGE_COMPANY_ROUTES,
  manageCompanyFormNames,
  formFields,
  yesNoOptions,
  FLOW_TYPES,
  getAdvancedPathWithParam,
  returnOnlyIfBoolean,
  usDateFormat,
  normaliseClassificationValues,
  toOptionValuesFromMapper,
  OPTIONS_DATA_MAPPER,
  tranformListToDropdownValues,
} from "../../utils";
import { useDeepEffect, useRouterParams, useRequest } from "../../abstracts";
import {
  manageCompanyStore,
  setManageCompanyToastInfo,
  saveCompanyDetails,
  getMasterClassificationTypesAction,
  setManageCompanyLocalCache,
} from "../../contexts";

const columns = [
  {
    label: "Classification Name",
    className: "column-classification-name",
    columnName: "value",
    isSortable: true,
    orderBy: "",
    link: MANAGE_COMPANY_ROUTES.EMPLOYEE_CLASSIFICATIONS,
  },
  {
    label: "Classification Code",
    className: "column-class-code",
    columnName: "code",
  },
  {
    label: "Start Date",
    className: "column-start-date",
    columnName: "effectiveStartDate",
    type: "date",
  },
  {
    label: "End Date",
    className: "column-end-date",
    columnName: "effectiveEndDate",
    type: "date",
  },
];

const EmployeeClassificationsTypesContainer = (props) => {
  const { history, setFieldError } = props;
  const [isAddClassifationError, setIsAddClassifationError] = useState(false);
  const [addClassifationError, setAddClassifationError] = useState("");
  const { companyId, flow, classificationType } = useRouterParams();
  const intClassificationType = parseInt(classificationType, 10);

  const { state, dispatch } = useContext(manageCompanyStore);
  const classificationsApiData = get(state, "api.data.classifications", []);
  const classifications = get(state, "classifications", []);
  const exployeeClassificationsTypeDetails = get(
    classifications,
    intClassificationType,
    {}
  );
  const [masterClassificationTypes, setMasterClassificationTypes] = useState(
    []
  );
  const classificationCodes = get(
    exployeeClassificationsTypeDetails,
    "employeeClassificationCodes",
    []
  );

  const { response: checkTypeCanBeDeleted } = useRequest({
    method: checkClassificationCanBeDeleted,
    payload: parseInt(exployeeClassificationsTypeDetails.id, 10),
    defaultResponse: false,
  });

  const formName =
    manageCompanyFormNames.EMPLOYEE_CLASSIFICATIONS_TYPE_MANAGE_COMPANY;

  const fields = formFields[formName];
  const [isModalOpen, setIsModalOpen] = useState(0);
  const handleClose = () => {
    setIsModalOpen(false);
  };

  useDeepEffect(() => {
    if (isEmpty(exployeeClassificationsTypeDetails)) {
      dispatch(
        setManageCompanyLocalCache({
          model: "classifications",
          data: classificationsApiData,
        })
      );
    }
  }, [classificationsApiData]);

  const getValuesForSave = (values) => {
    var newclassification = true;
    var updateClassifications = classifications
      ? classifications.map((item, index) => {
          if (index === intClassificationType) {
            newclassification = false;
            return {
              ...item,
              ...values,
            };
          }
          return {
            ...item,
          };
        })
      : [];
    console.log(newclassification);
    if (newclassification) updateClassifications.push(values);
    return updateClassifications;
  };

  const onDeleteClick = () => {
    if (!checkTypeCanBeDeleted) {
      const normalisedClassification = normaliseClassificationValues(
        classifications
      );
      const classificationsAfterDelete = normalisedClassification.filter(
        (_, index) => index !== intClassificationType
      );
      saveCompanyDetails(
        { classifications: classificationsAfterDelete },
        dispatch,
        state
      ).then(() => {
        const formValues = get(state, formName, {});
        dispatch(
          setManageCompanyToastInfo({
            showToast: true,
            toastMessage: `Employee Classification Type deleted successfully`,
          })
        );
        history.push(
          getAdvancedPathWithParam({
            path: MANAGE_COMPANY_ROUTES.MANAGE_EMPLOYEE_CLASSIFICATIONS,
            pathParam: [FLOW_TYPES.EDIT, companyId],
          })
        );
      });
    } else {
      setIsModalOpen(true);
    }
  };

  const onCancelClick = () => {
    history.push(
      getAdvancedPathWithParam({
        path: MANAGE_COMPANY_ROUTES.MANAGE_EMPLOYEE_CLASSIFICATIONS,
        pathParam: [FLOW_TYPES.EDIT, companyId],
      })
    );
  };

  const onFormSubmit = (values, { setFieldError, setFieldTouched }) => {
    var updateCLassifications = getValuesForSave(values);
    const normalisedClassification = normaliseClassificationValues(
      updateCLassifications
    );
    saveCompanyDetails(
      { classifications: normalisedClassification },
      dispatch,
      state
    ).then((response) => {
      if (!response.isSuccessful) {
        for (var i = 0; i < response.errorMessages.length; i++) {
          var _ = response.errorMessages[i];
          setFieldTouched(_.controlName, true);
          setFieldError(_.controlName, `${_.errorCode} : ${_.message}`);
          if (_.controlName === "classification") {
            setIsAddClassifationError(true);
            setAddClassifationError(`${_.errorCode} : ${_.message}`);
          }
        }
      } else {
        history.push(
          getAdvancedPathWithParam({
            path: MANAGE_COMPANY_ROUTES.MANAGE_EMPLOYEE_CLASSIFICATIONS,
            pathParam: [FLOW_TYPES.EDIT, companyId],
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

  const editClick = () => {
    history.push(
      getAdvancedPathWithParam({
        path: MANAGE_COMPANY_ROUTES.EMPLOYEE_CLASSIFICATIONS_TYPE,
        pathParam: [FLOW_TYPES.SAVE, companyId, classificationType],
      })
    );
  };

  const isEdit = flow === FLOW_TYPES.EDIT;
  const isSave = flow === FLOW_TYPES.SAVE;

  const initialValues = {
    [fields.clientEligibilityClassificationRequired]: false,
    [fields.classificationTypeRequired]: false,
    [fields.multipleSelectionsAllowed]: false,
    [fields.clientEligibilityClassificationRequired]: false,
  };

  return (
    <Formik
      initialValues={{
        ...initialValues,
        ...exployeeClassificationsTypeDetails,
      }}
      onSubmit={onFormSubmit}
      enableReinitialize
      validateOnChange={false}
      validateOnBlur={false}
    >
      {({
        handleChange,
        setFieldValue,
        setValues,
        handleSubmit,
        setSubmitting,
        values,
        ...rest
      }) => {
        const buttons = [
          {
            //link: ROUTES.COMPANY,
            label: "Cancel",
            variant: "secondary",
            type: "button",
            flow: [FLOW_TYPES.ADD, FLOW_TYPES.SAVE],
            // link: getAdvancedPathWithParam({
            //   path: MANAGE_COMPANY_ROUTES.MANAGE_EMPLOYEE_CLASSIFICATIONS,
            //   pathParam: [flow, companyId],
            // }),
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
            link: getAdvancedPathWithParam({
              path: MANAGE_COMPANY_ROUTES.MANAGE_EMPLOYEE_CLASSIFICATIONS,
              pathParam: [flow, companyId],
            }),
          },
          {
            label: "",
            variant: "link",
            type: "button",
            flow: [FLOW_TYPES.EDIT],
            icon: faPencilAlt,
            onClick: editClick,
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

        const onAddClick = (values) => {
          setSubmitting(true);
          var updatedData = getValuesForSave(values);
          var newClassificationType =
            classificationType === undefined
              ? updatedData.length - 1
              : intClassificationType;
          dispatch(
            setManageCompanyLocalCache({
              model: "classifications",
              data: updatedData,
            })
          );
          window.setTimeout(() => {
            history.push(
              getAdvancedPathWithParam({
                path: MANAGE_COMPANY_ROUTES.EMPLOYEE_CLASSIFICATIONS,
                pathParam: [FLOW_TYPES.ADD, companyId, newClassificationType],
              })
            );
          }, 100);
        };

        const onEditClassifications = (e, link, classificationId) => {
          e.preventDefault();
          setSubmitting(true);
          const updatedData = getValuesForSave(values);
          dispatch(
            setManageCompanyLocalCache({
              model: "classifications",
              data: updatedData,
            })
          );
          window.setTimeout(() => {
            history.push(
              getAdvancedPathWithParam({
                path: link,
                pathParam: [
                  FLOW_TYPES.EDIT,
                  companyId,
                  classificationType,
                  classificationId,
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
              blockNavigation={
                exployeeClassificationsTypeDetails.id &&
                isEmpty(classificationCodes)
              }
            >
              <Row>
                <Col>
                  <Field
                    isRequired
                    label="Classification Type"
                    name={fields.employeeClassificationType}
                    value={values[fields.classificationName]}
                    options={masterClassificationTypes}
                    popupContent={
                      <EmployeeClassificationTypeDropdown
                        data={masterClassificationTypes}
                        classificationTypeName={
                          fields.employeeClassificationType
                        }
                        clientEligibilityClassificationName={
                          fields.clientClassificationEligibility
                        }
                        onSelect={(value, name) => {
                          setFieldValue(
                            fields.employeeClassificationType,
                            value
                          );
                          setFieldValue(fields.classificationName, name);
                        }}
                        setData={(newData) =>
                          setMasterClassificationTypes(newData)
                        }
                        value={values[fields.classificationName]}
                        companyId={parseInt(companyId)}
                      />
                    }
                    disabled={isEdit && !isSave}
                    component={FieldDropSide}
                  />
                  <Field
                    isRequired
                    label="Client eligibility classification"
                    size="sm"
                    name={fields.clientEligibilityClassificationRequired}
                    options={yesNoOptions}
                    selectedValue={returnOnlyIfBoolean(
                      values[fields.clientEligibilityClassificationRequired]
                    )}
                    onChange={(value) => {
                      setFieldValue(
                        fields.clientEligibilityClassificationRequired,
                        value
                      );
                    }}
                    disabled={isEdit && !isSave}
                    component={FieldButtonGroup}
                  />
                  <Field
                    label="Classification type required?"
                    name={fields.classificationTypeRequired}
                    isRequired
                    size="sm"
                    options={yesNoOptions}
                    selectedValue={returnOnlyIfBoolean(
                      values[fields.classificationTypeRequired]
                    )}
                    onChange={(value) => {
                      setFieldValue(fields.classificationTypeRequired, value);
                    }}
                    disabled={isEdit && !isSave}
                    component={FieldButtonGroup}
                  />
                  <Field
                    label="Multiple selections allowed?"
                    name={fields.multipleSelectionsAllowed}
                    size="sm"
                    isRequired
                    options={yesNoOptions}
                    selectedValue={returnOnlyIfBoolean(
                      values[fields.multipleSelectionsAllowed]
                    )}
                    onChange={(value) => {
                      setFieldValue(fields.multipleSelectionsAllowed, value);
                    }}
                    disabled={isEdit && !isSave}
                    component={FieldButtonGroup}
                  />
                </Col>
              </Row>
              <div className="line-separator"></div>
              <Row>
                <Col>
                  <div className="w-100 bg-white p-3">
                    <div className="d-flex align-items-center">
                      <h5 className="m-0">Employee Classification</h5>
                      <div className="ml-auto">
                        <AddButton
                          disabled={isEdit && !isSave}
                          onAddClick={() => onAddClick(values)}
                        />
                      </div>
                    </div>

                    {classificationType && !isEmpty(classificationCodes) && (
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
                            {classificationCodes.map(
                              (classification, index) => {
                                return (
                                  <Table.Tr key={index}>
                                    {columns.map((item, cellIndex) => {
                                      const getContent = () => {
                                        if (item.link) {
                                          return (
                                            <Link
                                              onClick={(e) =>
                                                onEditClassifications(
                                                  e,
                                                  item.link,
                                                  index
                                                )
                                              }
                                            >
                                              {classification[
                                                item.columnName
                                              ] ?? "-"}
                                            </Link>
                                          );
                                        }

                                        if (item.type === "date") {
                                          return (
                                            usDateFormat(
                                              classification[item.columnName]
                                            ) ?? "-"
                                          );
                                        }
                                        return (
                                          classification[item.columnName] ?? "-"
                                        );
                                      };
                                      return (
                                        <Table.Td
                                          key={cellIndex}
                                          className={item.className}
                                        >
                                          {getContent()}
                                        </Table.Td>
                                      );
                                    })}
                                  </Table.Tr>
                                );
                              }
                            )}
                          </Table.Tbody>
                        </Table>
                      </div>
                    )}
                  </div>
                </Col>
              </Row>
              {(!classificationType || isEmpty(classificationCodes)) && (
                <Row>
                  <Col>
                    <AddCompanyItemsLayout
                      content="No Employee Classfication created for this classifiction type."
                      buttonLabel="Add Employee Classfication"
                      className="mt-2"
                      showError={isAddClassifationError}
                      errorMessage={addClassifationError}
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
                        The Employee Classification has dependencies and cannot
                        be removed.
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

export default EmployeeClassificationsTypesContainer;
