import { find, get, isEmpty, toLower } from "lodash";
import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { Field, Formik } from "formik";
import * as Yup from "yup";
import { SearchableList, LoaderWrapper } from "../";
import { useDeepEffect, useRequest } from "../../abstracts";
import { addLoanType, getLoanTypes } from "../../services";
import {
  errors,
  getKeyUsingValue,
  OPTIONS_DATA_MAPPER,
  tranformListToDropdownValues,
} from "../../utils";
import { FieldInput } from "../../components";

const LoanTypeDropdown = ({ data, onSelect, companyId, setData, value }) => {
  const [newLoanType, setNewLoanType] = useState();
  const [request, setRequest] = useState({
    method: getLoanTypes,
    payload: companyId,
    stopTrigger: !isEmpty(data),
  });
  const { response, loading } = useRequest(request);

  const schema = Yup.object().shape({
    newLoanTypeType: Yup.string()
      .required(errors.masterLoanTypeExists.required)
      .max(50, errors.masterLoanTypeExists.length)
      .test(
        "newLoanTypeType",
        errors.masterLoanTypeExists.characters,
        (val) => !checkSplChar(val)
      )
      .test(
        "newLoanTypeType",
        errors.masterLoanTypeExists.alreadyExist,
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
        if (newLoanType) {
          const filteredValue = find(
            response,
            (item) => toLower(item.description) === toLower(newLoanType)
          );
          onSelect(
            get(filteredValue, "id", ""),
            get(filteredValue, "description", "")
          );
        }
        console.log(response);
        setData(
          tranformListToDropdownValues(response || [], "description", "id")
        );
      }
    },
    [loading],
    true
  );

  const onFormSubmit = (values) => {
    setNewLoanType(values["newLoanTypeType"]);
    setRequest({
      ...request,
      stopTrigger: false,
      method: addLoanType,
      payload: {
        id: 0,
        description: values["newLoanTypeType"],
        loanType: getKeyUsingValue(OPTIONS_DATA_MAPPER.LOAN_TYPE, "Other"),
        companyId: companyId,
        isMaster: true,
      },
    });
  };

  return (
    <>
      <LoaderWrapper isLoading={loading} loaderText="">
        <Formik
          initialValues={{ newLoanTypeType: "" }}
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
                      label="Select a Loan Type or create a new one"
                      options={data}
                      onSelect={onSelect}
                      selectedValue={value}
                      // isNotTypeAhead
                    />
                  </div>
                  <div className="line-separator"></div>
                  <Form autoComplete="off" onSubmit={handleSubmit}>
                    <Field
                      label="Add a new Loan type :"
                      name={"newLoanTypeType"}
                      type="text"
                      value={values["newLoanTypeType"]}
                      onChange={handleChange}
                      autoComplete="nope"
                      component={FieldInput}
                      placeholder={"Loan type"}
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

export default LoanTypeDropdown;
