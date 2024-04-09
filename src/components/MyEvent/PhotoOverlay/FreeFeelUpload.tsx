import S3FileUploader from "@components/S3FileUploader";
import { MAX_LOGO_IMAGE_SIZE_IN_MB } from "@constants/ValidationConstants";
import Image from "next/image";
import { useState } from "react";
import { toast } from "react-toastify";
import { Button, Label } from "reactstrap";

type FreeFeelUploadProps = {
  setImage: (fileUrl?: string) => void;
  acceptedFileTypes: string;
  url: string;
  showRemoveButton?: boolean;
};

const FreeFeelUpload = ({
  setImage,
  acceptedFileTypes,
  url,
  showRemoveButton = false,
}: FreeFeelUploadProps) => {
  const [avatar, setAvatar] = useState<string | null>();

  return (
    <div className="main-img  align-items-end d-flex flex-wrap">
      <div className="d-flex flex-wrap">
        {(avatar !== undefined ? avatar : url) && (
          <div className="me-25">
            <Image
              className="img-fluid tw-inset-auto tw-w-auto tw-h-auto tw-static rounded me-50"
              src={avatar ?? url}
              alt="Generic placeholder image"
              fill
            />
          </div>
        )}
        <div className="d-flex flex-column">
          <div className="tw-flex tw-gap-1 tw-pt tw-mt-3">
            <S3FileUploader
              id="logo"
              acceptedExtensions={acceptedFileTypes}
              uploadFileText="Browse"
              onFileUploaded={(url) => {
                setAvatar(url);
                setImage(url);
              }}
              onError={() => {
                toast.error("Error uploading file");
                setImage();
                setAvatar(null);
              }}
              maxFileSizeInMb={MAX_LOGO_IMAGE_SIZE_IN_MB}
            />
            {showRemoveButton && (
              <Button
                tag={Label}
                className="mb-0 btn p-1"
                size="sm"
                color="secondary"
                onClick={() => {
                  setImage();
                  setAvatar(null);
                }}
                disabled={avatar === null || (!avatar && !url)}
              >
                Remove
              </Button>
            )}
          </div>
          <div className="mb-25 sy-tx-grey f-12 mt-1">
            Allowed file extensions:
            <span className="sy-tx-primary">jpg, png, psd, pdf, ai, svg, jpeg, tiff, webp</span>
            &nbsp;Max file size:{" "}
            <span className="sy-tx-primary">{MAX_LOGO_IMAGE_SIZE_IN_MB} MB</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FreeFeelUpload;
