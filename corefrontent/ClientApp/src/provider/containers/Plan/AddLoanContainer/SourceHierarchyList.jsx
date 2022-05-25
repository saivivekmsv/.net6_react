import React, { useState } from "react";
import { isEmpty, get } from "lodash";
import { Field } from "formik";
import { faChevronUp, faChevronDown } from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FormControlIncrement } from "../../../components";
import {
  increaseSourceHierarchy,
  decreaseSourceHierarchy,
} from "../../../contexts";
export const SourceHierarchyList = (props) => {
  const {
    selectedSources,
    selectedsourceHierarchies,
    sourceList,
    state,
    dispatch,
  } = props;
  const sourceHierarchies = get(state, "sourceHierarchy", []);

  var sourcesList = selectedSources.map((e) => ({
    label: e.label,
    id: e.value,
    hierarchyNumber: 0,
  }));

  const requiredSources = !isEmpty(sourceHierarchies)
    ? sourceHierarchies
    : sourcesList;
  console.log(sourcesList, "fjwojwo");

  const Hierarchies = [];
  console.log(Hierarchies, "hierarchies");
  return (
    <>
      <div className="outer-body">
        <div className="inner-body1">
          <div className="text-body1">Sources hierarchy</div>
        </div>
        <div className="second-body">
          <span className="inner-text">Sources Name</span>
          <span className="inner-text2">Withdrawal hierarchy</span>
        </div>
        <hr width="399" />

        {!isEmpty(requiredSources) &&
          requiredSources.map((e, i) => (
            <div className="inner-items">
              <div className="inner-txt">{e.label}</div>
              <div className="inner-field">
                <div className="inner-hierarchy">{e.hierarchyNumber}</div>
                <div className="arrow-btns">
                  <FontAwesomeIcon
                    icon={faChevronUp}
                    onClick={dispatch(increaseSourceHierarchy(sourcesList, e))}
                  />
                  <FontAwesomeIcon
                    icon={faChevronDown}
                    onClick={dispatch(decreaseSourceHierarchy(sourcesList, e))}
                  />
                </div>
              </div>
            </div>
          ))}
      </div>
    </>
  );
};
