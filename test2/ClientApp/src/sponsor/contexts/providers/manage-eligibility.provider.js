import React, { createContext, useReducer } from "react";
import { manageEligibilityReducer } from "../reducers";
import { FLOW_TYPES } from "../../../shared/utils";

const initialState = {
  selectedMenu: "",
  flow: FLOW_TYPES.ADD,
  showToast: false,
  toastMessage: "",
};

const DataContext = createContext(initialState);

const ManageEligibilityProvider = ({ children }) => {
  const [state, dispatch] = useReducer(manageEligibilityReducer, initialState);
  const context = { state, dispatch };
  return (
    <DataContext.Provider value={context}>{children}</DataContext.Provider>
  );
};

export { DataContext as manageEligibilityStore, ManageEligibilityProvider };
