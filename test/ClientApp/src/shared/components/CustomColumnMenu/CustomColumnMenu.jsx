import * as React from 'react';
import {
  GridColumnMenuCheckboxFilter,
} from "@progress/kendo-react-grid";
import tableContent from "../../mocks/tableContent.json"
import { GridColumnMenuSort, GridColumnMenuFilter, GridColumnMenuItemGroup, GridColumnMenuItem, GridColumnMenuItemContent } from '@progress/kendo-react-grid';
const columns_test = [
    {
      title: "Plan Id",
      field: "PlanID",
      show: true,
      filter: "numeric",
    },
    {
      title: "First Name",
      field: "FirstName",
      show: true,
      filter: "text",
    },
    {
        title: "Last Name",
        field: "LastName",
        show: true,
        filter: "text",
      },
  ];
const CustomColumnMenu = props => {
  const [columns, setColumns] = React.useState(columns_test);
  const [columnsExpanded, setColumnsExpanded] = React.useState(false);
  const [filterExpanded, setFilterExpanded] = React.useState(false);
  const onToggleColumn = id => {
    const newColumns = columns.map((column, idx) => {
      return idx === id ? { ...column,
        show: !column.show
      } : column;
    });
    setColumns(newColumns);
  };
console.log({props});
  const onReset = event => {
    event.preventDefault();
    const newColumns = props.columns.map(col => {
      return { ...col,
        show: true
      };
    });
    setColumns(newColumns);
    props.onColumnsSubmit(newColumns);

    if (props.onCloseMenu) {
      props.onCloseMenu();
    }
  };

  const onSubmit = event => {
    if (event) {
      event.preventDefault();
    }

    props.onColumnsSubmit(columns);

    if (props.onCloseMenu) {
      props.onCloseMenu();
    }
  };

  const onMenuItemClick = () => {
    const value = !columnsExpanded;
    setColumnsExpanded(value);
    setFilterExpanded(value ? false : filterExpanded);
  };

  const onFilterExpandChange = value => {
    setFilterExpanded(value);
    setColumnsExpanded(value ? false : columnsExpanded);
  };

  const oneVisibleColumn = columns.filter(c => c.show).length === 1;
  return <div>

        <GridColumnMenuSort {...props}/>


        {/* <GridColumnMenuFilter {...props} onExpandChange={onFilterExpandChange} expanded={filterExpanded} />  */}

        <GridColumnMenuCheckboxFilter
        {...props}
        data={props.tableData}
        expanded={true}
        />
        
        {/* <GridColumnMenuItemGroup>
          <GridColumnMenuItem title={'Columns'} iconClass={'k-i-columns'} onClick={onMenuItemClick} />
          <GridColumnMenuItemContent show={columnsExpanded}>
            <div className={'k-column-list-wrapper'}>
              <form onSubmit={onSubmit} onReset={onReset}>
                <div className={'k-column-list'}>
                  {columns.map((column, idx) => <div key={idx} className={'k-column-list-item'}>
                                    <span>
                                      <input id={`column-visiblity-show-${idx}`} className="k-checkbox" type="checkbox" readOnly={true} disabled={column.show && oneVisibleColumn} checked={column.show} onClick={() => {
                    onToggleColumn(idx);
                  }} />
                                      <label htmlFor={`column-visiblity-show-${idx}`} className="k-checkbox-label" style={{
                    userSelect: 'none'
                  }}>
                                        {column.title}
                                      </label>
                                    </span>
                                  </div>)}
                </div>
                <div className={'k-actions k-hstack k-justify-content-stretch'}>
                  <button type={'reset'} className={'k-button'}>Reset</button>
                  <button className={'k-button k-primary'}>Save</button>
                </div>
              </form>
            </div>
          </GridColumnMenuItemContent>
        </GridColumnMenuItemGroup> */}
      </div>;
};

export default CustomColumnMenu;