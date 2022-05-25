import React, { useState } from "react";
import { Tab, Tabs } from "react-bootstrap";
import { TabLeavingGuard } from "../shared/components
import Compensation from "./Compensation";
import Contributions from "./Contributions";
import Hours from "./Hours";
import LoanRepayments from "./LoanRepayments";

const DepositHistory = ({ isInnerFormDirty, setIsInnerFormDirty }) => {
  const [keyValue, setkeyValue] = useState("compensation");
  const [nextkeyValue, setNextkeyValue] = useState(keyValue);

  const menuChange = (key) => {
    setNextkeyValue(key);
  };

  return (
    <div className="deposit_histoy_tabs">
      <Tabs
        mountOnEnter
        unmountOnExit
        onSelect={menuChange}
        activeKey={keyValue}
      >
        <Tab eventKey="compensation" title="Compensation">
          <Compensation {...{ isInnerFormDirty, setIsInnerFormDirty }} />
        </Tab>
        <Tab eventKey="contributions" title="Contributions">
          <Contributions {...{ isInnerFormDirty, setIsInnerFormDirty }} />
        </Tab>
        <Tab eventKey="hours" title="Hours">
          <Hours {...{ isInnerFormDirty, setIsInnerFormDirty }} />
        </Tab>
        <Tab eventKey="loan_repayments" title="Loan Repayments">
          <LoanRepayments {...{ isInnerFormDirty, setIsInnerFormDirty }} />
        </Tab>
      </Tabs>
      <TabLeavingGuard
        {...{
          isInnerFormDirty,
          setIsInnerFormDirty,
          setkeyValue,
          nextkeyValue,
          setNextkeyValue,
          keyValue,
        }}
      />
    </div>
  );
};

export default DepositHistory;
