import { Card, CardBody, CardHeader, CardTitle, Input, Row } from "reactstrap";

type ChooseOrientationProps = {
  orientations: { id: number; name: string; code: string }[];
  setFieldValue: (field: string, value: number) => void;
  values: {
    orientation_type: number | undefined;
  };
  errors: {
    orientation_type?: string;
  };
  touched: {
    orientation_type?: boolean;
  };
};

export default function ChooseOrientation({
  orientations,
  setFieldValue,
  values,
  errors,
  touched,
}: ChooseOrientationProps) {
  const orientationCodeRecord: Record<string, string> = {
    classic: "2 : 6",
    card_horizontal: "6 : 4",
    card_vertical: "4 : 6",
  };

  return (
    <Card className="fade-in bg-white">
      <CardHeader>
        <CardTitle className="sy-tx-primary f-18">Select Your Photo Size & Orientation</CardTitle>
      </CardHeader>
      <CardBody>
        <Row>
          <div className="photo-dimension tw-justify-around">
            {orientations.map((orientation, i) => {
              return (
                <div
                  key={orientation.id}
                  className={
                    values?.orientation_type === orientation?.id
                      ? "dimension-border photo-size cursor-pointer"
                      : "photo-size cursor-pointer"
                  }
                  onClick={() => setFieldValue("orientation_type", orientation?.id)}
                >
                  <div className="custom-photo-layout">
                    <div
                      className={
                        values?.orientation_type === orientation?.id
                          ? ` dimension-border inner-photo-layout${
                              i + 1
                            } mx-auto mt-3 d-flex justify-content-center align-items-center sy-tx-black f-500`
                          : `inner-photo-layout${
                              i + 1
                            } mx-auto mt-3 d-flex justify-content-center align-items-center sy-tx-black f-500`
                      }
                    >
                      {orientationCodeRecord[orientation.code]}
                    </div>
                    <div className="text-center sy-tx-modal mt-1 f-500 f-14">
                      {orientation.name}
                    </div>
                  </div>
                  <div className="form-check form-check-inline image-select ">
                    <Input
                      type="radio"
                      name="size"
                      checked={values?.orientation_type === orientation?.id}
                      onClick={() => setFieldValue("orientation_type", orientation?.id)}
                      id="basic-cb-checked"
                      className="cu-select radio-custom"
                    />
                  </div>
                </div>
              );
            })}
          </div>
          {errors?.orientation_type && touched?.orientation_type ? (
            <span className="text-danger error-msg">{errors?.orientation_type}</span>
          ) : null}
        </Row>
      </CardBody>
    </Card>
  );
}
