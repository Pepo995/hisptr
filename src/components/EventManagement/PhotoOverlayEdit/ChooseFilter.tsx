import { Card, CardBody, CardHeader, CardTitle, Input, Row } from "reactstrap";
import Image, { type StaticImageData } from "next/image";
import NoFilter from "@images/no-filter.svg";
import GlamFilter from "@images/glam-filter.png";
import BWFilter from "@images/black-white.svg";

type ChooseFilterProps = {
  filters: { id: number; name: string; code: string }[];
  setFieldValue: (field: string, value: number) => void;
  values: {
    filter_type: number | undefined;
  };
  errors: {
    filter_type?: string;
  };
  touched: {
    filter_type?: boolean;
  };
};

export default function ChooseFilter({
  filters,
  setFieldValue,
  values,
  errors,
  touched,
}: ChooseFilterProps) {
  const filterRec: Record<string, StaticImageData> = {
    no_filter: NoFilter as StaticImageData,
    glam_filter: GlamFilter ,
    "black_&_white": BWFilter as StaticImageData,
  };

  return (
    <Card className="fade-in bg-white">
      <CardHeader>
        <CardTitle className="sy-tx-primary f-18">Photo filter</CardTitle>
      </CardHeader>
      <CardBody>
        <Row>
          <div className="d-flex justify-content-center flex-wrap">
            {filters.map((filter) => (
              <div
                key={filter.name}
                className="photo-filter mx-3 cursor-pointer"
                onClick={() => setFieldValue("filter_type", filter.id)}
              >
                <Image
                  src={filterRec[filter.code]}
                  className={`img-fluid tw-inset-auto tw-w-auto tw-h-auto tw-static${
                    values?.filter_type === filter.id ? " img-border-active" : ""
                  }`}
                  alt="filter"
                />
                <div className="form-check form-check-inline image-select ">
                  <Input
                    type="radio"
                    name="filter"
                    checked={values?.filter_type === filter.id}
                    onClick={() => setFieldValue("filter_type", filter.id)}
                    id="basic-cb-checked"
                    className="cu-select radio-custom"
                  />
                </div>
                <p className="text-center mt-50">{filter.name}</p>
              </div>
            ))}
          </div>
          {errors?.filter_type && touched?.filter_type ? (
            <span className="text-danger error-msg">{errors?.filter_type}</span>
          ) : null}
        </Row>
      </CardBody>
    </Card>
  );
}
