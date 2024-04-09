import { Fragment, useState } from "react";
import { ListGroupItem } from "reactstrap";
import { type Accept, useDropzone } from "react-dropzone";
import { Image as FeatherImage, FileText, X } from "react-feather";
import { FILE_TOO_LARGE } from "@constants/ValidationConstants";
import Image from "next/image";

const CustomeUploadImage = ({
  acceptedFiles,
  setMediaFile,
  fileSize,
}: {
  acceptedFiles: Accept;
  setMediaFile: (e: File[]) => void;
  fileSize: number;
}) => {
  const [files, setFiles] = useState<File[]>([]);
  const [imageError, setImageError] = useState("");
  const [size, setSize] = useState(0);

  const { getRootProps, getInputProps } = useDropzone({
    accept: acceptedFiles,
    multiple: false,
    onDrop: (acceptedFiles: File[]) => {
      setImageError("");
      const filteredArray = [];
      if (acceptedFiles[0].size <= fileSize) {
        /*eslint-disable */
        for (let i of acceptedFiles) {
          for (let j of files) {
            if (i.name === j.name && i.type === j.type) {
              filteredArray.push(j);
            }
          }
        }
        /*eslint-enable */
        if (filteredArray.length === 0) {
          setFiles([...files, ...acceptedFiles]);
          setMediaFile([...files, ...acceptedFiles]);
          setSize(size + acceptedFiles[0].size);
        } else {
          setImageError("Some files are already exists");
        }
      } else {
        setImageError(FILE_TOO_LARGE);
      }
    },
  });

  const renderFilePreview = (file: File) => {
    if (file.type.startsWith("image")) {
      return (
        <Image
          className="rounded"
          alt={file.name}
          src={URL.createObjectURL(file)}
          height="28"
          width="28"
        />
      );
    } else {
      return <FileText size="28" />;
    }
  };

  const handleRemoveFile = (file: File) => {
    const uploadedFiles = files;
    const filtered = uploadedFiles.filter((i) => i.name !== file.name);
    setFiles([...filtered]);
  };

  const renderFileSize = (size: number) => {
    if (Math.round(size / 100) / 10 > 1000) {
      return `${(Math.round(size / 100) / 10000).toFixed(1)} mb`;
    } else {
      return `${(Math.round(size / 100) / 10).toFixed(1)} kb`;
    }
  };

  const fileList = files.map((file, index) => (
    <ListGroupItem
      key={`${file.name}-${index}`}
      className="d-flex align-items-center justify-content-between img-box mb-1"
    >
      <div className="file-details d-flex align-items-center">
        <div className="file-preview me-1">{renderFilePreview(file)}</div>
        <div className="d-flex flex-wrap url-width">
          <p className="file-name mb-0 sy-tx-primary f-600">{file.name}</p>
          <p className="file-size mb-0 mx-25 f-600">({renderFileSize(file.size)})</p>
        </div>
      </div>

      <X size={20} onClick={() => handleRemoveFile(file)} />
    </ListGroupItem>
  ));

  return (
    <div>
      {files.length ? (
        <Fragment>
          <div className="mb-sm-5 uploaded-file-box">{fileList}</div>
        </Fragment>
      ) : null}
      <div
        {...getRootProps({
          className: "dropzone custom-btn5 btn",
        })}
      >
        <input {...getInputProps()} />
        <div className="tw-flex tw-justify-center tw-items-center tw-flex-col">
          <div className="flex tw-items-center">
            <FeatherImage className="me-25" />
            <span>Upload Image</span>
          </div>
        </div>
      </div>
      <div className="mt-1">
        <span className="text-danger error-msg">{imageError}</span>
      </div>
    </div>
  );
};

export default CustomeUploadImage;
