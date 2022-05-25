import React, { createContext, useReducer } from "react";
import { managePayrollReducer } from "../reducers";
import { FLOW_TYPES } from "../../../shared/utils";

const initialState = {
  selectedMenu: "",
  flow: FLOW_TYPES.ADD,
  showToast: false,
  toastMessage: "",
  api: {
    isFetching: false,
    isError: false,
    data: {},
    error: null,
  },
};

const DataContext = createContext(initialState);

const ManagePayrollProvider = ({ children }) => {
  const [state, dispatch] = useReducer(managePayrollReducer, initialState);
  const context = { state, dispatch };
  return (
    <DataContext.Provider value={context}>{children}</DataContext.Provider>
  );
};

export { DataContext as managePayrollStore, ManagePayrollProvider };
