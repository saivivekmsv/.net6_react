import { find, get, isEmpty, toLower } from "lodash";
import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { SearchableList, FormControl } from "..";
import { useDeepEffect, useRequest } from "../../abstracts";
import { addLoanType, getLoanTypes } from "../../services";
import {
  errors,
  getKeyUsingValue,
  OPTIONS_DATA_MAPPER,
  tranformListToDropdownValues,
} from "../../utils";

const LoanTypeDropdown = ({ data, onSelect, companyId, setData, value }) => {
  const [newLoanType, setNewLoanType] = useState("");
  const [request, setRequest] = useState({
    method: getLoanTypes,
    payload: companyId,
    stopTrigger: !isEmpty(data),
  });
  const [masterTypeCheckResponse, setMasterTypeCheck] = useState(false);
  const { response, loading } = useRequest(request);

  useDeepEffect(() => {
    setMasterTypeCheck(!!find(data, { label: newLoanType }));
  }, [newLoanType]);

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
        setData(
          tranformListToDropdownValues(response || [], "description", "id")
        );
      }
    },
    [loading],
    true
  );

  const newLoanTypeChange = (e) => {
    const elem = e.target;
    const val = e.target.value;
    elem.value = val.trim();
    setNewLoanType(val.trim());
  };

  const onNewLoanTypeChangeAdd = () => {
    if (!masterTypeCheckResponse) {
      {
        if (newLoanType)
          setRequest({
            ...request,
            stopTrigger: false,
            method: addLoanType,
            payload: {
              id: 0,
              description: newLoanType,
              loanType: getKeyUsingValue(
                OPTIONS_DATA_MAPPER.LOAN_TYPE,
                "Other"
              ),
              companyId: companyId,
              isMaster: true,
            },
          });
      }
    }
  };

  return (
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
      <FormControl
        label="Add a new Loan type :"
        hasSuggestion
        isValidSuggestion={!masterTypeCheckResponse}
        suggestionErrorMessage={errors.masterLoanTypeExists.alreadyExist}
        showTickAlways
      >
        <div className="input-group" style={{ width: "80%" }}>
          <input
            className="searchable-list-input-text form-control"
            style={{ height: "90%" }}
            name="newLoanTypeType"
            type="text"
            size="md"
            onChange={newLoanTypeChange}
            onKeyDown={(e) => {
              if (e.key == " ") {
                e.preventDefault();
                e.target.value += " ";
              }
            }}
          />
        </div>
      </FormControl>
      <Form.Group>
        <Button type="button" onClick={onNewLoanTypeChangeAdd}>
          Add
        </Button>
      </Form.Group>
    </div>
  );
};

export default LoanTypeDropdown;
