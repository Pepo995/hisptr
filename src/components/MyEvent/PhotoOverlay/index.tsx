import { Button, Card, CardBody, CardHeader, CardText, CardTitle, Input } from "reactstrap";
import { Form, Formik } from "formik";
import * as Yup from "yup";

import ChooseDesign from "./ChooseDesign";
import Overlay from "./Overlay";
import Backdrop from "./Backdrop";
import {
  BACKDROP_REQUIRED,
  DESCRIPTION_MAX,
  DESIGN_REQUIRED,
  FILTER_REQUIRED,
  FIRST_LINE_MAX,
  FIRST_LINE_REQUIRE,
  ORIENTATION_REQUIRED,
  PRIMARY_COLOR_REQUIRE,
  SECONDARY_COLOR_REQUIRE,
  SECOND_LINE_REQUIRE,
} from "@constants/ValidationConstants";
import ShimmerPhotoOverlay from "@components/Shimmer/ShimmerPhotoOverlay";
import { useRouter } from "next/router";
import { type EventFromPhp, type Preference } from "@types";
import NOFilter from "@images/no-filter.jpeg";
import GlamFilter from "@images/k-dash.jpeg";
import BlackWhiteFilter from "@images/black-and-white.jpeg";
import _2x6 from "@images/2x6.webp";
import _6x4 from "@images/6x4.webp";
import _4x6 from "@images/4x6.webp";
import Image from "next/image";
import { api } from "@utils/api";
import { customerUpdatePersonalization } from "@schemas";
import { toast } from "react-toastify";
import { type EventPhotosDetail } from "@prisma/client";

type PhotoOverlayProps = {
  filter?: Preference[];
  orientation?: Preference[];
  design?: Preference[];
  backdrop?: Preference[];
  id: number;
  personalizationDetails: EventPhotosDetail | undefined;
  event: EventFromPhp;
  handlePre: () => void;
  isLoading: boolean;
};

