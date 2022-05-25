import React, { useEffect, useState } from "react";
import { Prompt } from "react-router-dom";
import { Button } from "react-bootstrap";
import WarningModal from "../WarningModal";

const NotificationPopUp = ({
  when,
  navigate,
  shouldBlockNavigation,
  onRefresh,
  msg,
  onClickOk,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [lastLocation, setLastLocation] = useState(null);
  const [confirmedNavigation, setConfirmedNavigation] = useState(false);

  // useEffect(() => {
  //   window.onbeforeunload = (e) => {
  //     e.preventDefault();
  //     return when ? "Your file is Obselete" : null;
  //   };
  // }, [when]);

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
      //navigate(lastLocation.pathname);
      onClickOk(false);
      setConfirmedNavigation(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [confirmedNavigation, lastLocation]);

  return (
    <>
      <Prompt message={handleBlockedNavigation} />
      <WarningModal show={modalVisible} onHide={closeModal}>
        <div className="remove-text">
          <p>{msg}</p>
          <Button
            className="remove-btn mr-4"
            // onClick={() => {
            //   onClickOk(false);
            //   //setModalVisible(false);
            // }}
            onClick={handleConfirmNavigationClick}
          >
            Ok
          </Button>
          {/* <Button className="cancel-btn" onClick={closeModal}>
            No
          </Button> */}
        </div>
      </WarningModal>
    </>
  );
};
export default NotificationPopUp;
