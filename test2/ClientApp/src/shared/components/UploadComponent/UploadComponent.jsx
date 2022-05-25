import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload, faTimes } from "@fortawesome/pro-light-svg-icons";

const UploadComponent = (props) => {
  const { setFieldValue, label, name } = props;
  const [myFiles, setMyFiles] = useState([]);

  const onDrop = useCallback(
    (acceptedFiles) => {
      if (myFiles.length === 0) {
        setMyFiles([...myFiles, ...acceptedFiles]);
        setFieldValue(name, acceptedFiles);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [myFiles]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: ".csv, .xlsx, .xls",
  });

  const removeFile = (file) => () => {
    const newFiles = [...myFiles];
    newFiles.splice(newFiles.indexOf(file), 1);
    setMyFiles(newFiles);
  };

  const files = myFiles.map((file) => (
    <p>
      {file.path}
      <span
        className="ml-4"
        style={{ cursor: "pointer" }}
        onClick={removeFile(file)}
      >
        <FontAwesomeIcon icon={faTimes} color={"#ff0000"} />
      </span>
    </p>
  ));

  return (
    <div>
      {}
      <label className="label-text">{label}</label>
      <div {...getRootProps({ className: "dropzone" })}>
        <input name={name} {...getInputProps()} disabled={myFiles.length} />
        {isDragActive ? (
          <div className="upload-docs">
            <FontAwesomeIcon icon={faUpload} />
            <p> Drag & drop here</p>
            <p> or</p>
            <p className="link-text"> Browse file</p>
          </div>
        ) : (
          <div className="upload-docs">
            <FontAwesomeIcon icon={faUpload} />
            <p> Drag & drop here</p>
            <p> or</p>
            <p className="link-text"> Browse file</p>
          </div>
        )}
      </div>
      <span className="file-type">Accepted File Type : csv, xlsx, xls</span>
      {files}
    </div>
  );
};

export default UploadComponent;
