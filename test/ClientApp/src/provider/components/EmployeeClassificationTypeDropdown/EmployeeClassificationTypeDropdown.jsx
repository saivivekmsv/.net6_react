import { find, get, isEmpty, toLower } from "lodash";
import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { Field, Formik } from "formik";
import * as Yup from "yup";
import { SearchableList, LoaderWrapper } from "../";
import { useDeepEffect, useRequest } from "../../abstracts";
import {
  addMasterClassificationTypes,
  getMasterClassificationTypes,
} from "../../services";
import { FieldInput } from "../../components";
import { errors, tranformListToDropdownValues } from "../../utils";

const EmployeeClassificationTypeDropdown = ({
  data,
  onSelect,
  value,
  setData,
  companyId,
}) => {
  const [
    newEmployeeClassificationType,
    setNewEmployeeClassificationType,
  ] = useState();

  const [request, setRequest] = useState({
    method: getMasterClassificationTypes,
    payload: companyId,
    stopTrigger: !isEmpty(data),
  });
  const { response, loading } = useRequest(request);

  const schema = Yup.object().shape({
    newEmployeeClassificationType: Yup.string()
      .required(errors.masterClassificationName.required)
      .max(50, errors.masterClassificationName.length)
      .test(
        "newEmployeeClassificationType",
        errors.masterClassificationName.characters,
        (val) => !checkSplChar(val)
      )
      .test(
        "newEmployeeClassificationType",
        errors.masterClassificationName.alreadyExist,
        (val) => !alreadyExist(val)
      ),
  });

  const checkSplChar = (val) => {
    const format = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
    if (format.test(val) === true) return true;
    else return false;
  };

  const alreadyExist = (val) => {
    const temp = data.map((item) => {
      if (toLower(item.label) === toLower(val)) return true;
      else return false;
    });
    return temp.includes(true);
  };
  const keyDown = (e) => {
    if (e.keyCode == 32) {
      e.preventDefault();
      e.target.value += " ";
    }
  };
  useDeepEffect(
    () => {
      if (!loading) {
        if (newEmployeeClassificationType) {
          const filteredValue = find(
            response,
            (item) =>
              toLower(item.name) === toLower(newEmployeeClassificationType)
          );
          onSelect(
            get(filteredValue, "id", ""),
            get(filteredValue, "name", "")
          );
        }
        setData(tranformListToDropdownValues(response || [], "name", "id"));
      }
    },
    [loading],
    true
  );

  const onFormSubmit = (values) => {
    setNewEmployeeClassificationType(values["newEmployeeClassificationType"]);
    setRequest({
      ...request,
      stopTrigger: false,
      method: addMasterClassificationTypes,
      payload: {
        name: values["newEmployeeClassificationType"],
        id: companyId,
      },
    });
  };

  return (
    <>
      <LoaderWrapper isLoading={loading} loaderText="">
        <Formik
          initialValues={{ newEmployeeClassificationType: "" }}
          validationSchema={schema}
          validateOnChange={false}
          validateOnBlur={false}
          onSubmit={onFormSubmit}
        >
          {({ handleChange, handleSubmit, values }) => {
            return (
              <>
                <div className="dropdside-custom-dropdown">
                  <div>
                    <SearchableList
                      label="Select an Employee Classification type"
                      options={data}
                      onSelect={onSelect}
                      selectedValue={value}
                    />
                  </div>
                  <div className="line-separator"></div>
                  <Form autoComplete="off" onSubmit={handleSubmit}>
                    <Field
                      label="Add a new classification type :"
                      name={"newEmployeeClassificationType"}
                      type="text"
                      value={values["newEmployeeClassificationType"]}
                      onChange={handleChange}
                      autoComplete="nope"
                      component={FieldInput}
                      placeholder={"Classification type"}
                      onKeyDown={keyDown}
                    />
                    <Form.Group>
                      <Button type="submit">Add</Button>
                    </Form.Group>
                  </Form>
                </div>
              </>
            );
          }}
        </Formik>
      </LoaderWrapper>
    </>
  );
};

export default EmployeeClassificationTypeDropdown;
