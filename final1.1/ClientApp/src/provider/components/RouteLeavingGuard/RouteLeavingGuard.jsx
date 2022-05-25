import React, { useEffect, useState } from "react";
import { Prompt } from "react-router-dom";
import { Button } from "react-bootstrap";
import WarningModal from "../WarningModal";

const RouteLeavingGuard = ({
  when,
  navigate,
  shouldBlockNavigation,
  onRefresh,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [lastLocation, setLastLocation] = useState(null);
  const [confirmedNavigation, setConfirmedNavigation] = useState(false);

  useEffect(() => {
    window.onbeforeunload = (e) => {
      e.preventDefault();
      return when ? "Your changes may be lost. Do you want to continue?" : null;
    };
  }, [when]);

  const closeModal = () => {
    setModalVisible(false);
  };

  const handleBlockedNavigation = (nextLocation) => {
    if (!confirmedNavigation) {
      setModalVisible(true);
      setLastLocation(nextLocation);
      return false;
    }
    return true;
  };

  const handleConfirmNavigationClick = () => {
    setModalVisible(false);
    setConfirmedNavigation(true);
    if (onRefresh) {
      onRefresh();
    }
  };

  useEffect(() => {
    if (confirmedNavigation && lastLocation) {
      // Navigate to the previous blocked location with your navigate function
      navigate(lastLocation.pathname);
      setConfirmedNavigation(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [confirmedNavigation, lastLocation]);

  return (
    <>
      <Prompt when={when} message={handleBlockedNavigation} />
      <WarningModal show={modalVisible} onHide={closeModal}>
        <div className="remove-text">
          <h4>Are you sure?</h4>
          <p>Your changes may be lost. Do you want to continue ?</p>
          <Button
            className="remove-btn mr-4"
            onClick={handleConfirmNavigationClick}
          >
            Yes
          </Button>
          <Button className="cancel-btn" onClick={closeModal}>
            No
          </Button>
        </div>
      </WarningModal>
    </>
  );
};
export default RouteLeavingGuard;
