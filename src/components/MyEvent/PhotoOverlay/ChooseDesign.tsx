import { Card, CardBody, CardHeader, CardText, CardTitle, Input, Row } from "reactstrap";
import Template1 from "@images/haloTemplates/template1.webp";
import Template2 from "@images/haloTemplates/template2.webp";
import Template3 from "@images/haloTemplates/template3.webp";
import Template4 from "@images/haloTemplates/template4.webp";
import Template5 from "@images/haloTemplates/template5.webp";
import Template6 from "@images/haloTemplates/template6.webp";
import Template7 from "@images/haloTemplates/template7.webp";
import Template8 from "@images/haloTemplates/template8.webp";
import Template9 from "@images/haloTemplates/template9.webp";
import Template10 from "@images/haloTemplates/template10.webp";
import Template11 from "@images/haloTemplates/template11.webp";
import Template12 from "@images/haloTemplates/template12.webp";
import Template13 from "@images/haloTemplates/template13.webp";
import Template14 from "@images/haloTemplates/template14.webp";
import Template15 from "@images/haloTemplates/template15.webp";
import Template16 from "@images/haloTemplates/template16.webp";
import Template17 from "@images/haloTemplates/template17.webp";
import Template18 from "@images/haloTemplates/template18.webp";
import Template19 from "@images/haloTemplates/template19.webp";
import Template20 from "@images/haloTemplates/template20.webp";
import Template21 from "@images/haloTemplates/template21.webp";
import Template22 from "@images/haloTemplates/template22.webp";
import Template23 from "@images/haloTemplates/template23.webp";
import Template24 from "@images/haloTemplates/template24.webp";
import Template25 from "@images/haloTemplates/template25.webp";
import Template26 from "@images/haloTemplates/template26.webp";
import Template27 from "@images/haloTemplates/template27.webp";

import Image from "next/image";
import { type FormikErrors, type FormikTouched } from "formik";
import { type Preference } from "@types";
import React from "react";

type Fields = { designType: number };

type ChooseDesignProps = {
  select: (id: number) => void;
  design?: Preference[];
  errors: FormikErrors<Fields>;
  touched: FormikTouched<Fields>;
  values: Fields;
  showFlavorText?: boolean;
};

const templates = [
  Template1,
  Template2,
  Template3,
  Template4,
  Template5,
  Template6,
  Template7,
  Template8,
  Template9,
  Template10,
  Template11,
  Template12,
  Template13,
  Template14,
  Template15,
  Template16,
  Template17,
  Template18,
  Template19,
  Template20,
  Template21,
  Template22,
  Template23,
  Template24,
  Template25,
  Template26,
  Template27,
];

const ChooseDesign = ({
  select,
  design,
  errors,
  touched,
  values,
  showFlavorText = true,
}: ChooseDesignProps) => (
  <Card className="fade-in bg-white">
    <CardHeader>
      <CardTitle className="sy-tx-primary f-18">Choose Your Photo Overlay</CardTitle>
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
        {templates.map((template, index) => (
          <div className="tw-w-full sm:tw-w-1/2 lg:tw-w-1/3" key={index}>
            <div
              className="photo-filter div-width cursor-pointer"
              onClick={() => {
                select(design?.[index]?.id ?? 0);
              }}
            >
              <Image
                className={`img-fluid tw-inset-auto tw-w-full tw-h-auto tw-static tw-border-solid tw-border-2 tw-border-slate-200 ${
                  values?.designType === design?.[index]?.id ? "img-border-active" : "br-15"
                }`}
                src={template}
                alt={`Template ${index + 1}`}
                fill
              />
              <div className="form-check form-check-inline choose-design-template-img">
                <Input
                  type="radio"
                  name="design"
                  checked={values?.designType === design?.[index]?.id}
                  onClick={() => {
                    select(design?.[index]?.id ?? 0);
                  }}
                  id={`template-${index}-select`}
                  className="cu-select radio-custom"
                />
              </div>
              <p className="text-center mt-50">{design?.[index]?.name}</p>
            </div>
          </div>
        ))}
      </Row>
      {errors?.designType && touched?.designType ? (
        <span className="text-danger error-msg">{errors?.designType}</span>
      ) : null}
    </CardBody>
  </Card>
);

export default ChooseDesign;
