import React, { useState } from "react";
import { ManageMapperLayout } from "../../../../shared/components";
import { Image, InputGroup, Button, Form, Card } from "react-bootstrap";
import { Select } from "../../../../shared/components";
import FileInfo from "./FileInfo";
import APIInfo from "./APIInfo";

const buttons = [
  {
    label: "Cancel",
    variant: "secondary",
    type: "button",
  },
  {
    label: "Next",
    variant: "primary",
    type: "submit",
  },
];

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

const SourceContainer = (props) => {
  // const [Rulesets, setRulesets] = useState(sourceTypeData);
  const [Data, setData] = useState({
    API: null,
    File: {
      "Selected File Format": null,
      Excel: null,
      CSV: null,
      "Has Header": null,
      "Header Count Mismatch": null,
    },
  });
  const [selectedSourceType, setselectedSourceType] = useState(null);
  return (
    <ManageMapperLayout layoutHeader="Source" buttons={buttons}>
      <div
        style={{ fontSize: "18px", fontWeight: "600"}}
      >
      </div>
      <div style={{ width: "320px" }}>
        <div style={{ color: "#828282", fontSize: "14px" }} className='mb-1'>Type</div>
        <Select
          title={`${
            [undefined, null].includes(selectedSourceType)
              ? "Select Type"
              : sourceTypeData[selectedSourceType].label
          }`}
          optionsList={sourceTypeData}
          className="bg-transparent"
          onClick={(event) => {
            setselectedSourceType(event.target.value);
          }}
          value={sourceTypeData}
        />
        <div style={{ marginTop: "20px" }}>
          {(() => {
            if (selectedSourceType == 0) {
              return <FileInfo Data={Data} setData={setData} />;
            } else if (selectedSourceType == 1) {
              return <APIInfo Data={Data} setData={setData} />;
            }
          })()}
        </div>
      </div>
    </ManageMapperLayout>
  );
};

export default SourceContainer;
