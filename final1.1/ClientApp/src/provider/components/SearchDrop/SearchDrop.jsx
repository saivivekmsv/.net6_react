import React, { useState, useEffect } from "react";
import { FormControl } from "../";
import { FormGroup, Form, InputGroup, Dropdown } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/pro-light-svg-icons";
import { toLower, isEmpty } from "lodash";

const SearchDrop = ({ field, form, ...rest }) => {
  const { name, value } = field;
  const { onChange, handleChange, setStatus, status } = form;
  const { options, height, ref, onSelect } = rest;
  const [selectedValue, setSelectedValue] = useState("");
  const [focusClass, setFocus] = useState("");
  const [search, SetSearch] = useState([]);
  // console.log(field, "field");
  // console.log(form, "fomr");
  // console.log(rest, "rest");
  // console.log(search, "search");
  useEffect(() => {
    if (!isEmpty(value)) {
      SetSearch(
        options.filter((e) => toLower(e.label).includes(toLower(value)))
      );
    }
  }, [value, options]);

  const popUp =
    !isEmpty(search) &&
    search.map((e, i) => {
      const onItemSelect = (label, value) => {
        setStatus(true);
        onSelect(label);
        SetSearch([]);
      };
      return (
        <div
          style={{
            padding: 0,
            margin: "1rem 0",
            top: "0px",
            zIndex: "2",
            maxWidth: "200px",
          }}
        >
          <Dropdown.Item
            ref={ref}
            key={i}
            type="button"
            onClick={() => onItemSelect(e.label, e.value)}
            style={{ padding: "0.25rem" }}
            data-attr={toLower(value)}
            data-attr-label={toLower(e.label)}
            disabled={rest.disabled}
          >
            {e.label}
          </Dropdown.Item>
        </div>
      );
    });

  return (
    <FormControl {...field} {...form} {...rest}>
      <InputGroup style={{ maxWidth: "200px", flexWrap: "none" }}>
        <Form.Control
          name={name}
          type="text"
          value={value}
          placeholder={rest.placeholder}
          onChange={handleChange}
        />

        {/* <InputGroup.Prepend style={{border: "1px solid #949494",borderRadius:"0.25rem", borderLeft: 0}}>
                     <div style={{maxWidth:"1rem"}}>
                        <FontAwesomeIcon icon={faTimes} />
                     </div>
                </InputGroup.Prepend> */}
      </InputGroup>
      {isEmpty(options.find((e) => e.label === value)) && (
        <div
          style={{
            maxHeight: "10rem",
            overflowX: "hidden",
            top: "0px",
            zIndex: "2",
            maxWidth: "200px",
          }}
        >
          {popUp}
        </div>
      )}
    </FormControl>
  );
};

export default SearchDrop;
