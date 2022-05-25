import React from "react";
import DatePicker from "react-calendar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faAngleRight } from "@fortawesome/pro-light-svg-icons";
import { getSingleCharDayName } from "../../utils";

const CsplDatePicker = ({ onDayClick, value, ...props }) => {
  return (
    <DatePicker
      isOpen
      showNeighboringMonth={false}
      onChange={(value) => onDayClick(value)}
      formatShortWeekday={(val, date) => {
        const dayName = date.getDay();
        return getSingleCharDayName(dayName);
      }}
      value={value ? new Date(value) : new Date()}
      minDetail="decade"
      prev2Label={null}
      next2Label={null}
      prevLabel={<FontAwesomeIcon icon={faAngleLeft} />}
      nextLabel={<FontAwesomeIcon icon={faAngleRight} />}
      {...props}
    />
  );
};

export default CsplDatePicker;
