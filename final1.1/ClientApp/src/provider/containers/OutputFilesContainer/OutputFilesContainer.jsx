import React from "react";
import FilterCard from "./FilterCard";
import OutputFilesTable from "./OutputFilesTable";
import OutputFileTile from "./OutputFileTile";
import sampleData from "./sampleData.json";
import { Formik, Field } from "formik";

function OutputFilesContainer(props) {
  return (
    <Formik
      initialValues={{
        searchTerm: "",
        fromDate: null,
        toDate: null,
        filterValue: 0,
      }}
      onSubmit={() => {}}
      enableReinitialize
      validateOnChange={false}
      validateOnBlur={false}
    >
      {({
        handleChange,
        setFieldValue,
        setFieldError,
        handleSubmit,
        setValues,
        values,
        ...rest
      }) => (
        <div className="w-100">
          <div className="mt-3 mb-4">Output Page</div>
          <hr className="w-100" />
          <FilterCard
            values={values}
            setFieldValue={setFieldValue}
            FileCount={0}
            className="w-100"
          />
          {/* <OutputFilesTable /> */}
          {sampleData.map((file, index) => {
            return (
              <div className="my-2">
                <OutputFileTile
                  OutputFileName={file.OutputFileName}
                  FileType={file.FileType}
                  DateAndTime={file.DateAndTime}
                  SFTPURL={file.SFTPURL}
                  Input={file.Input}
                  Map={file.Map}
                  PlanNames={file.PlanNames}
                  Status={file.Status}
                  Description={file.Description}
                  User={file.User}
                  CanDownload={file.CanDownload}
                />{" "}
              </div>
            );
          })}
        </div>
      )}
    </Formik>
  );
}

export default OutputFilesContainer;
