import { IMAGE_TOO_LARGE } from "@constants/ValidationConstants";
import { usePresignedUpload } from "next-s3-upload";
import React, { useState } from "react";
import { Loader, Upload } from "react-feather";
import { toast } from "react-toastify";

export interface FileInputProps {
  id: string;
  acceptedExtensions?: string;
  uploadFileText: string;
  onFileUploaded: (url: string) => void;
  onError?: () => void;
  maxFileSizeInMb: number;
}

const S3FileUploader = ({
  id,
  acceptedExtensions = "image/png, image/jpeg",
  uploadFileText,
  onFileUploaded,
  onError,
  maxFileSizeInMb,
}: FileInputProps) => {
  const { uploadToS3 } = usePresignedUpload();
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      {isLoading ? (
        <Loader className="tw-m-auto tw-animate-spin-slow" />
      ) : (
        <>
          <label
            htmlFor={id}
            className="tw-flex tw-w-full tw-cursor-pointer tw-justify-center tw-rounded-md tw-border tw-border-dashed tw-bg-background tw-p-3 tw-text-center tw-text-sm tw-ring-offset-background tw-file:border-0"
          >
            <Upload size={14} className="tw-my-auto tw-mr-2" />
            {uploadFileText}
          </label>
          <input
            type="file"
            id={id}
            className="hidden"
            accept={acceptedExtensions}
            onChange={async (event) => {
              const file = event.target.files?.[0];

              if (file && file.size > Math.round(maxFileSizeInMb * 1024 * 1024)) {
                toast.error(IMAGE_TOO_LARGE(maxFileSizeInMb));
                return false;
              }

              if (!file) {
                if (onError) onError();
                return;
              }

              setIsLoading(true);
              const { url } = await uploadToS3(file);
              setIsLoading(false);
              onFileUploaded(url);
            }}
          />
        </>
      )}
    </div>
  );
};

export default S3FileUploader;
