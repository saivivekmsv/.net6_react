import { useState } from "react";
import { find, isEmpty } from "lodash";
import { useDeepEffect } from "./hooks";

export const useWithdrawalTableChecboxSelect = ({ response }) => {
  const [data, setData] = useState(response);
  const [isShowSelected, setIsShowSelected] = useState(false);
  const [isAllChecked, setIsAllChecked] = useState(
    !isEmpty(data) && !data.some((source) => !source.checked)
  );
  const [selectedData, setSeletedData] = useState(
    data?.filter((source) => source.checked)
  );

  useDeepEffect(
    () => {
      const selectedData = data.filter((item) => item.checked);
      setSeletedData(selectedData);
      setIsAllChecked(
        !isEmpty(data) && !data.some((source) => !source.checked)
      );
    },
    [data],
    true
  );

  const onHeaderCheckboxClick = () => {
    const checked = !isAllChecked;
    setIsAllChecked(checked);
    setData(
      data.map((item) => ({
        ...item,
        checked: checked,
      }))
    );
  };

  const setWithEarningsValue = (sourceIndex, val) => {
    setData(
      (data || [])?.map((source, index) => {
        if (index === sourceIndex) {
          return { ...source, withEarningType: val };
        }
        return source;
      })
    );
  };

  const onRowItemClick = (rowItem, rowIndex) => {
    const totalChecked = [];
    const updatedData = data.map((item, index) => {
      const checked =
        rowItem.id === item.id || rowIndex === index
          ? !item.checked
          : item.checked;

      if (checked) {
        totalChecked.push(item);
      }

      return {
        ...item,
        checked,
      };
    });
    setData(updatedData);
    setIsAllChecked(totalChecked.length === data.length);
  };

  return {
    data: isShowSelected ? selectedData : data,
    onHeaderCheckboxClick,
    onRowItemClick,
    isAllChecked,
    selectedData,
    isShowSelected,
    setWithEarningsValue,
    toggleShowSelected: () => setIsShowSelected(!isShowSelected),
  };
};
