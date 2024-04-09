import { type EventFromPhp, type Preference } from "@types";
import { Formik } from "formik";
import * as Yup from "yup";
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
import {
  getBackdropQuery,
  getDesignQuery,
  getFiltersQuery,
  getOrientationQuery,
} from "@server/api/queries";
import ChooseFilter from "./ChooseFilter";
import ShimmerPhotoOverlay from "@components/Shimmer/ShimmerPhotoOverlay";
import Overlay from "@components/MyEvent/PhotoOverlay/Overlay";
import Backdrop from "@components/MyEvent/PhotoOverlay/Backdrop";
import ChooseDesign from "@components/MyEvent/PhotoOverlay/ChooseDesign";
import { Button, Col, Row } from "reactstrap";
import ChooseOrientation from "./ChooseOrientation";
import { api } from "@utils/api";
import { type UpdateEventPersonalizationDetailsInput } from "@server/api/routers/admin/event";

type PhotoOverlayProps = {
  event: EventFromPhp;
  filters?: Preference[];
  orientation?: Preference[];
  design?: Preference[];
  backdrop?: Preference[];
  isLoading: boolean;
};

const PhotoOverlayEdit = ({ event, isLoading }: PhotoOverlayProps) => {
  const { data: filter } = getFiltersQuery();
  const { data: orientation } = getOrientationQuery();
  const { data: design } = getDesignQuery();
  const { data: backdrop } = getBackdropQuery();

  const initialFormValues = {
    filter_type: event.photos?.filter_type ?? 0,
    orientation_type: event.photos?.orientation_type ?? 0,
    design_type: event.photos?.design_type ?? 0,
    first_line: event.photos?.first_line ?? "",
    second_line: event.photos?.second_line ?? "",
    primary_color: event.photos?.primary_color ?? "",
    secondary_color: event.photos?.secondary_color ?? "",
    vision: event.photos?.vision ?? "",
    backdrop_type: event.photos?.backdrop_type ?? 0,
    logo: event.photos?.logo as string | null | undefined,
  };

  const validationSchema = Yup.object({
    filter_type: Yup.number().required(FILTER_REQUIRED),
    orientation_type: Yup.number().required(ORIENTATION_REQUIRED),
    design_type: Yup.number().required(DESIGN_REQUIRED),
    first_line: Yup.string().max(200, FIRST_LINE_MAX).required(FIRST_LINE_REQUIRE),
    second_line: Yup.string().max(200, FIRST_LINE_MAX).required(SECOND_LINE_REQUIRE),
    primary_color: Yup.string().required(PRIMARY_COLOR_REQUIRE),
    secondary_color: Yup.string().required(SECONDARY_COLOR_REQUIRE),
    vision: Yup.string().max(1000, DESCRIPTION_MAX),
    backdrop_type: Yup.number().required(BACKDROP_REQUIRED),
    logo: Yup.string().nullable(),
  });

  const updateEventPersonalizationMutation =
    api.eventAdminRouter.updateEventPersonalizationDetails.useMutation();
  const handleSubmit = (
    values: typeof initialFormValues,
    {
      setSubmitting,
      resetForm,
    }: {
      setSubmitting: (isSubmitting: boolean) => void;
      resetForm: (nextState: { values: typeof initialFormValues }) => void;
    },
  ) => {
    const payload: UpdateEventPersonalizationDetailsInput = {
      id: event.id,
      ...values,
    };

    updateEventPersonalizationMutation.mutate(payload, {
      onSuccess: () => {
        resetForm({ values });
      },
      onError: () => {
        setSubmitting(false);
      },
    });
  };

  if (isLoading || !filter || !orientation) {
    return <ShimmerPhotoOverlay />;
  }

  return (
    <>
      <Formik
        initialValues={initialFormValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ setFieldValue, initialValues, values, resetForm, setSubmitting, errors, touched }) => (
          <>
            <ChooseFilter
              filters={filter}
              setFieldValue={setFieldValue}
              values={values}
              errors={errors}
              touched={touched}
            />

            <ChooseOrientation
              orientations={orientation}
              setFieldValue={setFieldValue}
              values={values}
              errors={errors}
              touched={touched}
            />

            <ChooseDesign
              design={design}
              select={(id: number) => setFieldValue("design_type", id)}
              values={values}
              errors={errors}
              touched={touched}
              showFlavorText={false}
            />

            <Overlay
              setFieldValue={setFieldValue}
              errors={errors}
              touched={touched}
              values={values}
              event={event}
              showFlavorText={false}
            />

            <Backdrop
              select={(id: number) => setFieldValue("backdrop_type", id)}
              backdrop={backdrop}
              errors={errors}
              values={values}
              touched={touched}
              showFlavorText={false}
            />

            {JSON.stringify(values) !== JSON.stringify(initialValues) && (
              <Row>
                <Col md="12" className="flex tw-justify-end tw-mt-2">
                  <Button onClick={() => resetForm()} className="me-1" color="secondary" outline>
                    Reset
                  </Button>
                  <Button onClick={() => handleSubmit(values, { setSubmitting, resetForm })}>
                    Save
                  </Button>
                </Col>
              </Row>
            )}
          </>
        )}
      </Formik>
    </>
  );
};

export default PhotoOverlayEdit;
