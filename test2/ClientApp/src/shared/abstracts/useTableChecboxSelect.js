import { useState } from "react";
import { isEmpty } from "lodash";
import { useDeepEffect } from "./hooks";

export const useTableChecboxSelect = ({ response, listData = [] }) => {
  const [data, setData] = useState([]);
  const [isShowSelected, setIsShowSelected] = useState(false);
  const [isAllChecked, setIsAllChecked] = useState(false);
  const [selectedData, setSeletedData] = useState([]);
  useDeepEffect(() => {
    response.forEach((a) => {
      a.disabled = a.checked = listData.some((_) => _.id === a.id);
    });
    setData(response || []);
  }, [response]);

  useDeepEffect(() => {
    const selectedData = data.filter((item) => item.checked);
    setSeletedData(selectedData);
    setIsAllChecked(!isEmpty(data) && selectedData.length === data.length);
  }, [data]);

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
    toggleShowSelected: () => setIsShowSelected(!isShowSelected),
  };
};
