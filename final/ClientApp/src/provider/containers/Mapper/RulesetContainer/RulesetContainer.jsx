import React, { useState } from "react";
import { ManageMapperLayout } from "../../../components";
import { Image, InputGroup, Button, Form, Card } from "react-bootstrap";
import { Select } from "../../../components";
import { getPathWithParam, MANAGE_MAPPER_ROUTES } from "../../../utils";
import { useRouterParams } from "../../../abstracts";
const rulesetData = [
  {
    label: "Payroll & Census Ruleset",
    value: 0,
    rulesetName: "Payroll & Census Ruleset",
    description: "Payroll & Census Ruleset",
  },
  {
    label: "Census Ruleset",
    value: 1,
    rulesetName: "Census Ruleset",
    description: "Census Ruleset",
  },
  {
    label: "Payroll Ruleset",
    value: 2,
    rulesetName: "Payroll Ruleset",
    description: "Payroll Ruleset",
  },
];

const RulesetContainer = (props) => {
  const [Rulesets, setRulesets] = useState(rulesetData);
  const [selectedRuleset, setselectedRuleset] = useState(null);
  const { flow, profileId } = useRouterParams();

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
      link: getPathWithParam({
        path: `${MANAGE_MAPPER_ROUTES.SCHEDULER}`,
        pathParam: [flow, profileId],
      }),
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
        <div
          style={{
            fontSize: "14px",
            marginTop: "1.5rem",
            marginBottom: "1rem",
          }}
        >
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
