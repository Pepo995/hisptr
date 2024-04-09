import { useState } from "react";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Col,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  Row,
} from "reactstrap";
import { HexColorPicker } from "react-colorful";
import UploadImg from "@images/uplaoded_img.svg";
import FreeFeelUpload from "./FreeFeelUpload";
import Secondary from "@images/secondary.svg";
import { Field, type FormikErrors, type FormikTouched } from "formik";
import { OVERLAY_SUPPORTED_IMAGE_FORMATS } from "@constants/ValidationConstants";
import { type EventFromPhp, type Preference } from "@types";
import Image, { type StaticImageData } from "next/image";
import { validateURL } from "@utils/Utils";

type Fields = {
  primaryColor: string;
  secondaryColor: string;
  firstLine: string;
  secondLine: string;
  logo?: string | null;
  vision: string;
};

type OverlayProps = {
  backdrop?: Preference[];
  errors: FormikErrors<Fields>;
  touched: FormikTouched<Fields>;
  values: Fields;
  setFieldValue: (
    field: string,
    value?: string,
    shouldValidate?: boolean | undefined,
  ) => Promise<void | FormikErrors<Fields>>;
  event: EventFromPhp;
  showFlavorText?: boolean;
};

const Overlay = ({
  setFieldValue,
  errors,
  touched,
  values,
  event,
  showFlavorText = true,
}: OverlayProps) => {
  const [pickerColor, setPickerColor] = useState(values?.primaryColor ?? "#000000");
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [pickerColor1, setPickerColor1] = useState(values?.secondaryColor ?? "#000000");
  const [isPickerOpen1, setIsPickerOpen1] = useState(false);

  return (
    <>
      <Card className="fade-in bg-white">
        <CardHeader>
          <CardTitle className="sy-tx-primary f-18">Overlay Design</CardTitle>
        </CardHeader>
        <CardBody>
          {showFlavorText && (
            <Label className="sy-tx-modal">
              Give us some basic specs below as to what you&apos;re looking for in your overlay
              design
            </Label>
          )}

          <Row>
            <Col md="6" sm="12" className="mb-1">
              <Label className="form-label cu-label" for="nameMulti">
                Text - First Line<span className="sy-tx-primary">*</span>
              </Label>
              <Field
                type="text"
                name="firstLine"
                id="firstLine"
                placeholder="Enter first line"
                className="form-control custom-input"
              />
              <p className="sy-tx-primary tw-text-xs">
                Note
                <span className="sy-tx-modal"> : (ex. Name of Bride & Groom/Event Title/Etc.)</span>
              </p>
              {errors.firstLine && touched.firstLine ? (
                <span className="text-danger error-msg">{errors?.firstLine}</span>
              ) : null}
            </Col>
            <Col md="6" sm="12" className="mb-1">
              <Label className="form-label cu-label" for="nameMulti">
                Text - Second Line<span className="sy-tx-primary">*</span>
              </Label>
              <Field
                type="text"
                name="secondLine"
                id="nameMulti"
                placeholder="Enter second line"
                className="form-control custom-input"
              />
              <p className="sy-tx-primary tw-text-xs">
                Note
                <span className="sy-tx-modal"> : (ex. Name of Bride & Groom/Event Title/Etc.)</span>
              </p>
              {errors.secondLine && touched.secondLine ? (
                <span className="text-danger error-msg">{errors?.secondLine}</span>
              ) : null}
            </Col>
          </Row>
          <div>
            <Label className="mb-1">
              Choose Your Primary Color (The most dominant color that will be used in the design,
              color of the First Line and other significant design elements)
            </Label>
            <div className="color-picker">
              <Image
                className="img-fluid tw-inset-auto tw-w-auto tw-h-auto tw-static"
                src={UploadImg as StaticImageData}
                alt="Upload Image"
                fill
              />
              <div className="color-selector">
                <div className="cu-form-group form-group">
                  <Label for="selectcolor" className="form-label cu-form-label">
                    Select Color*
                  </Label>

                  <div className="tw-flex">
                    <Input
                      name="primaryColor"
                      type="text"
                      id="primaryColor"
                      placeholder="Primary Color"
                      value={pickerColor}
                      onClick={() => setIsPickerOpen(!isPickerOpen)}
                    />
                    <span
                      style={{ backgroundColor: pickerColor }}
                      className="tw-mx-1 tw-w-8 tw-h-8 tw-block tw-rounded-sm tw-my-auto"
                      onClick={() => setIsPickerOpen(!isPickerOpen)}
                    />
                  </div>
                  <div className="vertically-centered-modal">
                    <Modal
                      isOpen={isPickerOpen}
                      className="color-picker-modal modal-dialog-centered"
                      toggle={() => setIsPickerOpen(!isPickerOpen)}
                    >
                      <ModalBody>
                        <HexColorPicker
                          color={pickerColor}
                          onChange={(val) => {
                            setPickerColor(val);
                            void setFieldValue("primaryColor", val);
                          }}
                        />
                      </ModalBody>
                      <ModalFooter>
                        <Button className="primary" onClick={() => setIsPickerOpen(!isPickerOpen)}>
                          Close
                        </Button>
                      </ModalFooter>
                    </Modal>
                  </div>
                  {errors.primaryColor && touched.primaryColor ? (
                    <span className="text-danger error-msg">{errors?.primaryColor}</span>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
          <div className="mt-1">
            <Label className="mb-1">
              Choose Your Secondary Color (The color that will complement the Primary Color, may be
              used as the background color of the logo/monogram and/or other less significant design
              elements)
            </Label>
            <div className="color-picker">
              <Image
                className="img-fluid tw-inset-auto tw-w-auto tw-h-auto tw-static"
                src={Secondary as StaticImageData}
                alt="Secondary Image"
                fill
              />
              <div className="color-selector">
                <div className="cu-form-group form-group">
                  <Label for="selectcolor" className="form-label cu-form-label">
                    Select Color*
                  </Label>

                  <div className="tw-flex">
                    <Input
                      name="secondaryColor"
                      type="text"
                      id="secondaryColor"
                      placeholder="Secondary Color"
                      value={pickerColor1}
                      onClick={() => setIsPickerOpen1(!isPickerOpen1)}
                    />
                    <span
                      style={{ backgroundColor: pickerColor1 }}
                      className="tw-mx-1 tw-w-8 tw-h-8 tw-block tw-rounded-sm tw-my-auto"
                      onClick={() => setIsPickerOpen1(!isPickerOpen1)}
                    />
                  </div>
                  <div className="vertically-centered-modal">
                    <Modal
                      isOpen={isPickerOpen1}
                      className="color-picker-modal modal-dialog-centered"
                      toggle={() => setIsPickerOpen1(!isPickerOpen1)}
                    >
                      <ModalBody>
                        <HexColorPicker
                          color={pickerColor}
                          onChange={(val) => {
                            setPickerColor1(val);
                            void setFieldValue("secondaryColor", val);
                          }}
                        />
                      </ModalBody>
                      <ModalFooter>
                        <Button className="primary" onClick={() => setIsPickerOpen1(false)}>
                          Close
                        </Button>
                      </ModalFooter>
                    </Modal>
                  </div>
                  {errors.secondaryColor && touched.secondaryColor ? (
                    <span className="text-danger error-msg">{errors?.secondaryColor}</span>
                  ) : null}
                </div>
              </div>
            </div>
            <div className="mt-3">
              <Label className="form-label cu-label mb-75" for="email">
                Have something more specific in mind? Tell us about your vision
              </Label>
              <Input
                id="vision"
                name="vision"
                onChange={(e) => setFieldValue("vision", e.target.value)}
                type="textarea"
                rows="5"
                defaultValue={event?.photos?.vision}
                className="input-group form-control support-description"
                placeholder="Type here.... "
              />
              {errors.vision ? (
                <span className="text-danger error-msg">{errors?.vision}</span>
              ) : null}
            </div>
            <div className="mt-2">
              <Label className="form-label cu-label mb-1">
                Have a logo, artwork or your own design? Feel free to upload here:
              </Label>
              <br />
              <FreeFeelUpload
                setImage={(imageUrl?: string) => setFieldValue("logo", imageUrl)}
                acceptedFileTypes={OVERLAY_SUPPORTED_IMAGE_FORMATS.join(",")}
                url={event?.photos?.logo ?? ""}
                showRemoveButton={validateURL(String(values.logo)).isValid}
              />
              {!!(errors.logo && values.logo) || (errors.logo && touched.logo) ? (
                <span className="text-danger error-msg">{errors?.logo}</span>
              ) : null}
            </div>
          </div>
        </CardBody>
      </Card>
    </>
  );
};

export default Overlay;
