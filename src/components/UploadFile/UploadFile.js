// ** React Imports
import { useState, Fragment } from "react";
import { Card, CardBody, Button, ListGroup, ListGroupItem } from "reactstrap";
import { useDropzone } from "react-dropzone";
import { FileText, X, DownloadCloud } from "react-feather";

const UploadFile = ({
  acceptedFiles,
  setMediaFile,
  file,
  setData,
  bgWhite = false,
}) => {
  // ** State
  const [files, setFiles] = useState([]);
  const [url, setUrl] = useState(file);
  /*eslint-disable-next-line */
  const [imageError, setImageError] = useState("");

  /* A hook that is used to create a dropzone. */
  const { getRootProps, getInputProps } = useDropzone({
    accept: acceptedFiles,
    multiple: false,
    onDrop: (acceptedFiles) => {
      // setFiles([...files, ...acceptedFiles.map((file) => Object.assign(file))]);
      setImageError("");
      const filteredArray = [];
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
        setFiles([
          ...files,
          ...acceptedFiles.map((file) => Object.assign(file)),
        ]);
        setMediaFile([
          ...files,
          ...acceptedFiles.map((file) => Object.assign(file)),
        ]);
      } else {
        setImageError("Some files are already exists");
      }
    },
  });

  /**
   * If the file is an image, render an image tag with the file as the source. Otherwise, render a file
   * icon
   * @param file - The file object that is being uploaded.
   * @returns A function that takes in a file and returns a JSX element.
   */
  const renderFilePreview = (file) => {
    if (file.type.startsWith("image")) {
      return (
        <img
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

  /**
   * It removes the file from the state and the file from the preview
   * @param file - The file object that was uploaded
   */
  const handleRemoveFile = (file) => {
    const uploadedFiles = files;
    const filtered = uploadedFiles.filter((i) => i.name !== file.name);
    setMediaFile([...filtered]);
    setFiles([...filtered]);
    setUrl(null);
    if (setData) setData(null);
  };

  /**
   * If the size is greater than 1000, divide by 10000 and round to 1 decimal place, otherwise divide by
   * 10 and round to 1 decimal place
   * @param size - The size of the file in bytes.
   * @returns the file size in either megabytes or kilobytes.
   */
  const renderFileSize = (size) => {
    if (Math.round(size / 100) / 10 > 1000) {
      return `${(Math.round(size / 100) / 10000).toFixed(1)} mb`;
    } else {
      return `${(Math.round(size / 100) / 10).toFixed(1)} kb`;
    }
  };

  const fileList = files.map((file, index) => (
    <ListGroupItem
      key={`${file.name}-${index}`}
      className="d-flex align-items-center justify-content-between"
    >
      <div className="file-details d-flex align-items-center">
        <div className="file-preview me-1">{renderFilePreview(file)}</div>
        <div>
          <p className="file-name mb-0">{file.name}</p>
          <p className="file-size mb-0">{renderFileSize(file.size)}</p>
        </div>
      </div>
      <Button
        color="danger"
        outline
        size="sm"
        className="btn-icon"
        onClick={() => handleRemoveFile(file)}
      >
        <X size={14} />
      </Button>
    </ListGroupItem>
  ));

  return (
    <Card className="border-dashed">
      <CardBody className={bgWhite ? "bg-white" : ""}>
        {url !== null || files?.length ? null : (
          <div {...getRootProps({ className: "dropzone" })}>
            <input {...getInputProps()} />
            <div className="d-flex align-items-center justify-content-center flex-column">
              <DownloadCloud size={64} />
              <h5>Drop Files here or click to upload</h5>
              <p className="text-secondary">
                Drop files here or click{" "}
                <a
                  href="/"
                  onClick={(e) => e.preventDefault()}
                  className="sy-tx-black"
                >
                  browse
                </a>{" "}
                thorough your machine
              </p>
            </div>
          </div>
        )}
        {url !== null || files?.length !== 0 ? (
          files?.length ? (
            <Fragment>
              <ListGroup className="my-2">{fileList}</ListGroup>
            </Fragment>
          ) : (
            <ListGroup className="my-2">
              <ListGroupItem
                key={url}
                className="d-flex align-items-center justify-content-between"
              >
                <div className="file-details d-flex align-items-center">
                  <iframe
                    width="337.6"
                    height="199"
                    src={url}
                    alt={"No preview available"}
                    frameBorder="0"
                    allow="fullscreen"
                  />
                  &nbsp;
                  <div>
                    <p className="file-name mb-0">{url}</p>
                  </div>
                </div>
                <Button
                  color="danger"
                  outline
                  size="sm"
                  className="btn-icon"
                  onClick={() => handleRemoveFile(file)}
                >
                  <X size={14} />
                </Button>
              </ListGroupItem>
            </ListGroup>
          )
        ) : null}
      </CardBody>
    </Card>
  );
};

export default UploadFile;
