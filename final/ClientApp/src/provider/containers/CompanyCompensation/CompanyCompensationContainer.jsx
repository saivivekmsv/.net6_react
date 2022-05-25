import React, { useContext, useEffect, useState } from "react";
import { Field, Formik, isEmptyArray, FieldArray } from "formik";
import { get, trim, upperFirst, isEmpty } from "lodash";
import * as Yup from "yup";
import { Form, Modal, Button } from "react-bootstrap";
import {
  faCheck,
  faTimes,
  faTrash,
  faPen,
  faPencilAlt,
  faCheckCircle,
} from "@fortawesome/pro-solid-svg-icons";

import { faExclamationTriangle } from "@fortawesome/pro-light-svg-icons";

import {
  ManageCompanyLayout,
  CsplTable as Table,
  FieldButtonGroup,
  FieldInput,
} from "../../components";
import {
  ROUTES,
  MANAGE_COMPANY_ROUTES,
  manageCompanyFormNames,
  formFields,
  FLOW_TYPES,
  getAdvancedPathWithParam,
  getFlowBasedFormValues,
  usDateFormat,
  errors,
  required,
  FORM_PLACEHOLDERS,
  getFormattedPhone,
  getFormattedZip,
  stripHyphenForApi,
  returnOnlyIfBoolean,
} from "../../utils";
import {
  manageCompanyStore,
  saveCompanyDetails,
  setManageCompanyFlow,
  setManageCompanyToastInfo,
} from "../../contexts";
import {
  getCheckCompanyNameExists,
  getCheckEinNumberExists,
} from "../../services";
// import states from "../../mocks/states.json";
import { useRouterParams } from "../../abstracts";
import businessTypes from "../../mocks/businessTypes.json";
import months from "../../mocks/months.json";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const columns = [
  {
    label: "Compensation categories",
    className: "compensation-categori",
    columnName: "name",
  },
  {
    label: "Gross compensation",
    className: "gross-compensation",
    columnName: "balance",
  },
  {
    label: "Action",
    className: "action-btn",
    columnName: "balance",
  },
];

const EditMode = [
  {
    label: "Include",
    value: true,
  },
  {
    label: "Exclude",
    value: false,
  },
];

const schema = Yup.object().shape({});

