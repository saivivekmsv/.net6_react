import React, { createContext, useReducer } from "react";
import { manageCensusReducer } from "../reducers";
import { FLOW_TYPES } from "../../utils";

const initialState = {
  selectedMenu: "",
  flow: FLOW_TYPES.ADD,
  showToast: false,
  toastMessage: "",
};

const DataContext = createContext(initialState);

const ManageCensusProvider = ({ children }) => {
  const [state, dispatch] = useReducer(manageCensusReducer, initialState);
  const context = { state, dispatch };
  return (
    <DataContext.Provider value={context}>{children}</DataContext.Provider>
  );
};

export { DataContext as manageCensusStore, ManageCensusProvider };
