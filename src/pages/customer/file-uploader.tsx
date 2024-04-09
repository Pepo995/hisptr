import { useState } from "react";
import { Button, Input, InputGroup, Label } from "reactstrap";

import { type ReactElement } from "react";
import Layout from "@components/layouts/Layout";
import type { NextPageWithLayout } from "@pages/_app";
import { MAX_LOGO_IMAGE_SIZE_IN_MB } from "@constants/ValidationConstants";

const FreeFeelUpload: NextPageWithLayout = ({ setImage, accept, url, setFieldValue }) => {
  const [avatar, setAvatar] = useState();

  const onChange = (e) => {
    const reader = new FileReader(),
      files = e.target.files;
    reader.onload = function () {
      setAvatar(reader.result);
    };
    setFieldValue("logo", files[0]);
    reader.readAsDataURL(files[0]);
    setImage(files[0]);
  };

  return (
    <>
      <div className="main-img  align-items-end d-flex flex-wrap">
        {/* <FileUploaderSingle/> */}

        <div className="d-flex flex-wrap">
          {(avatar || url) && (
            <div className="me-25">
              <img
                className="rounded me-50"
                src={avatar || url}
                alt="Generic placeholder image"
                height="100"
                width="100"
              />
            </div>
          )}
          <div className="d-flex flex-column">
            <div className="mb-25 sy-tx-grey f-12 mt-1">
              Allowed file extensions:
              <span className="sy-tx-primary">jpg, png, psd, pdf, ai, svg, jpeg, tiff</span>&nbsp;
              Max file size: <span className="sy-tx-primary">{MAX_LOGO_IMAGE_SIZE_IN_MB} MB</span>
            </div>
            <InputGroup className="cu-width">
              <Input
                id="file"
                type="file"
                name="file"
                className="upload-input"
                onChange={onChange}
                accept={accept}
              />
              <Button
                tag={Label}
                for="file"
                className=" mb-0 btn p-1 browse-btn"
                size="sm"
                color="primary"
              >
                Browse
                {/* <Input
                  type="file"
                  onChange={onChange}
                  hidden
                  accept={accept}
                /> */}
              </Button>
            </InputGroup>
          </div>
        </div>
      </div>
    </>
  );
};

FreeFeelUpload.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
export default FreeFeelUpload;
