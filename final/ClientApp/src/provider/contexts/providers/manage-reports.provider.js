import React, { createContext, useReducer } from "react";
import { manageReportsReducer } from "../reducers";
import { FLOW_TYPES } from "../../utils";

const initialState = {
  selectedMenu: "",
  flow: FLOW_TYPES.ADD,
  showToast: false,
  toastMessage: "",
};

const DataContext = createContext(initialState);

const ManageReportsProvider = ({ children }) => {
  const [state, dispatch] = useReducer(manageReportsReducer, initialState);
  const context = { state, dispatch };
  return (
    <DataContext.Provider value={context}>{children}</DataContext.Provider>
  );
};

export { DataContext as manageReportsStore, ManageReportsProvider };
