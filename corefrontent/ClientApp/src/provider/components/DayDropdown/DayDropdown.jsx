import React from "react";
import { DatePicker } from "../";
import { Form } from "react-bootstrap";

const DayDropdown = ({ fromMonthDate, onSelect, label, value }) => {
  const onDaySelected = (value) => {
    onSelect(value.getDate());
  };
  const fromYear = fromMonthDate
    ? fromMonthDate.getFullYear()
    : new Date().getFullYear();
  const fromMonth = fromMonthDate
    ? fromMonthDate.getMonth()
    : new Date().getMonth();
  const selectedValue =
    fromMonthDate && value
      ? new Date(`${fromYear}/${fromMonth + 1}/${value}`)
      : undefined;
  return (
    <div>
      <Form.Group className="py-0 my-0">
        <Form.Label className="font-weight-500 color-black">
          {label || "Select a Day"}
        </Form.Label>
      </Form.Group>
      <DatePicker
        className={"day-dropdown"}
        onDayClick={onDaySelected}
        activeStartDate={fromMonthDate}
        showNavigation={false}
        showFixedNumberOfWeeks={false}
        value={selectedValue}
      />
    </div>
  );
};

export default DayDropdown;
