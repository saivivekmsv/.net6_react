import { faTimes } from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toLower } from "lodash";
import React, { useState, useEffect } from "react";
import { Button, Image, Form, InputGroup } from "react-bootstrap";
import {
  ManageMaintenanceLayout,
  FieldInput,
  AddPlans,
  LoaderWrapper,
  SliderPanel,
  FieldTextarea,
  Link,
  CsplTable as Table,
  FormControl,
  Dropside,
  FormControlSearch,
} from "../../../components";

const FiltersDropDown = ({
  label,
  options,
  value,
  name,
  disabled,
  onSelect,
  isLoading,
  height,
  width,
  maxHeight,
  zIndex,
  background,
  position,
  isTypeAhead,
  placeholder,
  hideSelectedOptions,
}) => {
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [queriedValue, setQueriedValue] = useState("");
  const [transformedValues, setTransformedValues] = useState([]);
  const totalSelected = selectedOptions.length;
  const isAllSelected = totalSelected === options.length;

  useEffect(() => {
    const selectedOptionsOnMount = [];
    setTransformedValues(
      options.map((item) => {
        if ((value || []).includes(item.value)) {
          selectedOptionsOnMount.push(item);
        }
        return {
          ...item,
          checked: (value || []).includes(item.value),
        };
      })
    );
    setSelectedOptions(selectedOptionsOnMount);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onValueChange = (selectedItem) => {
    const totalChecked = [];
    setTransformedValues(
      transformedValues.map((item) => {
        const checked =
          selectedItem.value === item.value ? !item.checked : item.checked;
        if (checked) {
          totalChecked.push(item);
        }
        return {
          ...item,
          checked,
        };
      })
    );
    onSelect(totalChecked.map(({ value }) => value));
    setSelectedOptions(totalChecked);
  };

  const onSelectAllClick = () => {
    setTransformedValues(
      transformedValues.map((item) => ({
        ...item,
        checked: isAllSelected ? false : true,
      }))
    );
    const allSelectedOptions = isAllSelected ? [] : options;
    setSelectedOptions(allSelectedOptions);
    onSelect(allSelectedOptions.map(({ value }) => value));
  };

  const clearChecked = () => {
    setTransformedValues(
      transformedValues.map((item) => ({
        ...item,
        checked: isAllSelected ? true : false,
      }))
    );
    const checkedOptions = isAllSelected ? options : [];
    setSelectedOptions([]);
    onSelect(checkedOptions.map(({ value }) => value));
  };

  const rowItemFocus = (e, isFocus) => {
    const targetElement = e.target.parentElement;
    if (targetElement) {
      const classNames = targetElement.getAttribute("class");
      if (isFocus) {
        targetElement.setAttribute("class", `${classNames} focus`);
      } else {
        targetElement.setAttribute("class", classNames.replace(" focus", ""));
      }
    }
  };

  const optionsItem = [];
  transformedValues.forEach((item) => {
    if (!queriedValue || toLower(item.label).includes(queriedValue)) {
      if (disabled) {
        if (item.checked) {
          optionsItem.push(
            <Form.Check
              custom
              name={name}
              disabled={disabled}
              type="checkbox"
              label={item.label}
              checked={item.checked}
              id={`custom-radio-${name}-${item.value}`}
              key={`custom-radio-${name}-${item.value}`}
            />
          );
        }
      } else {
        optionsItem.push(
          <Form.Check
            custom
            name={name}
            disabled={disabled}
            type="checkbox"
            label={item.label}
            checked={item.checked}
            onFocus={(e) => rowItemFocus(e, true)}
            onBlur={(e) => rowItemFocus(e, false)}
            id={`custom-radio-${name}-${item.value}`}
            key={`custom-radio-${name}-${item.value}`}
            onChange={() => onValueChange(item)}
          />
        );
      }
    }
  });
  const changeHandler = (e) => {
    setQueriedValue(toLower(e.target.value));
  };
  const className = disabled ? " disabled" : "";

  return (
    <div
      className={`multiselect-dropdown-wrapper ${className}`}
      style={{ height, width, maxHeight, zIndex, background, position }}
    >
      <LoaderWrapper isLoading={isLoading}>
        <div className="w-100 h-100 dropdown-items">
          <FormControl label={label}>
            {isTypeAhead && (
              <div className="search-wrapper">
                <InputGroup>
                  <InputGroup.Prepend>
                    <InputGroup.Text className="company-search-button">
                      <Image src="/assets/icons/svg/search.svg" />
                    </InputGroup.Text>
                  </InputGroup.Prepend>
                  <FormControlSearch
                    placeholder={placeholder}
                    autoFocus
                    type="text"
                    size="xs"
                    onChange={changeHandler}
                  />
                </InputGroup>
              </div>
            )}
            {/* <div className="button-wrapper">
              {!disabled && (
                <span className="total-selected">
                  {totalSelected > 0 && `(${totalSelected} selected) `}
                </span>
              )}
              {!disabled && (
                <Button
                  className="select-all-btn"
                  variant="link"
                  type="button"
                  onClick={onSelectAllClick}
                >
                  {!isAllSelected ? "Select All" : "Unselect All"}
                </Button>
              )}
            </div> */}
          </FormControl>
          {!hideSelectedOptions && selectedOptions.length > 0 && (
            <div className="selected-options">
              {selectedOptions.map((item) => {
                return (
                  <div
                    key={`${name}-${item.value}`}
                    className="selected-options-item"
                  >
                    <div className="d-flex w-100">
                      <div>{item.label}</div>
                      <Button
                        onClick={() => onValueChange(item)}
                        variant="link"
                      >
                        <FontAwesomeIcon icon={faTimes} />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          <div className="d-flex flex-column options">
            <div style={{ display: "flex", marginBottom: "10px" }}>
              <Link
                className="link blue-small"
                disabled={disabled}
                // type="checkbox"
                // onClick={isAllSelected}
                id={`custom-radio-${name}-selectall`}
                key={`custom-radio-${name}-selectall`}
                onFocus={(e) => rowItemFocus(e, true)}
                onBlur={(e) => rowItemFocus(e, false)}
                onClick={onSelectAllClick}
                style={{ marginLeft: "20px" }}
              >
                {!isAllSelected ? "Select All" : "Unselect All"}
              </Link>
              {/* <Form.Check
                custom
                name={name}
                disabled={disabled}
                type="checkbox"
                label={!isAllSelected ? "Select All" : "Unselect All"}
                checked={isAllSelected}
                id={`custom-radio-${name}-selectall`}
                key={`custom-radio-${name}-selectall`}
                onFocus={(e) => rowItemFocus(e, true)}
                onBlur={(e) => rowItemFocus(e, false)}
                onChange={onSelectAllClick}
              /> */}
              <div style={{ marginLeft: "12rem" }}>
                <Link className="link red-small" onClick={() => clearChecked()}>
                  Clear
                </Link>
              </div>
            </div>
            {optionsItem}
          </div>
        </div>
      </LoaderWrapper>
    </div>
  );
};

FiltersDropDown.defaultProps = {
  options: [],
  value: [],
  hideSelectedOptions: true,
};
export default FiltersDropDown;
