import { isEmpty } from "lodash";
import React, { useState } from "react";
import { SearchableList } from "../";
import { useDeepEffect, useRequest } from "../../abstracts";

const DropdownWithAjaxSearch = ({
  options,
  onSelect,
  label,
  method,
  defaultPayload,
  payloadKey,
  setResponseList,
  value,
}) => {
  const [newPaylaod, setNewPayload] = useState({});
  const { response, loading } = useRequest({
    method,
    payload: {
      ...defaultPayload,
      ...newPaylaod,
    },
    stopTrigger: !isEmpty(options),
  });

  useDeepEffect(() => {
    if (!isEmpty(response)) {
      setResponseList(response);
    }
  }, [response]);

  const onTypeAheadChange = (value) => {
    setNewPayload({ [payloadKey]: value });
  };
  return (
    <SearchableList
      label={label}
      options={options}
      onSelect={onSelect}
      onTypeAheadChange={onTypeAheadChange}
      height="300px"
      isLoading={loading}
      selectedValue={value}
    />
  );
};

export default DropdownWithAjaxSearch;
