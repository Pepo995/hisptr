import { Card, CardBody, CardHeader, CardText, CardTitle, Col, Input, Row } from "reactstrap";
import BlackImg from "@images/black BD.svg";
import WhiteImg from "@images/white BD.svg";
import GoldImg from "@images/gold BD.svg";
import GreenImg from "@images/greenscreen BD.svg";
import CustomImg from "@images/custom BD.svg";
import SilverImg from "@images/silver BD.svg";
import NoneImg from "@images/none BD.svg";
import { type FormikErrors, type FormikTouched } from "formik";
import { type Preference } from "@types";
import Image, { type StaticImageData } from "next/image";

const backdropImages = [BlackImg, WhiteImg, GoldImg, SilverImg, GreenImg, CustomImg, NoneImg];

type Fields = {
  backdropType: number;
};

type BackdropProps = {
  select: (id: number) => void;
  backdrop?: Preference[];
  errors?: FormikErrors<Fields>;
  touched?: FormikTouched<Fields>;
  values?: Fields;
  showFlavorText?: boolean;
};

const Backdrop = ({
  select,
  backdrop,
  errors,
  touched,
  values,
  showFlavorText = true,
}: BackdropProps) => (
  <Card className="fade-in bg-white">
    <CardHeader>
      <CardTitle className="sy-tx-primary f-18">Backdrop Selection</CardTitle>
    </CardHeader>
    <CardBody>
      {showFlavorText && (
        <CardText>
          Below are templates that you can select from for your overlay or print design. These are
          optional; if you have a logo or anything else in mind, please skip this portion. In your
          selection of a template, please note that you are ONLY looking at the style of the design,
          all of the text and colors can be modified.
        </CardText>
      )}
      <Row>
        {backdrop?.map((item, index) => (
          <Col lg={4} md={6} key={item?.id}>
            <div
              className="tw-border-slate-200 photo-filter div-width cursor-pointer"
              onClick={() => {
                select(item?.id ?? 0);
              }}
            >
              <Image
                className={`img-fluid tw-inset-auto tw-w-auto tw-h-auto tw-static ${
                  values?.backdropType === item?.id ? "img-border-active" : "br-15"
                }`}
                src={backdropImages[index] as StaticImageData}
                alt={`Backdrop ${item?.name}`}
                fill
              />
              <div className="tw-mr-0 -tw-top-1.5 -tw-right-3 form-check form-check-inline template-img">
                <Input
                  type="radio"
                  name="selection"
                  checked={values?.backdropType === item?.id}
                  onClick={() => {
                    select(item?.id ?? 0);
                  }}
                  id="basic-cb-checked"
                  className="cu-select radio-custom"
                />
              </div>
              <p className="text-center mt-50">{item?.name}</p>
            </div>
          </Col>
        ))}
      </Row>
      {errors?.backdropType && touched?.backdropType ? (
        <span className="text-danger error-msg">{errors?.backdropType}</span>
      ) : null}
    </CardBody>
  </Card>
);

export default Backdrop;
