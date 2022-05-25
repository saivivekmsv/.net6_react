import React from "react";
import { SearchableList } from "..";

const PlanTypeList = ({ data, onSelect }) => {
  return (
    <div className="">
      <div>
        <SearchableList
          label="Select Plan Type"
          options={data}
          onSelect={onSelect}
          isNotTypeAhead
        />
      </div>
    </div>
  );
};

export default PlanTypeList;
