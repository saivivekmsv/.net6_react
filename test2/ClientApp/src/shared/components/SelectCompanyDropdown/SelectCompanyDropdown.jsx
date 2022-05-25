import React from "react";
import { useHistory } from "react-router-dom";
import { Link, DropdownWithAjaxSearch } from "../";
import {
  contextIds,
  contextSharing,
  MANAGE_COMPANY_ROUTES,
  screenContext,
} from "../../utils";

const SelectCompanyDropdown = ({
  options,
  onSelect,
  label,
  setSubmitting,
  setResponseList,
  method,
  defaultPayload,
  payloadKey,
  value,
}) => {
  const history = useHistory();

  const onNavigationClick = () => {
    contextSharing.setContext(contextIds.planDetails, {
      from: screenContext.plan,
    });
    setSubmitting(true);
    window.setTimeout(() => {
      history.push({
        pathname: `${MANAGE_COMPANY_ROUTES.INCORPORATION_DETAILS}/add`,
      });
    }, 1);
  };
  return (
    <div loaderText="" className="dropdside-custom-dropdown d-flex flex-column">
      <div>
        <DropdownWithAjaxSearch
          label={label}
          options={options}
          onSelect={onSelect}
          setResponseList={setResponseList}
          method={method}
          defaultPayload={defaultPayload}
          payloadKey={payloadKey}
          value={value}
        />
      </div>
      <div className="line-separator"></div>
      <Link onClick={onNavigationClick} className="navigation-link">
        Create new company
      </Link>
    </div>
  );
};

export default SelectCompanyDropdown;
