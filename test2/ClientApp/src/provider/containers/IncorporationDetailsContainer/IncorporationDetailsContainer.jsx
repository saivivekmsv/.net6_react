import React, { useContext, useState } from "react";
import { Field, Formik } from "formik";
import { get, trim, upperFirst, isEmpty } from "lodash";
import * as Yup from "yup";
import { Row, Col, Form, Modal, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faPencilAlt } from "@fortawesome/pro-light-svg-icons";
import {
  faCheckCircle,
  faExclamationCircle,
} from "@fortawesome/pro-solid-svg-icons";
import {
  ManageCompanyLayout,
  SearchableList,
  DayDropdown,
  DatePicker,
  FieldInput,
  FieldDropSide,
  FieldButtonGroup,
  LoaderWrapper,
  CompanyLogoUpload,
  ImageUpload,
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
  getFormattedTaxEIN,
  getPathWithParam,
} from "../../utils";
import {
  manageCompanyStore,
  saveCompanyDetails,
  setManageCompanyFlow,
  setManageCompanyToastInfo,
  saveCompanyImage,
  setManageCompanyLocalCache,
} from "../../contexts";
import {
  getCheckCompanyNameExists,
  getCheckEinNumberExists,
  uploadCompanyLogo,
} from "../../services";
// import states from "../../mocks/states.json";
import { useRouterParams, useDeepEffect } from "../../abstracts";
import businessTypes from "../../mocks/businessTypes.json";
import months from "../../mocks/months.json";
import SponsorCard from "../../components/SponsorCards/SponsorCard";

const taxedAsOptions = [
  {
    label: "Corp",
    value: 1,
  },
  {
    label: "S-Corp",
    value: 2,
  },
  {
    label: "Partnership or Solo Prop",
    value: 3,
  },
];

const initialValues = { country: "USA" };

const schema = Yup.object().shape({
  // country: Yup.string(),
  // companyName: Yup.string()
  //   .required("Company Name is Required")
  //   .max(150, "Company Name should not be greater than 150"),
  // address1: Yup.string()
  //   .max(100, "Address1 should not be greater than 150")
  //   .nullable(),
  // address2: Yup.string()
  //   .max(100, "Address2 should not be greater than 150")
  //   .nullable(),
  // city: Yup.string().max(30, "city should not be greater than 30").nullable(),
  // postalCode: Yup.string()
  //   .matches(/^\d{5}(-\d{4})?$/, "zip code should be of either 5 or 9 digits")
  //   .nullable(),
  // email: Yup.string().email("E-mail should be valid").nullable(),
  // phoneNumber: Yup.string()
  //   .matches(
  //     /^\d{3}-\d{3}-\d{4}$/,
  //     "Phone number should be a valid 10 digit number"
  //   )
  //   .nullable(),
  // taxEIN: Yup.string()
  //   .matches(/^\d{2}-\d{7}$/, "Tax EIN should be of valid format (xx-xxxxxxx)")
  //   .nullable(),
  // website: Yup.string()
  //   .max(40, "Website should not be greater than 40")
  //   .nullable(),
});

