import React, { createContext, useReducer } from "react";
import { createPlanReducer } from "../reducers";
import { FLOW_TYPES } from "../../../shared/utils";

const initialState = {
  selectedMenu: "",
  flow: FLOW_TYPES.ADD,
  showToast: false,
  toastMessage: "",
};

const DataContext = createContext(initialState);

const CreatePlanProvider = ({ children }) => {
  const [state, dispatch] = useReducer(createPlanReducer, initialState);
  const context = { state, dispatch };
  return (
    <DataContext.Provider value={context}>{children}</DataContext.Provider>
  );
};

export { DataContext as createPlanStore, CreatePlanProvider };
