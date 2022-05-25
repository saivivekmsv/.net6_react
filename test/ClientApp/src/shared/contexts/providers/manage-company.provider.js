import React, { createContext, useReducer } from "react";
import { manageCompanyReducer } from "../reducers";
import { FLOW_TYPES } from "../../utils";

const initialState = {
  selectedMenu: "",
  flow: FLOW_TYPES.ADD,
  showToast: false,
  toastMessage: "",
  states: [],
  sponsoringOrgList: [],
  api: {
    isFetching: false,
    isError: false,
    data: {},
    error: null,
  },
};

const DataContext = createContext(initialState);

const ManageCompanyProvider = ({ children }) => {
  const [state, dispatch] = useReducer(manageCompanyReducer, initialState);
  const context = { state, dispatch };
  return (
    <DataContext.Provider value={context}>{children}</DataContext.Provider>
  );
};

export { DataContext as manageCompanyStore, ManageCompanyProvider };
