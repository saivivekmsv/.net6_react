import React, { useRef, useState } from "react";
import { Image, InputGroup, Button } from "react-bootstrap";
import FormControlSearch from "../FormControlSearch";
import {
  useDeepEffect,
  useDidClickedOutside,
  useRequest,
} from "../../abstracts";
import { get, isEmpty } from "lodash";
import { Loader } from "../LoaderWrapper";


const SearchDropdownWithAPI = ({
  handleSelect,
  placeholder,
  searchPayloadKey,
  method,
  labelKey,
  screen,
}) => {
  const popupDomRef = useRef(null);
  let searchChangeTimeout = null;
  const [searchText, setSearchText] = useState("");
  const [searchValueDisplayed, setSearchValueDisplayed] = useState("");
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const { response, loading } = useRequest({
    method,
    payload: {
      [searchPayloadKey]: searchText.trim(),
      from: 1,
      to: 100,
      showTerminated: true,
    },
    defaultResponse: [],
    triggerOnlyOnUpdate: true,
  });
  const clickedOutside = useDidClickedOutside(popupDomRef);
  const className =
    screen === "plan-group-home"
      ? "form-control-seach-text plan-group-searchbar"
      : "search-with-api-text";
  const size = screen === "plan-group-home" ? "xs" : "lg";
  useDeepEffect(() => {
    if (clickedOutside) {
      setIsPopupOpen(false);
    }
  }, [clickedOutside]);
  const handleSearchChange = (e) => {
    window.clearInterval(searchChangeTimeout);
    const val = e.target.value;
    setSearchValueDisplayed(val);
    if (val.length === 0 || val.length > 2) {
      searchChangeTimeout = window.setTimeout(() => {
        setSearchText(val);
        setIsPopupOpen(true);
      }, 500);
    }
    if (val.length === 0) {
      handleSelect(val);
    }
  };

  const handleOptionSelect = (value) => {
    setSearchValueDisplayed(value);
    setIsPopupOpen(false);
    handleSelect(searchValueDisplayed.trim());
  };

  const onSearchClick = (e) => {
    e.preventDefault();
    handleSelect(searchValueDisplayed.trim());
  };

  return (
    <div className="search-dropdown-api" ref={popupDomRef}>
      <InputGroup>
        <FormControlSearch
          size={size}
          type="search"
          placeholder={placeholder}
          onChange={handleSearchChange}
          onKeyPress={(e) => {
            e.key === "Enter" && onSearchClick(e);
          }}
          className={className}
          value={searchValueDisplayed}
          screen={screen}
        />
        {screen === "plan-group-home" && (
          <div className="search-icon">
            <InputGroup.Append>
              <i class="fal fa-search" aria-hidden="true"></i>
            </InputGroup.Append>
          </div>
        )}
        {screen !== "plan-group-home" && (
          <InputGroup.Append>
            <Button
              variant="link"
              className="search-with-api-button h-100"
              onClick={onSearchClick}
            >
              <Image src="/assets/icons/svg/search.svg" />
            </Button>
          </InputGroup.Append>
        )}
      </InputGroup>
      {isPopupOpen && !isEmpty(searchText) && (
        <div className="d-flex flex-column options-wrapper">
          {loading && (
            <div className="d-flex justify-content-center py-3">
              <Loader size="sm" />
            </div>
          )}
          {!loading &&
            response.map((item) => (
              // eslint-disable-next-line jsx-a11y/anchor-is-valid
              <a
                // eslint-disable-next-line no-script-url
                href="javascript:void(0)"
                className="search-option-item"
                onClick={() => handleOptionSelect(get(item, labelKey, ""))}
              >
                {get(item, labelKey, "")}
              </a>
            ))}
        </div>
      )}
    </div>
  );
};

export default SearchDropdownWithAPI;
