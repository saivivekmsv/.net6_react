import { find, get, isEmpty, toLower } from "lodash";
import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { SearchableList, FormControl } from "../";
import { useDeepEffect, useRequest } from "../../abstracts";
import {
  addMasterEmploymentStatus,
  checkMasterEmploymentStatusExists,
  getMasterEmploymentStatuses,
} from "../../services";
import { errors, tranformListToDropdownValues } from "../../utils";

const EmploymentStatusDropdown = ({
  data,
  onSelect,
  companyId,
  setData,
  value,
}) => {
  const [newEmploymentStatus, setNewEmploymentStatus] = useState("");
  const [request, setRequest] = useState({
    method: getMasterEmploymentStatuses,
    payload: companyId,
    stopTrigger: !isEmpty(data),
  });
  const {
    loading: checkingMasterStatusName,
    response: masterStatusCheckResponse,
  } = useRequest({
    method: checkMasterEmploymentStatusExists,
    payload: newEmploymentStatus,
    triggerOnlyOnUpdate: true,
    defaultResponse: true,
  });
  const [lengthCheck, setLengthCheck] = useState(true);
  const format = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
  const { response, loading } = useRequest(request);
  useDeepEffect(
    () => {
      if (!loading) {
        if (newEmploymentStatus) {
          const filteredValue = find(
            response,
            (item) => toLower(item.name) === toLower(newEmploymentStatus)
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

  const newEmploymentStatusChange = (e) => {
    const elem = e.target;
    const val = e.target.value;
    elem.value = val;
    setLengthCheck(val.length <= 50);
    setNewEmploymentStatus(val);
  };

  const onNewEmploymentStatusChangeAdd = () => {
    if (
      !masterStatusCheckResponse &&
      lengthCheck &&
      !format.test(newEmploymentStatus && newEmploymentStatus)
    ) {
      setRequest({
        ...request,
        stopTrigger: false,
        method: addMasterEmploymentStatus,
        payload: {
          name: newEmploymentStatus,
          id: companyId,
        },
      });
    }
  };
  return (
    <div className="dropdside-custom-dropdown">
      <div>
        <SearchableList
          label="Select an Employment Status or create a new one"
          options={data}
          onSelect={onSelect}
          selectedValue={value}
          // isNotTypeAhead
        />
      </div>
      <div className="line-separator"></div>
      <FormControl
        label="Add a new Employment Status type :"
        hasSuggestion
        isSuggestionLoading={checkingMasterStatusName}
        isValidSuggestion={
          !masterStatusCheckResponse &&
          lengthCheck &&
          !format.test(newEmploymentStatus)
        }
        suggestionErrorMessage={
          !lengthCheck
            ? errors.masterClassificationName.length
            : format.test(newEmploymentStatus)
            ? errors.masterEmploymentStatus.characters
            : errors.masterEmploymentStatus.alreadyExist
        }
      >
        <input
          className="searchable-list-input-text"
          name="newEmploymentStatusType"
          type="text"
          size="md"
          onChange={newEmploymentStatusChange}
          onKeyDown={(e) => {
            if (e.key == " ") {
              e.preventDefault();
              e.target.value += " ";
            }
          }}
        />
      </FormControl>
      <Form.Group>
        <Button type="button" onClick={onNewEmploymentStatusChangeAdd}>
          Add
        </Button>
      </Form.Group>
    </div>
  );
};

export default EmploymentStatusDropdown;
