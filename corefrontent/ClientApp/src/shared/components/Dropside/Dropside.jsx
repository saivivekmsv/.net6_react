import React, { useState, useRef, useEffect } from "react";
import { Dropdown } from "react-bootstrap";
import { find, findIndex, get, isEmpty, toLower } from "lodash";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarAlt,
  faEllipsisV,
  faTimes,
} from "@fortawesome/pro-light-svg-icons";
import { useDeepEffect, useDidClickedOutside } from "../../abstracts";
import { dropSideContainerStyle, customSelectPopUpState } from "./style";
import Popup from "./Popup";
import Arrow from "./Arrow";
import HiddenSelect from "./HiddenSelect";

//todo: support merging classname and Style from props
const DropSideList = (props) => {
  const {
    options,
    placeholder,
    popupContent,
    value,
    disabled,
    dropdownClassName,
    isMultiSelect,
    isDatePicker,
    direction = "right",
    name,
    label,
    onClear,
    onDefaultClearDisplay = false,
  } = props;
  const [showPopUp, setShowPopUp] = useState(false);
  const [dropdownValue, setDropdownValue] = useState(value);
  const [displayText, setDisplayText] = useState(placeholder || "Select");
  const [displayImage, setDisplayImage] = useState();
  const dropUpRef = useRef();
  const domRef = useRef(null);
  const popupContentRef = useRef();
  const clickedOutside = useDidClickedOutside(domRef);
  const searchTextTimeout = null;

  const getDataByIndex = () => {
    return (
      findIndex(options, {
        value: dropdownValue,
      }) || 0
    );
  };

  const onArrowUp = () => {
    const tiggerOnSelect = get(popupContentRef, "current.tiggerOnSelect");
    const dataIndex = getDataByIndex();
    if (value && tiggerOnSelect && dataIndex > 0) {
      const data = options[dataIndex - 1];
      tiggerOnSelect(data.value, data.label, data.image);
    }
  };

  const onArrowDown = () => {
    const tiggerOnSelect = get(popupContentRef, "current.tiggerOnSelect");
    const dataIndex = getDataByIndex();
    if (tiggerOnSelect && dataIndex < (options || []).length - 1) {
      const data = options[dataIndex + 1];
      tiggerOnSelect(data.value, data.label, data.image);
    }
  };

  const onOtherKeyPress = (char) => {
    const dropdownWrapperDom = domRef.current;
    const currentValue = dropdownWrapperDom.getAttribute("data-attr-label");
    dropdownWrapperDom.setAttribute("data-attr-label", currentValue + char);

    const searchableList = dropdownWrapperDom.querySelector(".searchable-list");
    const newValue = dropdownWrapperDom.getAttribute("data-attr-label");
    const searchedItem = searchableList.querySelector(
      `[data-attr-label^="${toLower(newValue)}"]`
    );
    const searchableInput = dropdownWrapperDom.querySelector(
      ".searchable-list-input-text"
    );
    if (!searchableInput && searchedItem) {
      searchedItem.focus();
    }
    const timeout = searchedItem ? 3000 : 0;
    window.clearTimeout(searchTextTimeout);
    window.setTimeout(() => {
      dropdownWrapperDom.setAttribute("data-attr-label", "");
    }, timeout);
  };

  const onDropdownKeyUp = (e) => {
    if (!showPopUp && e.code === "ArrowUp") {
      onArrowUp();
    } else if (!showPopUp && e.code === "ArrowDown") {
      onArrowDown();
    } else if (showPopUp) {
      const keyChar = e.key || "";
      if (keyChar.match(/^[a-zA-Z0-9]{1}$/i)) {
        onOtherKeyPress(keyChar);
      }
    }
  };

  useEffect(() => {
    const dropdownWrapperDom = domRef.current;
    if (dropdownWrapperDom && !isMultiSelect && !isDatePicker) {
      dropdownWrapperDom.removeEventListener("keyup", onDropdownKeyUp);
      dropdownWrapperDom.addEventListener("keyup", onDropdownKeyUp);
      return () => {
        dropdownWrapperDom.removeEventListener("keyup", onDropdownKeyUp);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dropdownValue, showPopUp]);

  useEffect(() => {
    if (clickedOutside && showPopUp) {
      setShowPopUp(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clickedOutside]);

  useEffect(() => {
    if (!isMultiSelect) {
      setShowPopUp(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  useDeepEffect(() => {
    if (isEmpty(options)) {
      setDisplayText(value);
      setDropdownValue(value);
    } else {
      const filteredTextObj = find(options, {
        value,
      });
      const displayText = get(filteredTextObj, "label", value || "");
      const displayImage = get(filteredTextObj, "image", value || "");
      setDisplayText(displayText);
      setDisplayImage(displayImage);
      setDropdownValue(value);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options, value]);

  function popUpCloseHandler(popUpState) {
    dropUpRef.current = popUpState;
  }

  function handlePopUpToggle(e) {
    e.preventDefault();
    e.stopPropagation();
    if (isMultiSelect || !disabled) {
      setShowPopUp(!showPopUp);
    }
  }

  let selectedValue = (
    <span className="place-holder">{placeholder || "Select"}</span>
  );
  if (displayText) {
    selectedValue = displayText;
  }

  if (!displayText && isDatePicker) {
    selectedValue = <span className="place-holder">MM/DD/YYYY</span>;
  }

  const popUpUI = showPopUp ? (
    <Popup
      options={options}
      renderDown={dropUpRef.current}
      onClose={popUpCloseHandler}
      dropdownWrapperDom={get(domRef, "current", null)}
      setShowPopUp={setShowPopUp}
      direction={direction}
      showPopUp={showPopUp}
    >
      {popupContent &&
        React.cloneElement(popupContent, {
          ref: popupContentRef,
          defaultLabel: label,
          name,
        })}
    </Popup>
  ) : (
    <div style={{ display: "none" }}>
      {popupContent &&
        React.cloneElement(popupContent, {
          ref: popupContentRef,
          defaultLabel: label,
          name,
        })}
    </div>
  );
  const customSelectStyle = showPopUp ? customSelectPopUpState : null;
  let className = disabled ? "disabled" : "";
  className = showPopUp ? `${className} open` : className;

  const onClearClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onClear) {
      onClear();
    }
  };
  const getArrow = () => {
    if (isDatePicker) {
      if (!disabled) {
        return (
          <div className="date-picker-wrapper">
            <div className="date-picker-icon">
              <FontAwesomeIcon icon={faCalendarAlt} />
            </div>
            {(value || onDefaultClearDisplay) && (
              <div className="clear-date" onClick={onClearClick}>
                <FontAwesomeIcon icon={faTimes} size="sm" />
              </div>
            )}
          </div>
        );
      } else {
        return null;
      }
    }

    if (!isMultiSelect || (isMultiSelect && !disabled)) {
      return (
        <Arrow
          disabled={disabled}
          showPopup={showPopUp}
          direction={direction}
        />
      );
    }

    if (isMultiSelect && disabled) {
      return (
        <div
          className="disabled-multiselect-dots"
          onMouseOver={handlePopUpToggle}
          onMouseOut={handlePopUpToggle}
        >
          <FontAwesomeIcon icon={faEllipsisV} size="3x" />
        </div>
      );
    }
  };

  return (
    <Dropdown
      as="button"
      className={`form-control dropSide ${className} ${
        dropdownClassName || ""
      }`}
      ref={domRef}
      style={{ ...dropSideContainerStyle }}
      type="button"
      disabled={disabled}
      onClick={handlePopUpToggle}
      name={name}
    >
      <HiddenSelect options={options} value={value} />
      <div
        style={customSelectStyle}
        className="dropSide-custom-select"
        title={displayText}
      >
        {displayImage ? (
          <img src={displayImage} className={"flag-image"} alt="" />
        ) : (
          ""
        )}{" "}
        {selectedValue}
      </div>
      {getArrow()}
      {popUpUI}
    </Dropdown>
  );
};

export default DropSideList;
