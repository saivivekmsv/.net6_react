import React, { useState, useRef, useContext } from "react";
import { useLocation, useParams } from "react-router-dom";
import { ManageMapperLayout } from "../../../components";
// import { Image, InputGroup, Button, Form, Card } from "react-bootstrap";
import FileInfo from "./FileInfo";
import APIInfo from "./APIInfo";
import {
  getPathWithParam,
  MANAGE_MAPPER_ROUTES,
  manageMapperFormNames,
  formFields,
  mapperFormFields,
  FLOW_TYPES,
  ROUTES,
} from "../../../utils";
import { useRouterParams } from "../../../abstracts";
import {
  manageMapperStore,
  UploadSourceFile,
  setManageMapperToastInfo,
  setManageMapperPageLevelData,
  setManageMapperFlow,
  setMapperPageLevelData,
} from "../../../contexts";
import {
  FieldButtonGroup,
  FieldDropSide,
  FieldInput,
  FieldInputPassword,
  FieldInputSSN,
  SearchableList,
  Select,
} from "../../../components";
import { Field, Formik } from "formik";
import { Form } from "react-bootstrap";
import { get, isEmpty } from "lodash";
import * as Yup from "yup";

const sourceTypeData = [
  {
    label: "File",
    value: 0,
  },
  {
    label: "API",
    value: 1,
  },
];

const initialValues = {};

