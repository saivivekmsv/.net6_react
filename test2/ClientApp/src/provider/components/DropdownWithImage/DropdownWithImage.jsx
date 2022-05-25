import React, {
  useRef,
  forwardRef,
  useImperativeHandle,
  useState,
  useEffect,
} from "react";
import { isEmpty, toLower } from "lodash";
import { Dropdown, InputGroup, Form } from "react-bootstrap";
import LoaderWrapper from "../LoaderWrapper";

let typeAheadChangeTimeout = null;
const DropdownWithImage = forwardRef((props, ref) => {
  const {
    options = [],
    onSelect,
    label,
    placeholder = "Search",
    isNotTypeAhead,

    disabled,
    selectedValue,
    height,
    onTypeAheadChange,
    typeAheadChangeDelay = 500,
    isLoading,
    defaultLabel,
  } = props;
  const popupWrapper = useRef(null);
  const popupSearchBox = useRef(null);
  const [query, setQuery] = useState("");

  useImperativeHandle(ref, () => ({
    tiggerOnSelect(value, label, image) {
      onSelect(value, label, image);
    },
  }));

  useEffect(() => {
    const popupSearchBoxDom = popupSearchBox.current;
    if (!isNotTypeAhead && popupSearchBoxDom) {
      window.setTimeout(() => {
        popupSearchBoxDom.focus();
      }, 100);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const changeHandler = (e) => {
    const val = e.target.value;
    setQuery(val);

    window.clearInterval(typeAheadChangeTimeout);
    typeAheadChangeTimeout = window.setTimeout(() => {
      if (onTypeAheadChange) {
        onTypeAheadChange(val);
      }
    }, typeAheadChangeDelay);
  };

  const popUpOptionsUI = options.map((option) => {
    const { value, label, image } = option;

    if (
      query.length !== 0 &&
      !label.toLocaleLowerCase().includes(query.toLocaleLowerCase())
    ) {
      return null;
    }
    const checked = selectedValue === value;

    if (option.break) {
      return <br />;
    }

    return (
      <Dropdown.Item
        ref={ref}
        key={value}
        as="button"
        type="button"
        onClick={() => onSelect(value, label, image)}
        className={checked ? "selected" : ""}
        data-attr={toLower(value)}
        data-attr-label={toLower(label)}
        disabled={disabled}
      >
        <img src={image} className="dropdown-image" width="20px" alt="" />{" "}
        {label}
      </Dropdown.Item>
    );
  });
  const transformedDefaultLabel = `Select a ${defaultLabel}`;
  return (
    <LoaderWrapper isLoading={isLoading} className="h-100">
      <div ref={popupWrapper} className="searchable-list-wrapper">
        <Form.Group className="searchable-list-input">
          <Form.Label className="searchable-list-label">
            {label || transformedDefaultLabel}
          </Form.Label>
          {!isNotTypeAhead && (
            <InputGroup>
              <Form.Control
                ref={popupSearchBox}
                className="searchable-list-input-text"
                placeholder={placeholder}
                autoFocus
                type="text"
                value={query}
                onChange={changeHandler}
              />
            </InputGroup>
          )}
        </Form.Group>
        <div
          className={`searchable-list overflow-y-auto`}
          style={{
            height: height,
          }}
        >
          {!isLoading && isEmpty(options) && (
            <div className="text-center">No data found</div>
          )}
          {popUpOptionsUI}
        </div>
      </div>
    </LoaderWrapper>
  );
});
export default DropdownWithImage;