function PhotoOverlay({
  filter,
  orientation,
  design,
  backdrop,
  id,
  personalizationDetails,
  event,
  handlePre,
  isLoading,
}: PhotoOverlayProps) {
  const router = useRouter();
  const addPersonalizationDetailsMutation =
    api.eventCustomerRouter.addPersonalization.useMutation();

  const initialFormValues = {
    filterType: personalizationDetails?.filterType ?? 0,
    orientationType: personalizationDetails?.orientationType ?? 0,
    designType: personalizationDetails?.designType ?? 0,
    firstLine: personalizationDetails?.firstLine ?? "",
    secondLine: personalizationDetails?.secondLine ?? "",
    primaryColor: personalizationDetails?.primaryColor ?? "",
    secondaryColor: personalizationDetails?.secondaryColor ?? "",
    vision: personalizationDetails?.vision ?? "",
    backdropType: personalizationDetails?.backdropType ?? 0,
    logo: personalizationDetails?.logo,
  };

  const validationSchema = Yup.object({
    filterType: Yup.string().required(FILTER_REQUIRED),
    orientationType: Yup.string().required(ORIENTATION_REQUIRED),
    designType: Yup.string().required(DESIGN_REQUIRED),
    firstLine: Yup.string().max(200, FIRST_LINE_MAX).required(FIRST_LINE_REQUIRE),
    secondLine: Yup.string().max(200, FIRST_LINE_MAX).required(SECOND_LINE_REQUIRE),
    primaryColor: Yup.string().required(PRIMARY_COLOR_REQUIRE),
    secondaryColor: Yup.string().required(SECONDARY_COLOR_REQUIRE),
    vision: Yup.string().max(1000, DESCRIPTION_MAX),
    backdropType: Yup.string().required(BACKDROP_REQUIRED),
    logo: Yup.string().nullable(),
  });

  const updateHandler = (data: typeof initialFormValues) => {
    const validated = customerUpdatePersonalization.safeParse({
      id: id.toString(),
      ...data,
    });
    if (validated.success) {
      const validatedValues = validated.data;
      addPersonalizationDetailsMutation.mutate(
        {
          id: id.toString(),
          filterType: validatedValues.filterType,
          orientationType: validatedValues.orientationType,
          designType: validatedValues.designType,
          firstLine: validatedValues.firstLine,
          secondLine: validatedValues.secondLine,
          primaryColor: validatedValues.primaryColor,
          secondaryColor: validatedValues.secondaryColor,
          vision: validatedValues.vision,
          backdropType: validatedValues.backdropType,
          logo: validatedValues.logo ?? null,
        },
        {
          onSuccess: () => {
            localStorage.removeItem(`${"steps"}${id}`);
            void router.push("/customer/event-management/upcoming-event");
          },
          onError: (error) => {
            const errorMessage =
              error?.data?.httpStatus === 400
                ? error.message
                : "We had a problem saving your event personalization details. Please contact us to give you custom attention.";
            toast.error(errorMessage);
          },
        },
      );
    } else {
      toast.error("Please check the form and fill missing values.");
    }
  };

  return (
    <>
      <div className="main-role-ui mt-5">
        {!isLoading ? (
          <Formik
            initialValues={initialFormValues}
            validationSchema={validationSchema}
            validateOnBlur={true}
            validateOnChange={true}
            onSubmit={updateHandler}
          >
            {({ errors, setFieldValue, touched, values }) => (
              <Form className="tw-w-full">
                <>
                  <Card className="fade-in bg-white">
                    <CardHeader>
                      <CardTitle className="sy-tx-primary f-18">Choose Your Photo Filter</CardTitle>
                    </CardHeader>
                    <CardBody>
                      <CardText>
                        Please choose the filter that you would like on your photos. Select No
                        Filter if you would not like a filter applied. The filter you choose will be
                        on all photos taken with the booth.
                      </CardText>
                      <div className="tw-flex tw-flex-col tw-justify-evenly tw-flex-wrap tw-items-center tw-gap-y-16 tw-pt-5 tw-pb-16 md:tw-flex-row">
                        <div
                          className="photo-filter cursor-pointer tw-size-40"
                          onClick={() => setFieldValue("filterType", filter?.[0]?.id)}
                        >
                          <Image
                            src={NOFilter}
                            className={`img-fluid tw-inset-auto tw-rounded-2xl tw-static${
                              values?.filterType === filter?.[0]?.id ? " img-border-active" : ""
                            }`}
                            alt="filter"
                          />
                          <div className="form-check form-check-inline image-select ">
                            <Input
                              type="radio"
                              name="filter"
                              checked={values?.filterType === filter?.[0]?.id}
                              onClick={() => setFieldValue("filterType", filter?.[0]?.id)}
                              id="basic-cb-checked"
                              className="cu-select radio-custom"
                            />
                          </div>
                          <p className="text-center mt-50">{filter?.[0]?.name}</p>
                        </div>

                        <div
                          className="photo-filter cursor-pointer tw-size-40"
                          onClick={() => setFieldValue("filterType", filter?.[1]?.id)}
                        >
                          <Image
                            src={GlamFilter}
                            className={`img-fluid tw-inset-auto tw-rounded-2xl tw-static${
                              values?.filterType === filter?.[1]?.id ? " img-border-active" : ""
                            }`}
                            alt="filter"
                          />
                          <div className="form-check form-check-inline image-select ">
                            <Input
                              type="radio"
                              name="filter"
                              checked={values?.filterType === filter?.[1]?.id}
                              onClick={() => setFieldValue("filterType", filter?.[1]?.id)}
                              id="basic-cb-checked"
                              className="cu-select radio-custom"
                            />
                          </div>
                          <p className="text-center mt-50">{filter?.[1]?.name}</p>
                        </div>

                        <div
                          className="photo-filter cursor-pointer tw-size-40"
                          onClick={() => setFieldValue("filterType", filter?.[2]?.id)}
                        >
                          <Image
                            src={BlackWhiteFilter}
                            className={`img-fluid tw-inset-auto tw-rounded-2xl tw-static${
                              values?.filterType === filter?.[2]?.id ? " img-border-active" : ""
                            }`}
                            alt="filter"
                          />
                          <div className="form-check form-check-inline image-select ">
                            <Input
                              type="radio"
                              name="filter"
                              checked={values?.filterType === filter?.[2]?.id}
                              onClick={() => setFieldValue("filterType", filter?.[2]?.id)}
                              id="basic-cb-checked"
                              className="cu-select radio-custom"
                            />
                          </div>
                          <p className="text-center mt-50">{filter?.[2]?.name}</p>
                        </div>
                      </div>
                      {errors?.filterType && touched?.filterType ? (
                        <span className="text-danger error-msg">{errors?.filterType}</span>
                      ) : null}
                    </CardBody>
                  </Card>
                  <Card className="fade-in bg-white">
                    <CardHeader>
                      <CardTitle className="sy-tx-primary f-18">
                        Create your Custom Photo Layout Design
                      </CardTitle>
                    </CardHeader>
                    <CardBody>
                      <CardText>
                        Choose your Photo Layout, Design Template, and Text below- if you do not see
                        what you&apos;re looking for, we can create custom layouts as well. Your
                        submission through this form does NOT represent a final version of your
                        artwork. This form only serves as a tool for us to gather your
                        specifications and vision, we will finalize the design with you via email.
                      </CardText>
                    </CardBody>
                  </Card>

                  <Card className="fade-in bg-white">
                    <CardHeader>
                      <CardTitle className="sy-tx-primary f-18">
                        Select Your Photo Size & Orientation
                      </CardTitle>
                    </CardHeader>
                    <CardBody>
                      <CardText>
                        Please select a template below for how you would like your photos to be
                        oriented. There are multiple options from the classic strip style and card
                        style to the number of photos on each printout.
                      </CardText>
                      <div className="photo-dimension tw-justify-evenly tw-py-5">
                        <div
                          className={"tw-border-slate-200 photo-size cursor-pointer"}
                          onClick={() => setFieldValue("orientationType", orientation?.[0]?.id)}
                        >
                          <div className="custom-photo-layout tw-flex tw-justify-center tw-items-center tw-flex-col">
                            <Image className="tw-w-4/5" src={_2x6} alt="2x6" />
                            <div className="text-center sy-tx-modal mt-1 f-500 f-14">
                              {orientation?.[0]?.name}
                            </div>
                          </div>
                          <div className="form-check form-check-inline image-select ">
                            <Input
                              type="radio"
                              name="size"
                              checked={values?.orientationType === orientation?.[0]?.id}
                              onClick={() => setFieldValue("orientationType", orientation?.[0]?.id)}
                              id="basic-cb-checked"
                              className="cu-select radio-custom"
                            />
                          </div>
                        </div>
                        <div
                          className={"tw-border-slate-200 photo-size cursor-pointer"}
                          onClick={() => setFieldValue("orientationType", orientation?.[1]?.id)}
                        >
                          <div className="custom-photo-layout tw-flex tw-justify-center tw-items-center tw-flex-col">
                            <Image className="tw-w-4/5" src={_6x4} alt="6x4" />
                            <div className="text-center sy-tx-modal f-500 f-14">
                              {orientation?.[1]?.name}
                            </div>
                          </div>
                          <div className="form-check form-check-inline image-select ">
                            <Input
                              type="radio"
                              name="size"
                              checked={values?.orientationType === orientation?.[1]?.id}
                              onClick={() => setFieldValue("orientationType", orientation?.[1]?.id)}
                              id="basic-cb-checked"
                              className="cu-select radio-custom"
                            />
                          </div>
                        </div>
                        <div
                          className={"tw-border-slate-200 photo-size cursor-pointer"}
                          onClick={() => setFieldValue("orientationType", orientation?.[2]?.id)}
                        >
                          <div className="custom-photo-layout tw-flex tw-justify-center tw-items-center tw-flex-col">
                            <Image className="tw-w-4/5" src={_4x6} alt="4x6" />
                            <div className="text-center mt-1 sy-tx-modal f-500 f-14">
                              {orientation?.[2]?.name}
                            </div>
                          </div>
                          <div className="form-check form-check-inline image-select ">
                            <Input
                              type="radio"
                              name="size"
                              checked={values?.orientationType === orientation?.[2]?.id}
                              onClick={() => setFieldValue("orientationType", orientation?.[2]?.id)}
                              id="basic-cb-checked"
                              className="cu-select radio-custom"
                            />
                          </div>
                        </div>
                      </div>
                      {errors?.orientationType && touched?.orientationType ? (
                        <span className="text-danger error-msg">{errors?.orientationType}</span>
                      ) : null}

                      <ChooseDesign
                        select={(id: number) => setFieldValue("designType", id)}
                        design={design}
                        errors={errors}
                        touched={touched}
                        values={values}
                      />
                      <Overlay
                        setFieldValue={setFieldValue}
                        errors={errors}
                        touched={touched}
                        values={values}
                        event={event}
                      />
                      <Backdrop
                        select={(id: number) => setFieldValue("backdropType", id)}
                        backdrop={backdrop}
                        errors={errors}
                        values={values}
                        touched={touched}
                      />
                      <div className="mt-sm-3 mt-1">
                        <Button className="custom-btn4 me-75 mb-75" onClick={handlePre}>
                          Back
                        </Button>
                        <Button className="custom-btn3 mb-75" type="submit">
                          Save
                        </Button>
                      </div>
                    </CardBody>
                  </Card>
                </>
              </Form>
            )}
          </Formik>
        ) : (
          <ShimmerPhotoOverlay />
        )}
      </div>
    </>
  );
}

export default PhotoOverlay;
