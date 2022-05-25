import { find, get, isEmpty, parseInt, toLower } from "lodash";
import React, { useState } from "react";
import { Form, Button, InputGroup } from "react-bootstrap";
import { SearchableList, FormControl } from "../";
import { useDeepEffect, useRequest, useRouterParams } from "../../abstracts";
import {
  addMasterClassificationTypes,
  checkMasterClassificationExists,
  getMasterClassificationTypes,
} from "../../services";
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
  ] = useState("");
  const [lengthCheck, setLengthCheck] = useState(true);
  const [request, setRequest] = useState({
    method: getMasterClassificationTypes,
    payload: companyId,
    stopTrigger: !isEmpty(data),
  });
  const {
    loading: checkingMasterClassificationName,
    response: masterClassificationCheckResponse,
  } = useRequest({
    method: checkMasterClassificationExists,
    payload: newEmployeeClassificationType,
    triggerOnlyOnUpdate: true,
    defaultResponse: false,
  });
  const format = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
  const { response, loading } = useRequest(request);
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

  const newEmployeeClassificationTypeChange = (e) => {
    const elem = e.target;
    const val = e.target.value;
    elem.value = val;
    setLengthCheck(val.length <= 50);
    setNewEmployeeClassificationType(val);
  };

  const onNewEmployeeClassificationTypeAdd = () => {
    if (
      !masterClassificationCheckResponse &&
      lengthCheck &&
      !format.test(newEmployeeClassificationType) &&
      newEmployeeClassificationType
    ) {
      setRequest({
        ...request,
        stopTrigger: false,
        method: addMasterClassificationTypes,
        payload: {
          name: newEmployeeClassificationType,
          id: companyId,
        },
      });
    }
  };
  return (
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
      <FormControl
        label="Add a new classification type :"
        hasSuggestion
        isSuggestionLoading={checkingMasterClassificationName}
        isValidSuggestion={
          !masterClassificationCheckResponse &&
          lengthCheck &&
          !format.test(newEmployeeClassificationType)
        }
        suggestionErrorMessage={
          !lengthCheck
            ? errors.masterClassificationName.length
            : format.test(newEmployeeClassificationType) === true
            ? errors.masterClassificationName.characters
            : errors.masterClassificationName.alreadyExist
        }
      >
        <input
          className="searchable-list-input-text"
          name="newEmployeeClassificationType"
          type="text"
          size="md"
          onChange={newEmployeeClassificationTypeChange}
          onKeyDown={(e) => {
            if (e.key == " ") {
              e.preventDefault();
              e.target.value += " ";
            }
          }}
        />
      </FormControl>
      <Form.Group>
        <Button type="button" onClick={onNewEmployeeClassificationTypeAdd}>
          Add
        </Button>
      </Form.Group>
    </div>
  );
};

export default EmployeeClassificationTypeDropdown;
