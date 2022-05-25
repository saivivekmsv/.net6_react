import React, { useState, useRef } from "react";
import { Select, FieldButtonGroup } from "../../../../shared/components";
import { Formik, Field } from "formik";

function FileInfo(props) {
  let { Data, setData } = props;

    const FileFormatData = [{
        label: "Excel",
        value: 0,
    }, {

        label: "CSV",
        value: 1,
    }]

    const yesNoOptions = [
        {
            label: "Yes",
            value: true,
        },
        {
            label: "No",
            value: false,
        },
    ];

   
  const [DroppedFileName, setDroppedFileName] = useState(null);
  // const [fileFormat, setfileFormat] = useState(null)

  const ExcelComponent = () => {
    const SelectDataFromData = [
      {
        label: "First Sheet",
        value: 0,
      },
      {
        label: "Last Sheet",
        value: 1,
      },
      {
        label: "Sheet Name",
        value: 2,
      },
      {
        label: "Sheet Number",
        value: 3,
      },
    ];

    return (
      <div>
        <div className="Load-def-source-selecttaglabel mb-1">Select Data From</div>
        <Select
          title={`${
            [undefined, null].includes(Data.File["Excel"])
              ? "Select Data From"
              : Data.File["Excel"]["Select Data From"]
          }`}
          optionsList={SelectDataFromData}
          className="bg-transparent"
          onClick={(event) => {
            let TempData = { ...Data };
            TempData.File["Excel"] = {
              ...TempData.File["Excel"],
              "Select Data From": SelectDataFromData[event.target.value].label,
            };
            setData(TempData);
          }}
          value={SelectDataFromData}
          className="mb-3"
        />
        {Data.File["Excel"] &&
        Data.File["Excel"]["Select Data From"] &&
        (Data.File["Excel"]["Select Data From"] == "Sheet Name" ||
          Data.File["Excel"]["Select Data From"] == "Sheet Number") ? (
          <>
            {/* <div>{Data.File["Excel"]["Select Data From"]}</div> */}
            <div className="form-group">
              <label
                className="Load-def-source-selecttaglabel"
                for={Data.File["Excel"]["Select Data From"]}
              >
                {Data.File["Excel"]["Select Data From"]}
              </label>
              <input
                style={{ width: "320px" }}
                className="form-control"
                id={Data.File["Excel"]["Select Data From"]}
                placeholder={Data.File["Excel"]["Select Data From"]}
                onChange={(event) => {
                  let TempData = { ...Data };
                  TempData.File["Excel"] = {
                    ...TempData.File["Excel"],
                    [Data.File["Excel"]["Select Data From"]]:
                      event.target.value,
                  };
                  setData(TempData);
                }}
              />
            </div>
          </>
        ) : (
          <></>
        )}
      </div>
    );
  };

  const CSVComponent = () => {
    return (
      <div>
        <div
          style={{ color: "#828282", fontSize: "12px" }}
          className="form-group mb-3"
        >
          <label for="CSV_Delimiter">Delimiter</label>
          <input
            style={{ width: "320px" }}
            className="form-control"
            id="CSV_Delimiter"
            placeholder="Delimiter"
            onChange={(event) => {
              let TempData = { ...Data };
              TempData.File["CSV"] = {
                ...TempData.File["CSV"],
                Delimiter: event.target.value,
              };
              setData(TempData);
            }}
          />
        </div>
      </div>
    );
  };

  return (
    <Formik>
      <div>
        <div style={{ fontSize: "18px", marginBottom: "20px" }}>
          File Information
        </div>
        <div className="Load-def-source-selecttaglabel mb-1">File format</div>
        <Select
          title={`${
            [undefined, null].includes(Data.File["Selected File Format"])
              ? "Select File Format"
              : Data.File["Selected File Format"]
          }`}
          optionsList={FileFormatData}
          className="bg-transparent"
          onClick={(event) => {
            let TempData = { ...Data };
            TempData.File["Selected File Format"] =
              FileFormatData[event.target.value].label;
            setData(TempData);
          }}
          value={FileFormatData}
          className="mb-3"
        />

        {(() => {
          if (Data.File["Selected File Format"] == FileFormatData[0].label) {
            return ExcelComponent();
          }
          if (Data.File["Selected File Format"] == FileFormatData[1].label) {
            return CSVComponent();
          }
        })()}

                {Data.File["Selected File Format"] && <>
                    {/* <div className="Load-def-source-selecttaglabel" >Has Header</div> */}
                    <Field
                        isRequired
                        name="HasHeader"
                        label="Has Header"
                        size="sm"
                        options={yesNoOptions}
                        selectedValue={Data.File["Has Header"]}
                        onChange={(value) => {
                            let TempData = { ...Data };
                            TempData.File["Has Header"] = value;
                            setData(TempData);
                        }}
                        component={FieldButtonGroup}
                    />
                    {
                        Data.File["Has Header"] && <Field
                            isRequired
                            name="HeaderCountMismatch"
                            label="Check for Header Count Mismatch"
                            size="sm"
                            options={yesNoOptions}
                            selectedValue={Data.File["Header Count Mismatch"]}
                            onChange={(value) => {
                                let TempData = { ...Data };
                                TempData.File["Header Count Mismatch"] = value;
                                setData(TempData);
                            }}
                            component={FieldButtonGroup}
                        />
                    }
                    <br />
                    <div className="form-group">
                        <label className="Load-def-source-selecttaglabel" for="ContentStartsFrom" >Content Starts From (Row)</label>
                        <input style={{ width: '320px' }} className="form-control mb-3" id="ContentStartsFrom" placeholder="Content Starts From" onChange={(event) => {
                            let TempData = { ...Data };
                            TempData.File["Excel"] = { ...TempData.File["Excel"], "Content Starts From": event.target.value };
                            setData(TempData);
                        }} />
                    </div>
                    <div className="Load-def-source-selecttaglabel mb-2">Upload Source File</div>
                    <div className='p-3 mb-3' style={{ textAlign: 'center', borderWidth: '1px', borderStyle: 'dashed', borderColor: "lightgrey" }}
                        //  onDragEnter={(event) => { setisDropped(true) }} onDragLeave={(event) => { setisDropped(false)}} onDrop={(event)=>{event.preventDefault()}}
                        onDragOver={(event) => {
                            event.stopPropagation();
                            event.preventDefault();
                        }} onDrop={(e) => {
                            e.preventDefault();
                            if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                                console.log("dhanraj", e.dataTransfer.files[0].name.split('.')[1])
                                const file_extention = e.dataTransfer.files[0].name.split('.')[1];
                                if ((file_extention == "csv") || (file_extention == "xlsx") || (file_extention == "xls")) {
                                    setDroppedFileName(e.dataTransfer.files[0].name)
                                    document.getElementById("input_element").files = e.dataTransfer.files;
                                    e.dataTransfer.clearData()
                                }
                                else if(file_extention){
                                    setDroppedFileName("Error - Accepted File Type : csv, xlsx, xls")
                                }
                            }
                        
              }}
            >
              <i className="fas fa-upload"></i>
              <div style={{ fontSize: "12px" }}>
                Drag & drop here
                <br />
                or
                <br />{" "}
                <span
                  onClick={() => {
                    document.getElementById("input_element").click();
                  }}
                  style={{ color: "blue", cursor: "pointer" }}
                >
                  {" "}
                  Browse file{" "}
                </span>
                <input
                  id="input_element"
                  type="file"
                  accept=".xls,.xlsx,.csv"
                  onChange={(e) => {
                    setDroppedFileName(
                      document.getElementById("input_element").files
                        ? document.getElementById("input_element").files[0].name
                        : ""
                    );
                  }}
                  style={{ display: "none" }}
                />
              </div>
            </div>
            {DroppedFileName ? (
              <div className="d-flex align-items-center">
                <div>{DroppedFileName}</div>
                <i
                  onClick={() => {
                    document.getElementById("input_element").files = null;
                    setDroppedFileName(null);
                  }}
                  className="fal fa-times ml-3"
                  style={{ color: "red" }}
                ></i>
              </div>
            ) : (
              <></>
            )}
            <div className="Load-def-source-selecttaglabel">
              Accepted File Type : csv, xlsx, xls
            </div>
          </>
        
        }
      </div>
    </Formik>
  );
}

export default FileInfo;
