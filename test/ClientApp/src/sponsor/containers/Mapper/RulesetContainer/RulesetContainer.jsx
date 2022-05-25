import React, { useState } from "react";
import { ManageMapperLayout } from "../../../../shared/components";
import { Image, InputGroup, Button, Form, Card } from "react-bootstrap";
import { Select } from "../../../../shared/components";
const rulesetData=[{
  label:"Ruleset1",
  value:0,
  rulesetName:"Ruleset1",
  description:"Description for ruleset 1"
},{
  
  label:"Ruleset2",
  value:1,
  rulesetName:"Ruleset2",
  description:"Description for ruleset 2"
},{
  
  label:"Ruleset3",
  value:2,
  rulesetName:"Ruleset3",
  description:"Description for ruleset 3"
}]

const RulesetContainer = (props) => {
  const [Rulesets, setRulesets] = useState(rulesetData);
  const [selectedRuleset, setselectedRuleset] = useState(null);
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

  return (
    <ManageMapperLayout buttons={buttons}>
      <Form style={{ width: "20rem" }}>
        <div className="mb-2">
          <label style={{ fontSize: "12px", color: "grey" }}>Ruleset</label>

          <Select
            title={`${
              [undefined, null].includes(selectedRuleset)
                ? "Select Ruleset"
                : rulesetData[selectedRuleset].label
            }`}
            optionsList={rulesetData}
            className="bg-transparent"
            onClick={(event) => {
              setselectedRuleset(event.target.value);
            }}
            value={rulesetData}
          />
        </div>
        <div className="font-weight-bold my-4" style={{ fontSize: "14px" }}>
          Ruleset Preview
        </div>
        <div>
          <label
            style={{ fontSize: "12px", color: "grey" }}
            for="exampleFormControlTextarea1"
          >
            Ruleset description
          </label>
          <textarea
            style={{ color: "grey", width: "20rem" }}
            className="form-control"
            id="exampleFormControlTextarea1"
            rows="3"
            value={
              Rulesets[selectedRuleset]
                ? Rulesets[selectedRuleset].description
                : ""
            }
            placeholder="Ruleset description"
          />
        </div>
        {/* <SchedularUIcomp/> */}
      </Form>
    </ManageMapperLayout>
  );
};

export default RulesetContainer;
