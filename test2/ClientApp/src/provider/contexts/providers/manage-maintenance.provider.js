import React, { createContext, useReducer } from "react";
import { manageMaintenanceReducer } from "../reducers";
import { FLOW_TYPES } from "../../utils";

const initialState = {
  selectedMenu: "",
  flow: FLOW_TYPES.ADD,
  showToast: false,
  toastMessage: "",
};

const DataContext = createContext(initialState);

const ManageMaintenanceProvider = ({ children }) => {
  const [state, dispatch] = useReducer(manageMaintenanceReducer, initialState);
  const context = { state, dispatch };
  return (
    <DataContext.Provider value={context}>{children}</DataContext.Provider>
  );
};

export { DataContext as manageMaintenanceStore, ManageMaintenanceProvider };
