import React, { useCallback, useState, useRef, createRef } from "react";
import { useDropzone } from "react-dropzone";
import { Row, Col, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import "react-image-crop/dist/ReactCrop.css";
import ReactCrop from "react-image-crop";
import {
  faUpload,
  faTimes,
  faExclamationSquare,
} from "@fortawesome/pro-light-svg-icons";
import { useDeepEffect } from "../../abstracts";
import { Link } from "react-router-dom";
import { divide } from "lodash";
import { faBlindsOpen } from "@fortawesome/pro-solid-svg-icons";

const ImageUpload = (props) => {
  const {
    setFieldValue,
    label,
    name,
    blockDrag,
    id,
    validationCount,
    setValidationCount,
    setImageFile,
    imageFile,
  } = props;
  const [isUploadSuccess, setIsUploadSuccess] = useState(false);
  const [isFormatSupported, setIsFormatSupported] = useState(false);
  const [isFileSizeExceeded, setIsFileSizeExceeded] = useState(false);
  const [myFiles, setMyFiles] = useState([]);
  const MAX_FILE_SIZE = 170000;

  useDeepEffect(() => {
    let file = myFiles ? myFiles[0] : null;
    setIsFormatSupported(false);
    setIsFileSizeExceeded(false);
    if (file && ["image/jpeg", "image/png", "image/jpg"].includes(file.type)) {
      setIsFormatSupported(true);
      if (file.size > MAX_FILE_SIZE) {
        setIsFileSizeExceeded(true);
      }
    }
  }, [myFiles]);

  const dropzoneRef = createRef();
  const openDialog = () => {
    if (dropzoneRef.current) {
      dropzoneRef.current.open();
    }
  };
  const onDrop = useCallback(
    (acceptedFiles) => {
      setMyFiles(
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
    [myFiles]
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
    const newFiles = [...myFiles];
    newFiles.splice(newFiles.indexOf(file), 1);
    setMyFiles([]);
    setIsUploadSuccess(false);
    // setResult(null);
    setImageFile(null);
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
            large, Max file size : 170 KB
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
  const isInavlidUpload = isFileSizeExceeded && !isFormatSupported;
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

  const [image, setImage] = useState(null);
  const [crop, setCrop] = useState({ aspect: 1, height: "170" });
  const [toggle, setToggle] = useState(true);

  useDeepEffect(() => {
    setImageFile(null);
  }, [isDragActive]);

  function dataURItoBlob(dataURI) {
    var byteString = atob(dataURI.split(",")[1]);
    var mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];
    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);
    for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  }

  const getCroppedImg = async () => {
    try {
      setToggle(false);
      const canvas = document.createElement("canvas");
      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;
      canvas.width = crop.width;
      canvas.height = crop.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(
        image,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        crop.width,
        crop.height
      );

      const imageUrl = canvas.toDataURL("image/jpeg", 1);
      const base64Image = dataURItoBlob(imageUrl);
      // setResult(base64Image);
      // setImageFile(base64Image);
      setImageFile(
        Object.assign(base64Image, {
          preview: URL.createObjectURL(base64Image),
        })
      );
    } catch (e) {
      console.log("crop the image");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
  };

  const imageCrop = () => {
    return (
      <div className="w-100">
        <ReactCrop
          imageStyle={{ maxWidth: "200px", maxHeight: "200px" }}
          src={myFiles[0].preview}
          onImageLoaded={setImage}
          crop={crop}
          circularCrop={true}
          locked={true}
          onChange={setCrop}
        />
        <div>
          <button className="cropButton" onClick={() => getCroppedImg()}>
            crop
          </button>
        </div>
      </div>
    );
  };

  return (
    <div>
      <label className="label-text">{label}</label>
      <div ref={dropzoneRef} {...getRootProps({ className: "dropzone w-100" })}>
        <input name={name} {...getInputProps()} />
        {!isUploadSuccess && (
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
              <span className="file-type">Accepted file : jpeg, png, jpg</span>
              <span className="file-size">Max File Size : 1 MB</span>
            </div>
          </div>
        )}
        {isUploadSuccess && (
          <div>
            {imageFile ? (
              <div className={uploadedClassStyle}>
                <div>
                  <div>
                    <img
                      src={imageFile.preview}
                      alt="cropped image"
                      className="image-boundary"
                    />
                  </div>
                  <div className="font-12">
                    <span
                      style={{
                        width: "150px",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {myFiles[0].name}
                    </span>
                    {
                      <span
                        className="ml-4"
                        style={{ cursor: "pointer" }}
                        onClick={removeFile(myFiles[0])}
                      >
                        {!blockDrag && imageFile && (
                          <FontAwesomeIcon
                            icon={faTimes}
                            color={"#ff0000"}
                            style={{ marginLeft: "25px" }}
                          />
                        )}
                      </span>
                    }
                    <br />
                    {displaySize(myFiles[0])}
                    <br />
                    <br />
                  </div>

                  {!blockDrag && (
                    <div className="font-12">
                      <FontAwesomeIcon icon={faUpload} />
                      <br />
                      Drag & drop here or
                      <Link
                        className="link-text"
                        onClick={() => {
                          // setResult(null);
                          setImageFile(null);
                          open();
                        }}
                      >
                        {" "}
                        Browse Image{" "}
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="uploaded-image h-187">{imageCrop()}</div>
            )}

            <div className="file-type pt-2">
              {" "}
              {validationMessage(myFiles[0])}{" "}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUpload;