const CompanyCompensationContainer = (props) => {
  const { history } = props;
  const [showToast, setToast] = useState(false);
  const [toastMessage, setMessage] = useState("Do you wish to Delete");
  const [showValidToast, setValidToast] = useState(false);
  const [editToggle, setEdit] = useState(false);
  const [editField, setEditField] = useState(0);
  const [addCategory, setCategory] = useState(false);
  //var initialValues = { name: "" , isIncluded: false};
  const { companyId, flow } = useRouterParams();
  const { state, dispatch } = useContext(manageCompanyStore);
  const [items, setnewItems] = useState([]);
  const formName = manageCompanyFormNames.MANAGE_COMPANY_COMPENSATIONS;
  const fields = formFields[formName];
  const [addbtn, setbtn] = useState({
    label: "Add Category",
    variant: "primary",
    type: "button",
    onClick: onAddClick,
  });
  const [categoryName, setCategoryName] = useState("");
  const [toastValidationMessage, setToastValidationMessage] = useState("");
  const [currlist, setCurrList] = useState();
  const [currValues, setCurrValues] = useState();
  const [currIndex, setCurrIndex] = useState();

  const [tabData, setTabData] = useState(
    get(state, "api.data.compensationCategories", [])
  );
  const [currentTabData, setCurrentTabData] = useState(
    get(state, "api.data.compensationCategories", [])
  );

  const onFormSubmit = (values) => {
    console.log(values, "final");
  };

  //console.log(props);
  const onAddClick = () => {
    const { history } = props;
    setCategory(!addCategory);
    setEdit(editToggle);
    setEditField([]);
  };

  const deleteCall = (values, list, i) => {
    setCategoryName(list.name);
    setToast(!showToast);
    const newCompensations = tabData.filter((e) => e.id != list.id);
    setnewItems(newCompensations);
    setCurrList(list);
    setCurrValues(values);
    setCurrIndex(i);
  };

  const deleteClick = () => {
    setToast(!showToast);
    setCategoryName("");
    var isIncluded = addCategory
      ? get(currValues, "isIncluded", "")
      : currlist.isIncluded;
    var compCategory = get(currValues, "compensationCategories", []);
    console.log(compCategory, "compCategory");
    //var tryAddin
    var iscurrentIitemISLastIncluded =
      // compCategory.length > 0 &&
      compCategory.filter((item) => item.isIncluded).length == 1 &&
      compCategory[currIndex].isIncluded == true
        ? true
        : false;
    var isIncls =
      compCategory.length == 1
        ? compCategory.some((el) => el.isIncluded)
        : compCategory.length > 0
        ? compCategory.some((el) => el.isIncluded)
        : isIncluded;

    //  var isIncls = compCategory.length ==1 ? compCategory.some(el => el.isIncluded) : compCategory.length> 0 ? compCategory.some(el => el.isIncluded) : isIncluded ;
    console.log(isIncls, "isIncls");
    console.log(currlist, "currlist");
    if (iscurrentIitemISLastIncluded || !isIncls) {
      setToastValidationMessage(
        "Please select at least one category for Gross Compensation calculation"
      );
      setValidToast(true);
      return false;
    }
    saveCompanyDetails(
      {
        id: companyId && parseInt(companyId, 10),
        compensationCategories: items,
      },
      dispatch,
      state
    )
      .then((response) => {
        if (response.isSuccessful) {
          setTabData(get(response, "company.compensationCategories", []));
          setCurrentTabData(
            get(response, "company.compensationCategories", [])
          );
        }
        const newCompanyId = get(response, "company.id", companyId);
        //console.log(response, "response");
      })
      .catch((err) => {
        throw err;
      });
  };
  // const deleteClick = (list) => {
  //   setMessage(!showToast);
  // }
  const handleClose = () => setToast(false);
  const handleMsgClose = () => setValidToast(false);
  const saveClick = (values, list, i) => {
    var name = addCategory ? get(values, "name", "") : list.name;
    var isIncluded = addCategory
      ? get(values, "isIncluded", "")
      : list.isIncluded;
    var compCategory = get(values, "compensationCategories", []);
    console.log(compCategory, "compCategory");
    var iscurrentIitemISLastIncluded =
      compCategory.filter((item) => item.isIncluded).length == 0 ? true : false;

    if (iscurrentIitemISLastIncluded) {
      setToastValidationMessage(
        "Please select at least one category for Gross Compensation calculation"
      );
      setValidToast(true);
      return false;
    }

    //if (addCategory) {
    if (
      isEmpty(name) ||
      name === " " ||
      isIncluded === null ||
      isIncluded === ""
    ) {
      console.log("in");
      var msg =
        (isEmpty(name) || name === " ") && isEmpty(isIncluded)
          ? "Enter category name and gross compensation values"
          : isEmpty(isIncluded)
          ? "Enter gross compensation value"
          : "Enter category name";
      setToastValidationMessage(msg);
      setValidToast(true);
      return false;
    }

    if (currentTabData.length > 0) {
      var initialname = currentTabData[i].name;
      var nameUpper = name.toUpperCase();
      const exists = addCategory
        ? compCategory.some((el) => el.name.toUpperCase() === nameUpper)
        : currentTabData.some((el) => el.name.toUpperCase() === nameUpper);
      if (
        !isEmpty(name) &&
        ((addCategory && exists) ||
          (!addCategory && name != initialname && exists))
      ) {
        console.log("inexists");
        setToastValidationMessage(
          "Two Compensation Categories have the same name. Please correct the Entries"
        );
        setValidToast(true);
        return false;
      }
    }
    var existingCategory = get(values, "compensationCategories", []);
    const newCategory = addCategory
      ? existingCategory.push({
          name: get(values, "name", ""),
          isIncluded: get(values, "isIncluded", ""),
        })
      : get(values, "compensationCategories", []);
    // console.log(newCategory, "state values");
    // console.log(existingCategory, "show values");
    addCategory ? setCategory(!addCategory) : setEdit(!editToggle);
    saveCompanyDetails(
      {
        id: companyId && parseInt(companyId, 10),
        compensationCategories: addCategory
          ? existingCategory
          : get(values, "compensationCategories", []),
      },
      dispatch,
      state
    )
      .then((response) => {
        if (response.isSuccessful) {
          setTabData(get(response, "company.compensationCategories", []));
          setCurrentTabData(
            get(response, "company.compensationCategories", [])
          );
        }

        addCategory ? setCategory(!addCategory) : setCategory(addCategory);
        const newCompanyId = get(response, "company.id", companyId);
        //console.log(response);
      })
      .catch((err) => {
        throw err;
      });
  };
  // console.log(editToggle, "editToggle");
  const editCall = (list) => {
    setEdit(!editToggle);
    setEditField(list.id);
    //console.log(list, "listId");
  };

  // const closeCall = (list, values) => {
  //   console.log(list, "listId");
  //   console.log(tabData, "tabData");
  //   setEdit(!editToggle);
  //   setEditField([]);
  // };

  useEffect(() => {
    addCategory
      ? setbtn({
          label: "",
          variant: "",
          disabled: "true",
          type: "",
        })
      : setbtn({
          label: "Add Category",
          variant: "primary",
          type: "button",
          onClick: onAddClick,
        });
  }, [addCategory]);
  useEffect(() => {
    editToggle
      ? setbtn({
          label: "Add Category",
          variant: "primary",
          type: "button",
          disabled: "true",
        })
      : setbtn({
          label: "Add Category",
          variant: "primary",
          type: "button",
          onClick: onAddClick,
        });
  }, [editToggle]);

  const buttons = [
    addbtn,
    {
      label: "",
      variant: "link",
      type: "button",
      flow: [FLOW_TYPES.EDIT],
      icon: faTimes,
      link: ROUTES.COMPANY,
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
            path: MANAGE_COMPANY_ROUTES.MANAGE_COMPENSATION,
            pathParam: [FLOW_TYPES.SAVE, companyId],
          })
        ),
    },
  ];

  // const isEdit = flow === FLOW_TYPES.EDIT && isEmpty(editToggle);
  // const isSave = flow === FLOW_TYPES.SAVE && !isEmpty(editToggle);

  return (
    <Formik
      initialValues={{
        compensationCategories: tabData,
      }}
      enableReinitialize
      onSubmit={onFormSubmit}
      validateOnChange={false}
    >
      {({ handleChange, setFieldValue, handleSubmit, values, ...rest }) => {
        //console.log(values, "values");
        return (
          <Form autoComplete="off" className="h-100" onSubmit={handleSubmit}>
            <ManageCompanyLayout buttons={buttons}>
              <div className="w-100">
                <div className="d-flex w-100 align-items-center justify-content-between">
                  <div className="m-0 comp-heading">
                    Compensation Categories
                  </div>
                </div>
                <div className="label-size">{tabData.length} Records found</div>
                <span>&nbsp;&nbsp;</span>
                <FieldArray name="compensationCategories">
                  {({ insert, remove, push, ...arrayHealper }) => {
                    return (
                      <Table className="company-compensation-table">
                        <Table.Tbody>
                          <Table.Tr>
                            {columns.map((item, index) => {
                              return (
                                <Table.Th
                                  key={index}
                                  className={item.className}
                                >
                                  {item.label}
                                </Table.Th>
                              );
                            })}
                          </Table.Tr>
                        </Table.Tbody>
                        {addCategory && (
                          <Table.Tbody>
                            <Table.Tr>
                              <Table.Td className="compensation-categori">
                                <Field
                                  isRequired
                                  name={fields.name}
                                  placeholder="Enter category name"
                                  size="lg"
                                  type="text"
                                  autoComplete="off"
                                  value={values[fields.name]}
                                  onChange={handleChange}
                                  component={FieldInput}
                                />
                              </Table.Td>
                              <Table.Td className="gross-compensation">
                                <Field
                                  isRequired
                                  name={fields.isIncluded}
                                  size="sm"
                                  options={EditMode}
                                  selectedValue={values.isIncluded}
                                  onChange={(value) => {
                                    setFieldValue(fields.isIncluded, value);
                                  }}
                                  component={FieldButtonGroup}
                                />
                              </Table.Td>
                              <Table.Td className="action-btn">
                                <FontAwesomeIcon
                                  icon={faTimes}
                                  color="#F15438"
                                  className="fa-lg space-btw pointer"
                                  onClick={() => {
                                    setCategory(!addCategory);
                                    values[fields.name] = "";
                                    values.isIncluded = null;
                                  }}
                                />
                                <FontAwesomeIcon
                                  icon={faCheck}
                                  color="#32D556"
                                  className="fa-lg pointer"
                                  onClick={(e) => saveClick(values, null, 0)}
                                />
                              </Table.Td>
                            </Table.Tr>
                          </Table.Tbody>
                        )}
                        {values.compensationCategories.map((list, i) => {
                          //console.log(list.id, "lists");
                          return (
                            <Table.Tbody className="company-compensation-table-row">
                              <Table.Tr key={i}>
                                <Table.Td className="compensation-categori">
                                  {!editToggle && isEmpty(editField) ? (
                                    list.name
                                  ) : editField === list.id ? (
                                    <Field
                                      isRequired
                                      name={`compensationCategories.${i}.name`}
                                      size="lg"
                                      type="text"
                                      value={
                                        values.compensationCategories[i].name
                                      }
                                      onChange={handleChange}
                                      autoComplete="off"
                                      disabled={!editToggle}
                                      component={FieldInput}
                                    />
                                  ) : (
                                    list.name
                                  )}
                                </Table.Td>
                                <Table.Td className="gross-compensation">
                                  {editToggle ? (
                                    editField > 0 && editField === list.id ? (
                                      <Field
                                        isRequired
                                        name={`compensationCategories.${i}.isIncluded`}
                                        size="sm"
                                        options={EditMode}
                                        selectedValue={list.isIncluded}
                                        onChange={(value) => {
                                          setFieldValue(
                                            `compensationCategories.${i}.isIncluded`,
                                            value
                                          );
                                        }}
                                        component={FieldButtonGroup}
                                      />
                                    ) : list.isIncluded ? (
                                      <div className="include-button">
                                        Include
                                      </div>
                                    ) : (
                                      <div className="exlude-button">
                                        Exclude
                                      </div>
                                    )
                                  ) : list.isIncluded ? (
                                    <div className="include-button">
                                      Include
                                    </div>
                                  ) : (
                                    <div className="exlude-button">Exclude</div>
                                  )}
                                </Table.Td>
                                <Table.Td className="action-btn">
                                  {!editToggle ? (
                                    !addCategory && (
                                      <div>
                                        <FontAwesomeIcon
                                          icon={faPen}
                                          color="#616190"
                                          className="fa-lg space-btw pointer"
                                          onClick={() => editCall(list)}
                                        />
                                        <FontAwesomeIcon
                                          icon={faTrash}
                                          color="#F25539"
                                          className="fa-lg pointer"
                                          onClick={() => {
                                            deleteCall(values, list, i);
                                          }}
                                        />
                                      </div>
                                    )
                                  ) : editField > 0 && editField === list.id ? (
                                    <div>
                                      <FontAwesomeIcon
                                        icon={faTimes}
                                        color="#F15438"
                                        className="fa-lg space-btw pointer"
                                        onClick={() => {
                                          arrayHealper.replace(i, tabData[i]);
                                          setEdit(!editToggle);
                                          setEditField([]);
                                          values[fields.name] = "";
                                          values.isIncluded = null;
                                        }}
                                        // onClick={() => closeCall(list, values)}
                                      />
                                      <FontAwesomeIcon
                                        icon={faCheck}
                                        color="#32D556"
                                        className="fa-lg pointer"
                                        onClick={() =>
                                          saveClick(values, list, i)
                                        }
                                      />
                                    </div>
                                  ) : (
                                    <span></span>
                                  )}
                                </Table.Td>
                              </Table.Tr>
                            </Table.Tbody>
                          );
                        })}
                      </Table>
                    );
                  }}
                </FieldArray>
              </div>
            </ManageCompanyLayout>
            <Modal show={showToast} onHide={handleClose} centered>
              <Modal.Body>
                <div className="text-right">
                  <FontAwesomeIcon
                    icon={faTimes}
                    color="#000"
                    onClick={handleClose}
                  />
                </div>
                <div className="d-flex">
                  <div className="remove-text">
                    <h4>
                      You are attempting to remove the Compensation Category "
                      {categoryName}".
                      <br /> Do you wish to continue?
                    </h4>

                    <Button
                      className="mr-4"
                      variant="secondary"
                      onClick={handleClose}
                    >
                      No
                    </Button>
                    <Button variant="primary" onClick={deleteClick}>
                      Yes
                    </Button>
                  </div>
                </div>
              </Modal.Body>
            </Modal>
            <Modal show={showValidToast} onHide={handleMsgClose} centered>
              <Modal.Body>
                <div className="text-right">
                  <FontAwesomeIcon
                    icon={faTimes}
                    color="#000"
                    onClick={handleClose}
                  />
                </div>
                <div className="d-flex">
                  <div className="remove-text">
                    <h4>{toastValidationMessage}</h4>
                    {/* <Button
                      className="mr-4"
                      variant="secondary"
                      onClick={handleClose}
                    >
                      No
                    </Button> */}
                    <Button variant="primary" onClick={handleMsgClose}>
                      Ok
                    </Button>
                  </div>
                </div>
              </Modal.Body>
            </Modal>
          </Form>
        );
      }}
    </Formik>
  );
};

export default CompanyCompensationContainer;
