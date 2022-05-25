import React, { useCallback, useState, createRef } from "react";
import { useDropzone } from "react-dropzone";
import { Row, Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUpload,
  faTimes,
  faExclamationSquare,
} from "@fortawesome/pro-light-svg-icons";
import { useDeepEffect } from "../../abstracts";
import { Link } from "react-router-dom";
// import blobPath from "../../mocks/blobPath.json";
import { faBlindsOpen } from "@fortawesome/pro-solid-svg-icons";

const CompanyLogoUpload = (props) => {
  const {
    setFieldValue,
    label,
    name,
    blockDrag,
    id,
    imageFile,
    setImageFile,
    companyImage,
    validationCount,
    setValidationCount,
  } = props;
  const [isUploadSuccess, setIsUploadSuccess] = useState(false);
  const [isFormatSupported, setIsFormatSupported] = useState(false);
  const [isFileSizeExceeded, setIsFileSizeExceeded] = useState(false);
  const MAX_FILE_SIZE = 1000000;

  useDeepEffect(() => {
    let file = imageFile ? imageFile[0] : null;
    setIsFormatSupported(false);
    setIsFileSizeExceeded(false);
    if (file && ["image/jpeg", "image/png", "image/jpg"].includes(file.type)) {
      setIsFormatSupported(true);
      if (file.size > MAX_FILE_SIZE) {
        setIsFileSizeExceeded(true);
      }
    }
  }, [imageFile]);
  const dropzoneRef = createRef();
  const openDialog = () => {
    if (dropzoneRef.current) {
      dropzoneRef.current.open();
    }
  };
  const onDrop = useCallback(
    (acceptedFiles) => {
      //   setImageFile([...acceptedFiles]);
      setImageFile(
        acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        )
      );
      //   var jsonData = blobPath;
      //   var imageUrl = JSON.parse(jsonData);
      //   imageUrl.push({[id]:acceptedFiles[0].preview});
      //   blobPath=JSON.stringify(imageUrl);
      //   blobPath[id]=acceptedFiles[0].preview;
      //   setFieldValue(name, acceptedFiles[0].preview);

      if (acceptedFiles.length === 0) {
        setIsUploadSuccess(false);
      } else {
        setIsUploadSuccess(true);
      }
    },
    [imageFile]
  );

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
    open,
  } = useDropzone({
    onDrop,
    noClick: true,
    multiple: false,
    disabled: blockDrag,
    noKeyboard: true,
  });

  const removeFile = (file) => () => {
    const newFiles = [...imageFile];
    newFiles.splice(newFiles.indexOf(file), 1);
    setImageFile([]);
    setIsUploadSuccess(false);
  };

  const displaySize = (file) => {
    let size = (file?.size / 1024).toFixed(2);
    if (isFileSizeExceeded && isFormatSupported) {
      return <span className="color-red">{size} KB</span>;
    } else {
      return size + " KB";
    }
  };

  const validationMessage = (file) => {
    if (isFormatSupported) {
      if (isFileSizeExceeded) {
        setValidationCount(1);
        return (
          <span className="color-red">
            <FontAwesomeIcon icon={faExclamationSquare} /> Your file size is too
            large, Max file size : 1 MB
          </span>
        );
      } else {
        setValidationCount(0);
        return (
          <div>
            <span>Accepted file : jpeg, png, jpg</span>
            <span className="file-type">Max File Size : 1 MB</span>
          </div>
        );
      }
    } else {
      setValidationCount(1);
      return (
        <div className="color-red">
          <FontAwesomeIcon icon={faExclamationSquare} /> Unsupported file format
        </div>
      );
    }
  };

  const saveDropZoneStyle = isDragActive
    ? "upload-image highlight-border"
    : "upload-image";
  const editDropZoneStyle = blockDrag
    ? "upload-image grey-bg"
    : saveDropZoneStyle;
  const uploadedClassStyle =
    isFormatSupported && !isFileSizeExceeded
      ? "uploaded-image"
      : "uploaded-image error";

  return (
    <div>
      <label className="label-text">{label}</label>
      <div
        ref={dropzoneRef}
        {...getRootProps({ className: "dropzone  w-100" })}
      >
        <input name={name} {...getInputProps()} />
        {!isUploadSuccess && (
          <>
            {companyImage ? (
              <div>
                <div className={uploadedClassStyle}>
                  <div>
                    <img src={companyImage} className="image-boundary" alt="" />
                    {console.log("imageFile", imageFile)}
                    <div className="font-12">
                      <span
                        style={{
                          width: "150px",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {/* {imageFile[0].name} */}
                      </span>
                      {
                        <span
                          className="ml-4"
                          style={{ cursor: "pointer" }}
                          onClick={removeFile(imageFile[0])}
                        >
                          {!blockDrag && (
                            <FontAwesomeIcon
                              icon={faTimes}
                              color={"#ff0000"}
                              style={{ marginLeft: "25px" }}
                            />
                          )}
                        </span>
                      }
                      <br />
                      {displaySize(imageFile[0])}
                      <br />
                      <br />
                    </div>

                    {!blockDrag && (
                      <div className="font-12">
                        <FontAwesomeIcon icon={faUpload} />
                        <br />
                        Drag & drop here or
                        <Link className="link-text" onClick={open}>
                          {" "}
                          Browse Image{" "}
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
                <div className="file-type pt-2">
                  {" "}
                  {validationMessage(imageFile[0])}{" "}
                </div>
              </div>
            ) : (
              <div className="w-80">
                <div className={saveDropZoneStyle}>
                  <FontAwesomeIcon icon={faUpload} />
                  <p> Drag & drop here</p>
                  <p> or</p>
                  <p className="link-text" onClick={open}>
                    {" "}
                    Browse Image
                  </p>
                </div>
                <div className="pt-2">
                  <span className="file-type">
                    Accepted file : jpeg, png, jpg
                  </span>
                  <span className="file-size">Max File Size : 1 MB</span>
                </div>
              </div>
            )}
          </>
        )}
        {isUploadSuccess && (
          <div>
            <div className={uploadedClassStyle}>
              <div>
                <img
                  src={imageFile[0].preview}
                  className="image-boundary"
                  alt=""
                />
                {console.log("imageFile", imageFile)}
                <div className="font-12">
                  <span
                    style={{
                      width: "150px",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {imageFile[0].name}
                  </span>
                  {
                    <span
                      className="ml-4"
                      style={{ cursor: "pointer" }}
                      onClick={removeFile(imageFile[0])}
                    >
                      {!blockDrag && (
                        <FontAwesomeIcon
                          icon={faTimes}
                          color={"#ff0000"}
                          style={{ marginLeft: "25px" }}
                        />
                      )}
                    </span>
                  }
                  <br />

                  {displaySize(imageFile[0])}
                  <br />
                  <br />
                </div>

                {!blockDrag && (
                  <div className="font-12">
                    <FontAwesomeIcon icon={faUpload} />
                    <br />
                    Drag & drop here or
                    <Link className="link-text" onClick={open}>
                      {" "}
                      Browse Image{" "}
                    </Link>
                  </div>
                )}
              </div>
            </div>
            <div className="file-type pt-2">
              {" "}
              {validationMessage(imageFile[0])}{" "}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyLogoUpload;
