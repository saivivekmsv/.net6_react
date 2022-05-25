import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { isEmpty, get } from "lodash";
import { Form } from "react-bootstrap";
import { Button } from "react-bootstrap";
import { faPencilAlt } from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  ManageMaintenanceLayout,
  LoaderWrapper,
  CsplTable as Table,
  FieldDropSide,
  SearchableList,
} from "../../../components";
import {
  manageMaintenanceFormNames,
  MANAGE_MAINTENANCE_ROUTES,
  getPathWithParam,
  formFields,
  getFlowBasedFormValues,
  FLOW_TYPES,
} from "../../../utils";
import { useRouterParams, useRequest, useDeepEffect } from "../../../abstracts";
import { getHolidayCalendarMaster } from "../../../services";
import {
  manageMaintenanceStore,
  setManagePageLevelData,
  setManageMaintenancePageLevelData,
} from "../../../contexts";
import { Formik, Field } from "formik";
// import years from "../../../mocks/years.json";
import { useEffect } from "react";

const curr_year = new Date().getFullYear();
// const selectedYear = curr_year;

// eslint-disable-next-line no-undef
const years = _.range(curr_year - 5, curr_year + 6, 1);

const initialValues = {};

const columns = [
  {
    label: "Date",
    className: "column-date",
    columnName: "date",
  },
  {
    label: "Holiday name",
    className: "column-holiday-calendar",
    columnName: "holidayName",
  },
];

const HolidayCalendarContainer = (props) => {
  const { flow, year } = useRouterParams();
  const { state, dispatch } = useContext(manageMaintenanceStore);
  const [filteredResponse] = useState([]);
  const [isLoading] = useState(false);
  var [response, setResponse] = useState([]);
  const [selectedYear, setSelectedYear] = useState(
    get(state, "api.data", curr_year)
  ); //Number.isInteger("api.data")?

  console.log({ state });

  // const year = isEmpty(holidaylist[holidaylist.length - 1])
  // ? " "
  // : holidaylist[holidaylist.length - 1].holidayDate;
  //const yaar = get(formValues,"holidayDate");
  // console.log(year.substring(6));

  const { setRresponse, loading } = useRequest({
    method: getHolidayCalendarMaster,
    payload: selectedYear,
    defaultResponse: [],
  });

  // const [holidays, setHolidays] = useState([]);
  // useDeepEffect(() => {
  //   setSelectedYear(year.substring(6));
  //   // console.log(selectedYear);
  // }, [year]);

  const formName = manageMaintenanceFormNames.HOLIDAY_CALENDAR;
  const fields = formFields[formName];

  useEffect(() => {
    getHolidayCalendarMaster(selectedYear)
      .then((res) => {
        setResponse(JSON.parse(JSON.stringify(res)));
        if (res) {
          // console.log("api triggered")
        }
      })
      .catch((err) => err);
  }, [selectedYear]);

  const buttons = [
    {
      label: "Add Holiday",
      variant: "primary",
      type: "button",
      link: MANAGE_MAINTENANCE_ROUTES.ADD_HOLIDAY,
    },
  ];

  const onFormSubmit = (values) => {
    console.log({ values });
    dispatch(
      setManagePageLevelData({
        formName: formName,
        fieldData: values,
      })
    );
  };
  return (
    <ManageMaintenanceLayout buttons={buttons}>
      <LoaderWrapper>
        {
          <div className="w-100 maintenance-container">
            {/* <div className="title-case">Holiday calendar</div> */}

            <Formik
              initialValues={{
                ...initialValues,
                selectYear: selectedYear,
                ...getFlowBasedFormValues(get(state, formName, {}), flow),
              }}
              onSubmit={onFormSubmit}
              enableReinitialize
              validateOnChange={false}
              validateOnBlur={false}
            >
              {({
                handleChange,
                setFieldValue,
                handleSubmit,
                values,
                ...rest
              }) => {
                const onYearChange = (value) => {
                  setSelectedYear(value);
                  setManageMaintenancePageLevelData(value);
                  setFieldValue(fields.selectYear, value);
                };
                return (
                  <Form
                    autoComplete="off"
                    className="h-100"
                    onSubmit={handleSubmit}
                    validated={!isEmpty(rest.errors)}
                  >
                    <Field
                      size="sm"
                      name={fields.selectYear}
                      value={values[fields.selectYear]}
                      direction="right"
                      isRequired
                      label="Year"
                      popupContent={
                        <SearchableList
                          label="Year"
                          isNotTypeAhead
                          options={years.map((value) => ({
                            label: value,
                            value,
                          }))}
                          onSelect={onYearChange}
                          selectedValue={values[fields.selectYear]}
                        />
                      }
                      component={FieldDropSide}
                    />
                  </Form>
                );
              }}
            </Formik>

            <div className="total-record">
              <p> {response.length} Holiday details found. </p>
            </div>

            <div className="holiday-table">
              <Table isLoading={isLoading}>
                <Table.Thead>
                  <Table.Tr>
                    {columns.map((item, index) => {
                      return (
                        <Table.Th key={index} className={item.className}>
                          {item.label}
                        </Table.Th>
                      );
                    })}
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {response.map((item, index) => {
                    return (
                      <Table.Tr key={index}>
                        <Table.Td className="column-date">
                          {item.holidayDate}
                        </Table.Td>
                        <Table.Td className="column-holiday-calendar">
                          <Link
                            to={getPathWithParam({
                              path: MANAGE_MAINTENANCE_ROUTES.ADD_HOLIDAY,
                              pathParam: [FLOW_TYPES.EDIT, item.id],
                            })}
                          >
                            {item.name}
                          </Link>
                        </Table.Td>
                        {/* <Table.Td className="column-action">
                        <Link
                            to={getPathWithParam({
                              path: MANAGE_MAINTENANCE_ROUTES.ADD_HOLIDAY,
                              pathParam: [FLOW_TYPES.SAVE, item.id],
                            })}
                          >
                            <FontAwesomeIcon icon={faPencilAlt} size="lg" />
                             <Button type="button" size="sm">
            Edit
          </Button> 
                          </Link>
                        </Table.Td>  */}
                      </Table.Tr>
                    );
                  })}
                </Table.Tbody>
              </Table>
            </div>
          </div>
        }
      </LoaderWrapper>
    </ManageMaintenanceLayout>
  );
};

export default HolidayCalendarContainer;