const IncorporationDetailsContainer = (props) => {
  const { history } = props;
  const { state, dispatch } = useContext(manageCompanyStore);
  const { companyId, flow } = useRouterParams();

  const states = get(state, "states", []);
  const formName = manageCompanyFormNames.INCORPORATION_DETAILS_MANAGE_COMPANY;
  const fields = formFields[formName];
  const isEdit = flow === FLOW_TYPES.EDIT;
  const isSave = flow === FLOW_TYPES.SAVE;
  const formValues = getFlowBasedFormValues(get(state, formName, {}));
  let einNoCheckTimeout = null;
  const [imageFile, setImageFile] = useState([]);
  const [isPopupOpen, setisPopupOpen] = useState(0);
  const [newCompanyId, setNewCompanyId] = useState(companyId);
  const [validationCount, setValidationCount] = useState(0);
  const [imageLoading, setImageLoading] = useState(false);

  // const {
  //   loading: checkingEinNumber,
  //   response: taxEinNumberCheckResponse,
  // } = useRequest({
  //   method: getCheckEinNumberExists,
  //   payload: formEinNumber,
  //   delay: 500,
  //   triggerOnlyOnUpdate: true,
  // });

  const handleClose = () => {
    setisPopupOpen(false);
  };

  const saveImage = () => {
    if (validationCount === 0) {
      setImageLoading(true);
      setisPopupOpen(false);
      var formData = new FormData();
      formData.append("file", imageFile[0]);
      formData.append("companyId", newCompanyId);

      saveCompanyImage(formData, dispatch, state)
        .then((response) => {
          if (response) {
            setImageLoading(false);
            history.push(
              getAdvancedPathWithParam({
                path: MANAGE_COMPANY_ROUTES.SETTINGS,
                pathParam: [flow, newCompanyId],
              })
            );
          }
        })
        .catch((error) => {
          setImageLoading(false);
        });
    }
  };

  const exit = () => {
    setisPopupOpen(false);
    history.push(
      getAdvancedPathWithParam({
        path: MANAGE_COMPANY_ROUTES.SETTINGS,
        pathParam: [flow, companyId],
      })
    );
  };
  const onFormSubmit = (values, { setFieldError, setFieldTouched }) => {
    const companyName = get(values, fields.companyName);

    saveCompanyDetails(
      {
        ...values,
        id: companyId && parseInt(companyId, 10),
        name: upperFirst(companyName),
        postalCode:
          get(values, fields.postalCode, null) == ""
            ? null
            : get(values, fields.postalCode, null),
        phoneNumber:
          get(values, fields.phoneNumber, null) == ""
            ? null
            : get(values, fields.phoneNumber, null),
        taxEIN:
          get(values, fields.taxEIN, null) == ""
            ? null
            : get(values, fields.taxEIN, null),
        // postalCode: stripHyphenForApi(get(values, fields.postalCode, "")),
        // phoneNumber: stripHyphenForApi(get(values, fields.phoneNumber, "")),
      },
      dispatch,

      state
    ).then((response) => {
      setNewCompanyId(get(response, "company.id", companyId));
      if (!response.isSuccessful) {
        for (var i = 0; i < response.errorMessages.length; i++) {
          var _ = response.errorMessages[i];
          setFieldTouched(_.controlName, true);
          setFieldError(_.controlName, `${_.errorCode} : ${_.message}`);
        }
      } else {
        dispatch(
          setManageCompanyFlow({
            companyId: newCompanyId,
          })
        );
        if (flow === "add") {
          setisPopupOpen(true);
        } else {
          dispatch(
            setManageCompanyToastInfo({
              showToast: true,
              toastMessage: "Data saved successfully",
            })
          );

          history.push(
            getAdvancedPathWithParam({
              path: MANAGE_COMPANY_ROUTES.SETTINGS,
              pathParam: [flow, newCompanyId],
            })
          );
        }
      }
    });
  };

  useDeepEffect(() => {
    dispatch(
      setManageCompanyFlow({
        flow: flow,
      })
    );
  }, [flow]);

  const buttons = [
    {
      link: ROUTES.COMPANY,
      label: "Cancel",
      variant: "secondary",
      type: "button",
      flow: [FLOW_TYPES.ADD, FLOW_TYPES.SAVE],
    },
    {
      label: "Save",
      variant: "primary",
      type: "submit",
      flow: [FLOW_TYPES.SAVE, FLOW_TYPES.ADD],
    },
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
            path: MANAGE_COMPANY_ROUTES.INCORPORATION_DETAILS,
            pathParam: [FLOW_TYPES.SAVE, companyId],
          })
        ),
    },
  ];

  return (
    <>
      {/* <SponsorCard value="Netflix" title="Company Name" type="link" /> */}
      <Formik
        initialValues={{
          ...initialValues,
          ...formValues,
          country: "USA",
        }}
        validationSchema={schema}
        validateOnChange={false}
        validateOnBlur={false}
        onSubmit={onFormSubmit}
        enableReinitialize
      >
        {({ handleChange, setFieldValue, handleSubmit, values, ...rest }) => {
          const onDaySelected = (fieldName, value) => {
            setFieldValue(fieldName, value);
          };

          return (
            <Form
              autoComplete="off"
              className="h-100"
              onSubmit={handleSubmit}
              validated={rest.submitCount > 0}
            >
              <LoaderWrapper isLoading={imageLoading}>
                <ManageCompanyLayout buttons={buttons} pageFlow={flow}>
                  <div>
                    <Row>
                      <Col>
                        <Field
                          isRequired
                          name={fields.companyName}
                          label={
                            companyId ? "Company Name" : "New Company Name"
                          }
                          type="text"
                          autoComplete="off"
                          value={values[fields.companyName]}
                          onChange={handleChange}
                          disabled={isEdit}
                          component={FieldInput}
                        />
                        <Field
                          label="Address 1"
                          name={fields.address1}
                          type="text"
                          autoComplete="nope"
                          value={values[fields.address1]}
                          onChange={handleChange}
                          disabled={isEdit && !isSave}
                          component={FieldInput}
                        />
                        <Field
                          label="Address 2"
                          name={fields.address2}
                          type="text"
                          value={values[fields.address2]}
                          autoComplete="nope"
                          onChange={handleChange}
                          disabled={isEdit && !isSave}
                          component={FieldInput}
                        />
                        <Field
                          label="Country"
                          name={fields.country}
                          disabled
                          options={[{ label: "USA", value: "USA" }]}
                          value={values[fields.country]}
                          component={FieldDropSide}
                        />
                        <Field
                          name={fields.stateId}
                          label="State"
                          size="md"
                          options={
                            states &&
                            states.map((state, index) => ({
                              label: state.label,
                              value: state.value,
                            }))
                          }
                          value={values[fields.state]}
                          popupContent={
                            <SearchableList
                              options={
                                states &&
                                states.map((state, index) => ({
                                  label: state.label,
                                  value: state.value,
                                }))
                              }
                              onSelect={(value) =>
                                setFieldValue(fields.state, value)
                              }
                              height="250px"
                              selectedValue={values[fields.state]}
                              value={values[fields.state]}
                            />
                          }
                          disabled={isEdit && !isSave}
                          component={FieldDropSide}
                        />
                        <Field
                          label="City"
                          name={fields.city}
                          type="text"
                          value={values[fields.city]}
                          onChange={handleChange}
                          autoComplete="nope"
                          disabled={isEdit && !isSave}
                          component={FieldInput}
                        />
                        <Field
                          label="Zip Code"
                          name={fields.postalCode}
                          size="sm"
                          type="text"
                          onChange={handleChange}
                          autoComplete="nope"
                          disabled={isEdit && !isSave}
                          component={FieldInput}
                          value={getFormattedZip(values[fields.postalCode])}
                          placeholder={FORM_PLACEHOLDERS.zip}
                          maxLength="10"
                        />
                        <Field
                          label="Phone number"
                          name={fields.phoneNumber}
                          type="phone"
                          onChange={handleChange}
                          autoComplete="nope"
                          disabled={isEdit && !isSave}
                          component={FieldInput}
                          value={getFormattedPhone(values[fields.phoneNumber])}
                          placeholder={FORM_PLACEHOLDERS.phone}
                          maxLength="12"
                        />
                        <Field
                          label="Email"
                          name={fields.email}
                          type="email"
                          value={values[fields.email]}
                          onChange={handleChange}
                          autoComplete="nope"
                          disabled={isEdit && !isSave}
                          component={FieldInput}
                        />
                        <Field
                          label="Company Website"
                          name={fields.website}
                          type="text"
                          value={values[fields.website]}
                          onChange={handleChange}
                          autoComplete="nope"
                          disabled={isEdit && !isSave}
                          component={FieldInput}
                        />
                      </Col>
                    </Row>
                    <div className="line-separator"></div>
                    <Row>
                      <Col>
                        <Field
                          name={fields.businessType}
                          label="Business type"
                          value={values[fields.businessType]}
                          disabled={isEdit && !isSave}
                          options={businessTypes.data}
                          popupContent={
                            <SearchableList
                              label="Select a Business type"
                              options={businessTypes.data}
                              onSelect={(value) =>
                                setFieldValue(fields.businessType, value)
                              }
                              selectedValue={values[fields.businessType]}
                              isNotTypeAhead
                              isRadio
                            />
                          }
                          component={FieldDropSide}
                        />
                        <Field
                          size="lg"
                          name={fields.taxedAs}
                          label="Taxed as"
                          options={taxedAsOptions}
                          selectedValue={values[fields.taxedAs]}
                          onChange={(value) => {
                            setFieldValue(fields.taxedAs, value);
                          }}
                          disabled={isEdit && !isSave}
                          component={FieldButtonGroup}
                        />
                        <div className="d-flex">
                          <Field
                            name={fields.fisicalYearMonth}
                            label="Fiscal year end"
                            size="sm"
                            placeholder="Month"
                            value={values[fields.fisicalYearMonth]}
                            options={months.data}
                            disabled={isEdit && !isSave}
                            popupContent={
                              <SearchableList
                                label="Select a month"
                                isNotTypeAhead
                                options={months.data}
                                onSelect={(value) =>
                                  setFieldValue(
                                    fields.fisicalYearMonth,
                                    parseInt(value, 10)
                                  )
                                }
                                selectedValue={values[fields.fisicalYearMonth]}
                              />
                            }
                            component={FieldDropSide}
                          />
                          &nbsp; &nbsp;
                          <Field
                            size="xs"
                            name={fields.fisicalYearDay}
                            label=" "
                            placeholder="Date"
                            value={values[fields.fisicalYearDay]}
                            disabled={isEdit && !isSave}
                            popupContent={
                              <DayDropdown
                                fromMonthDate={
                                  new Date(
                                    2020,
                                    values[fields.fisicalYearMonth] - 1 || 0
                                  )
                                }
                                onSelect={(value) =>
                                  setFieldValue(
                                    fields.fisicalYearDay,
                                    parseInt(value, 10)
                                  )
                                }
                                value={values[fields.fisicalYearDay]}
                              />
                            }
                            component={FieldDropSide}
                          />
                        </div>
                        <Field
                          name={fields.stateOfIncorporation}
                          label="State of incorporation"
                          size="md"
                          value={values[fields.stateOfIncorporation]}
                          disabled={isEdit && !isSave}
                          options={states}
                          popupContent={
                            <SearchableList
                              options={states}
                              onSelect={(value) =>
                                setFieldValue(
                                  fields.stateOfIncorporation,
                                  value
                                )
                              }
                              height="250px"
                              selectedValue={
                                values[fields.stateOfIncorporation]
                              }
                            />
                          }
                          component={FieldDropSide}
                        />
                        <Field
                          name={fields.companyStartDate}
                          label="Company start date"
                          size="smd"
                          value={usDateFormat(values[fields.companyStartDate])}
                          disabled={isEdit && !isSave}
                          isDatePicker
                          onClear={() =>
                            onDaySelected(fields.companyStartDate, null)
                          }
                          popupContent={
                            <DatePicker
                              onDayClick={(value) =>
                                onDaySelected(fields.companyStartDate, value)
                              }
                              value={values[fields.companyStartDate]}
                            />
                          }
                          component={FieldDropSide}
                        />
                        <Field
                          name={fields.taxEIN}
                          label="Tax EIN"
                          size="xs"
                          type="text"
                          autoComplete="off"
                          onChange={handleChange}
                          value={getFormattedTaxEIN(values[fields.taxEIN])}
                          disabled={isEdit && !isSave}
                          placeholder="__-_______"
                          component={FieldInput}
                          noLabelTransform={true}
                          maxLength="10"
                        />
                      </Col>
                    </Row>
                    <Modal
                      show={isPopupOpen}
                      onHide={handleClose}
                      className="image-upload-tab"
                    >
                      <Modal.Body className="image-upload-tab">
                        <div className="image-upload-body">
                          <div className="text-right">
                            <Link>
                              <FontAwesomeIcon
                                icon={faTimes}
                                color="#000"
                                onClick={exit}
                              />
                            </Link>
                          </div>
                          <div>
                            <div className="success-message-text">
                              <FontAwesomeIcon
                                icon={faCheckCircle}
                                color="#3BB54A"
                                size="1x"
                              />
                              &nbsp;&nbsp; Data saved successfully
                            </div>
                            <br />

                            <div className="image-upload-text grey-bg">
                              <CompanyLogoUpload
                                setFieldValue={setFieldValue}
                                label="Do you want to add logo of company ?"
                                name="employeeImage"
                                blockDrag={isEdit && !isSave}
                                id={companyId}
                                imageFile={imageFile}
                                setImageFile={setImageFile}
                                validationCount={validationCount}
                                setValidationCount={setValidationCount}
                                // flow="edit"
                              />
                              {/* <ImageUpload
                                setFieldValue={setFieldValue}
                                label="Do you want to add logo of company ?"
                                name="employeeImage"
                                blockDrag={isEdit && !isSave}
                                id={companyId}
                                imageFile={imageFile}
                                setImageFile={setImageFile}
                                validationCount={validationCount}
                                setValidationCount={setValidationCount}
                              // flow="edit"
                              /> */}
                            </div>

                            {isEmpty(imageFile) ? (
                              <div>
                                <div className="margin-left-40">or</div>
                                <div>
                                  <Button
                                    variant="secondary"
                                    className="margin-left-30"
                                    onClick={exit}
                                  >
                                    No thanks
                                  </Button>
                                </div>
                              </div>
                            ) : (
                              // <div>
                              <div>
                                <Button
                                  variant="secondary"
                                  className="margin-left-20"
                                  onClick={exit}
                                >
                                  Cancel
                                </Button>
                                <Button
                                  variant="primary"
                                  className="margin-left-20"
                                  onClick={() => saveImage()}
                                >
                                  Save
                                </Button>
                              </div>
                              // </div>
                            )}
                            <br />
                          </div>
                        </div>
                      </Modal.Body>
                    </Modal>
                  </div>
                </ManageCompanyLayout>
              </LoaderWrapper>
            </Form>
          );
        }}
      </Formik>
    </>
  );
};

export default IncorporationDetailsContainer;