const SourceContainer = (props) => {
  // const [Rulesets, setRulesets] = useState(sourceTypeData);

  // const initialValues = {
  //   OutChoice: 0,
  //   DCFormat: 0,
  //   FileFormat: "",
  //   FURL: "",
  //   FPath: "",
  //   FUserName: "",
  //   FPassword: "",
  //   Fg: "",
  // };
  const { state, dispatch } = useContext(manageMapperStore);
  const basicInformation = get(state, "basicInformation", []);
  const formValues = get(state, "api.data", {});
  const formName = manageMapperFormNames.SOURCE;
  const fields = mapperFormFields[formName];

  const config =
    !isEmpty(formValues) && JSON.parse(get(formValues, "configurationJson"));

  const { flow, profileId } = useRouterParams();
  const isEdit = flow === FLOW_TYPES.EDIT;
  const messagesEndRef = useRef(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const buttons = [
    {
      label: "Cancel",
      variant: "secondary",
      type: "button",
      link: ROUTES.MAPPER_HOME,
    },
    {
      label: "Next",
      variant: "primary",
      type: "submit",
      //link: isEdit ? `${MANAGE_MAPPER_ROUTES.FILTER}/edit/${profileId}`: `${MANAGE_MAPPER_ROUTES.FILTER}/${profileId}`
    },
  ];
  const [fileUploadRequired, setFileUploadRequired] = useState("");

  const showError = (values) => {
    if (values[fields.fileFormat] == 3) {
      setFileUploadRequired("*Please upload a valid excel file.");
    } else if (values[fields.fileFormat] == 1) {
      setFileUploadRequired("*Please upload a valid csv file.");
    } else {
      setFileUploadRequired("*Please upload a valid excel/csv file.");
    }
    scrollToBottom();
  };

  const onFormSubmit = (values) => {
    const { history } = props;
    if (isEdit) {
      history.push(`${MANAGE_MAPPER_ROUTES.FILTER}/${flow}/${profileId}`);
    }
    if (
      !isEdit &&
      values[fields.fileFormat] === 1 &&
      values[fields.uploadSourceFile] != undefined &&
      values[fields.uploadSourceFile] != null &&
      values[fields.uploadSourceFile].length > 0 &&
      !isEmpty(basicInformation)
    ) {
      setFileUploadRequired("");
      const configure = {
        delimiter: values[fields.delimiter],
        commentCharacter: "#",
        headerRow: values[fields.contentStartsFrom],
        hasHeader: values[fields.hasHeader],
        allowNull: values[fields.checkForHeaderCountMismatch],
      };
      UploadSourceFile(
        { values, basicInformation, configure },
        dispatch,
        state
      ).then((res) => {
        if (res.isSuccess) {
          const newProfileId = get(res, "id");
          dispatch(
            setMapperPageLevelData({
              formName: formName,
              fieldData: values,
            })
          );
          dispatch(
            setManageMapperToastInfo({
              showToast: true,
              toastMessage: `Create Profile Succesfull`,
            })
          );
          window.setTimeout(() => {
            history.push(
              getPathWithParam({
                path: MANAGE_MAPPER_ROUTES.FILTER,
                pathParam: [FLOW_TYPES.ADD, newProfileId],
              })
            );
          }, 10);
        } else showError(values);
      });
    }
    if (
      !isEdit &&
      values[fields.fileFormat] === 3 &&
      values[fields.uploadSourceFile] != undefined &&
      values[fields.uploadSourceFile] != null &&
      values[fields.uploadSourceFile].length > 0 &&
      !isEmpty(basicInformation)
    ) {
      setFileUploadRequired("");

      const configure = {
        spreadSheetToRead: values[fields.selectDataFrom],
        spreadSheetName: values[fields.spreadSheetName],
        headerRow: values[fields.contentStartsFrom],
        hasHeader: values[fields.hasHeader],
        allowNull: values[fields.checkForHeaderCountMismatch],
        spreadSheetNumber: values[fields.spreadSheetNumber],
      };

      UploadSourceFile(
        { values, basicInformation, configure },
        dispatch,
        state
      ).then((res) => {
        if (res.isSuccess) {
          const newProfileId = get(res, "id");
          dispatch(
            setMapperPageLevelData({
              formName: formName,
              fieldData: values,
            })
          );
          dispatch(
            setManageMapperToastInfo({
              showToast: true,
              toastMessage: `Create Profile Succesfull`,
            })
          );
          window.setTimeout(() => {
            history.push(`${MANAGE_MAPPER_ROUTES.FILTER}/${newProfileId}`);
          }, 10);
        } else showError(values);
      });
    }
    if (!isEdit && values[fields.fileFormat] === 2) {
      history.push(`${MANAGE_MAPPER_ROUTES.FIXED_LENGTH}/${profileId}`);
    }
  };

  const ValidationSchema = Yup.object().shape({
    sourceUrl: Yup.string().when("fileType", {
      is: 1,
      then: Yup.string().required("URL Required"),
    }),
    sourceUserName: Yup.string().when("fileType", {
      is: 1,
      then: Yup.string().required("Username Required"),
    }),
    sourcePassword: Yup.string().when("fileType", {
      is: 1,
      then: Yup.string().required("Password Required"),
    }),
  });

  return (
    <Formik
      initialValues={{
        ...initialValues,
        ...formValues,
        [fields.fileType]: 0,
        [fields.fileFormat]: get(formValues, "format", 3),
        [fields.selectDataFrom]: get(config, "spreadSheetToRead", 1),
        [fields.hasHeader]: get(config, "hasHeader", true),
        [fields.checkForHeaderCountMismatch]: true,
        [fields.contentStartsFrom]: get(config, "headerRow", 1),
        [fields.spreadSheetName]: get(config, "spreadSheetName", ""),
        [fields.spreadSheetNumber]: get(config, "spreadSheetNumber", 1),
        [fields.delimiter]: get(config, "delimiter", ","),
      }}
      enableReinitialize
      onSubmit={onFormSubmit}
      validationSchema={ValidationSchema}
    >
      {({
        errors,
        values,
        touched,
        setValues,
        handleChange,
        setFieldValue,
        handleSubmit,
      }) => {
        return (
          <Form autoComplete="off" className="h-100" onSubmit={handleSubmit}>
            <ManageMapperLayout layoutHeader="Source" buttons={buttons}>
              {/* <pre>{JSON.stringify(values, null, 2)}</pre> */}

              <div style={{ fontSize: "18px", fontWeight: "600" }}></div>
              <div style={{ width: "320px" }}>
                <Field
                  name={fields.fileType}
                  label={"Type"}
                  value={values[fields.fileType]}
                  options={sourceTypeData}
                  isRequired
                  direction={"bottom"}
                  disabled={isEdit || !isEmpty(get(state, formName, []))}
                  popupContent={
                    <SearchableList
                      label={"Source Type"}
                      isNotTypeAhead
                      options={sourceTypeData}
                      onSelect={(value) =>
                        setFieldValue(fields.fileType, value)
                      }
                      selectedValue={values[fields.fileType]}
                    />
                  }
                  component={FieldDropSide}
                />

                <div style={{ marginTop: "20px" }}>
                  {(() => {
                    if (values[fields.fileType] == 0) {
                      return (
                        <div>
                          <FileInfo
                            values={values}
                            setFieldValue={setFieldValue}
                            fields={fields}
                            isEdit={isEdit}
                            fileUploadRequired={fileUploadRequired}
                            state={state}
                            formName={formName}
                          />
                          <div ref={messagesEndRef}></div>
                        </div>
                      );
                    } else if (values[fields.fileType] == 1) {
                      return (
                        <APIInfo
                          values={values}
                          setFieldValue={setFieldValue}
                          fields={fields}
                        />
                      );
                    }
                  })()}
                </div>
              </div>
            </ManageMapperLayout>
          </Form>
        );
      }}
    </Formik>
  );
};

export default SourceContainer;
