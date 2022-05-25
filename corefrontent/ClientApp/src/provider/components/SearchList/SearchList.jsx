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
const SearchList = forwardRef((props, ref) => {
  const {
    options = [],
    onSelect,
    label,
    placeholder = "Search",
    isNotTypeAhead,
    disabled,
    height,
    onTypeAheadChange,
    typeAheadChangeDelay = 500,
    isLoading,
    defaultLabel,
    funData,
    setfunData,
    fundataIndex,
  } = props;
  const popupWrapper = useRef(null);
  const popupSearchBox = useRef(null);
  const [query, setQuery] = useState("");
  const [selectedValue, setselectedValue] = useState(null);

  // useImperativeHandle(ref, () => ({
  //   tiggerOnSelect(value, label) {
  //     onSelect(value, label);
  //   },
  // }));

  useEffect(() => {
    const popupSearchBoxDom = popupSearchBox.current;
    if (!isNotTypeAhead && popupSearchBoxDom) {
      window.setTimeout(() => {
        popupSearchBoxDom.focus();
      }, 100);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const keyDown = (e) => {
    if (e.keyCode == 32) {
      e.preventDefault();
      e.target.value += " ";
    }
  };
  const changeHandler = (e) => {
    const val = e.target.value;
    setQuery(val);
    let tempFunData = [...funData];
    tempFunData[fundataIndex].functionName = val;
    setfunData(tempFunData);

    window.clearInterval(typeAheadChangeTimeout);
    typeAheadChangeTimeout = window.setTimeout(() => {
      if (onTypeAheadChange) {
        onTypeAheadChange(val);
      }
    }, typeAheadChangeDelay);
  };

  const popUpOptionsUI = options.map((option) => {
    const { value, label } = option;

    if (
      query.length !== 0 &&
      !label.trim().toLocaleLowerCase().includes(query.toLocaleLowerCase())
    ) {
      return null;
    }
    const checked = selectedValue === value;
    if (selectedValue != null) {
      return <></>;
    }

    if (option.break) {
      return <br />;
    }

    return query.length == 0 ? (
      <></>
    ) : (
      <Dropdown.Item
        ref={ref}
        key={value}
        type="button"
        onClick={() => {
          onSelect(value, label, option.codebox);
          setQuery(label);
          setselectedValue(value);
        }}
        className={checked ? "selected" : ""}
        data-attr={toLower(value)}
        data-attr-label={toLower(label)}
        disabled={disabled}
      >
        {label}
      </Dropdown.Item>
    );
  });
  const transformedDefaultLabel = `Select a ${defaultLabel}`;
  return (
    <LoaderWrapper isLoading={isLoading} className="h-100 m-0 p-0">
      <div ref={popupWrapper} className="searchable-list-wrapper2">
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
                value={funData[fundataIndex].functionName}
                onChange={(a) => {
                  changeHandler(a);
                  setselectedValue(null);
                }}
                onKeyDown={keyDown}
              />
            </InputGroup>
          )}
        </Form.Group>
        <div
          className={`searchable-list overflow-y-auto`}
          style={{
            height: height,
            top: "0px",
            zIndex: "2",
          }}
        >
          {popUpOptionsUI}
        </div>
      </div>
    </LoaderWrapper>
  );
});
export default SearchList;
