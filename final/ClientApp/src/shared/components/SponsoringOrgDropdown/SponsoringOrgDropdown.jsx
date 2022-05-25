import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { isEmpty, find, toLower, get } from "lodash";
import { SearchableList, LoaderWrapper, FormControl } from "../";
import {
  getPlanSponsoringOrganisationList,
  postPlanSponsoringOrganisationList,
  getCheckIfSponsoringOrganisationNameExists,
} from "../../services";
import { useRequest, useDeepEffect } from "../../abstracts";
import { errors } from "../../utils";

const SponsoringOrgDropdown = ({ data, onSelect, refreshData }) => {
  const [newSponsoringOrg, setNewSponsoringOrg] = useState("");
  const [request, setRequest] = useState({
    method: getPlanSponsoringOrganisationList,
    stopTrigger: !isEmpty(data),
  });
  const [lengthCheck, setLengthCheck] = useState(true);
  const {
    loading: checkingSponsoringOrgName,
    response: sponsoringOrgResponse,
  } = useRequest({
    method: getCheckIfSponsoringOrganisationNameExists,
    payload: newSponsoringOrg,
    triggerOnlyOnUpdate: true,
    defaultResponse: true,
  });
  let sponsoringOrgCheckTimeout = null;
  const { response, loading } = useRequest(request);

  useDeepEffect(
    () => {
      if (!loading) {
        if (newSponsoringOrg) {
          const filteredValue = find(
            response,
            (item) =>
              toLower(item.sponsoringOrganisationName) ===
              toLower(newSponsoringOrg)
          );
          onSelect(get(filteredValue, "id", ""));
        }
        refreshData(response);

        // setNewSponsoringOrg("");
      }
    },
    [loading],
    true
  );

  const newSponsoringOrgChange = (e) => {
    const elem = e.target;
    const val = e.target.value;
    elem.value = val.trim();
    setLengthCheck(val.length <= 50);
    setNewSponsoringOrg(val);
  };

  const onNewSponsoringOrgChangeAdd = () => {
    if (!sponsoringOrgResponse && lengthCheck && newSponsoringOrg) {
      setRequest({
        ...request,
        stopTrigger: false,
        method: postPlanSponsoringOrganisationList,
        payload: {
          name: newSponsoringOrg,
          id: 0,
        },
      });
    }
  };

  const getErrorMessage = () => {
    if (!lengthCheck) return errors.sponsoringOrganizationId.lengthExceeded;
    else return errors.sponsoringOrganizationId.alreadyExist;
  };

  return (
    <LoaderWrapper
      isLoading={loading}
      loaderText=""
      className="dropdside-custom-dropdown sponsoringorg-dropdown flex-column"
    >
      <div>
        <SearchableList
          label="Select an Sponsoring Organisation"
          options={data}
          onSelect={onSelect}
        />
      </div>
      <div className="line-separator"></div>
      <FormControl
        label="Add a new Sponsoring Organisation"
        hasSuggestion
        isSuggestionLoading={checkingSponsoringOrgName}
        isValidSuggestion={!sponsoringOrgResponse && lengthCheck}
        suggestionErrorMessage={getErrorMessage()}
      >
        <input
          name="newSponsoringOrg"
          type="text"
          size="sm"
          autoComplete="off"
          onChange={newSponsoringOrgChange}
          onKeyDown={(e) => {
            if (e.key == " ") {
              e.preventDefault();
              e.target.value += " ";
            }
          }}
        />
      </FormControl>
      <Form.Group>
        <Button type="button" onClick={onNewSponsoringOrgChangeAdd}>
          Add
        </Button>
      </Form.Group>
    </LoaderWrapper>
  );
};

export default SponsoringOrgDropdown;
