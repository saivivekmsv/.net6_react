import React, { useState } from "react";
import { Button } from "react-bootstrap";
import { useDeepEffect } from "../../abstracts";
import WarningModal from "../WarningModal";

const TabLeavingGuard = ({
  isInnerFormDirty,
  setIsInnerFormDirty,
  setkeyValue,
  nextkeyValue,
  keyValue,
  setNextkeyValue,
}) => {
  const [modalVisible, setModalVisible] = useState(false);

  const closeModal = () => {
    setModalVisible(false);
  };

  const handleConfirmNavigationClick = () => {
    setkeyValue(nextkeyValue);
    setModalVisible(false);
    setIsInnerFormDirty(false);
  };

  const handleCancelClick = () => {
    setNextkeyValue(keyValue);
    closeModal();
  };

  const menuChange = () => {
    if (isInnerFormDirty) {
      setModalVisible(true);
    } else {
      setkeyValue(nextkeyValue);
    }
  };

  useDeepEffect(
    () => {
      if (keyValue !== nextkeyValue) {
        menuChange();
      }
    },
    [keyValue, nextkeyValue],
    true
  );

  return (
    <WarningModal show={modalVisible} onHide={handleCancelClick}>
      <div className="remove-text">
        <h4>Are you sure?</h4>
        <p>Your changes may be lost. Do you want to continue ?</p>
        <Button
          className="remove-btn mr-4"
          onClick={handleConfirmNavigationClick}
        >
          Yes
        </Button>
        <Button className="cancel-btn" onClick={handleCancelClick}>
          No
        </Button>
      </div>
    </WarningModal>
  );
};
export default TabLeavingGuard;
