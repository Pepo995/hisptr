import {
  Button,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Col,
  FormGroup,
  Label,
  Row,
} from "reactstrap";
import ShimmerEventDetail from "@components/Shimmer/ShimmerEventDetail";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import "flatpickr/dist/themes/light.css";
import Select from "react-select";
import { type EventForFrontend } from "@server/services/parsers";
import { EVENT_ADMIN_STATUS_LABEL } from "@constants/CommonConstants";
import { getPartnersQuery } from "@server/api/queries";
import { useCallback, useMemo, useState } from "react";
import { api } from "@utils/api";
import { toast } from "react-toastify";
import ConfirmationModal from "@components/Modal/ConfirmationModal";
import { events_admin_status } from "@prisma/client";
import router from "next/router";

type EventAdminProps = {
  isLoading: boolean;
  event: EventForFrontend;
};

const EventAdminEdit = ({ event }: EventAdminProps) => {
  const { data: partners, isLoading: loadingPartners } = getPartnersQuery({
    marketId: event.market!,
  });

  const getPartner = useCallback(
    (partnerId: number | undefined, partners: { id: number; company: string }[] | undefined) => {
      if (partnerId === null) {
        return { value: -1, label: "None" };
      }
      const partner = partners?.find((partner) => partner.id === partnerId);
      if (partner) {
        return { value: partner.id, label: partner.company };
      }
      return { value: -1, label: "None" };
    },
    [],
  );

  const initialValues = useMemo(() => {
    return {
      eventStatus: {
        value: event.adminStatus ?? "awaiting",
        label: EVENT_ADMIN_STATUS_LABEL.get(event.adminStatus ?? "awaiting"),
      },
      partner: getPartner(event.partnerId, partners),
    };
  }, [event, getPartner, partners]);

  const partnerOptions = [
    { value: -1, label: "None" },
    ...(partners?.map((partner) => ({
      value: partner.id,
      label: partner.company,
    })) ?? []),
  ];

  const options = Array.from(EVENT_ADMIN_STATUS_LABEL)
    .map(([value, label]) => ({
      value,
      label,
    }))
    .filter((option) => option.value !== "awaiting");

  const validationSchema = Yup.object({
    eventStatus: Yup.object({
      label: Yup.string().required(),
      value: Yup.string().required(),
    }).required(),
    partner: Yup.string().nullable(),
  });

  const updateEventAdminDetailsMutation =
    api.eventAdminRouter.updateEventAdminDetails.useMutation();
  const handleSubmit = (
    values: typeof initialValues,
    {
      setSubmitting,
      resetForm,
    }: {
      setSubmitting: (isSubmitting: boolean) => void;
      resetForm: (nextState: { values: typeof initialValues }) => void;
    },
  ) => {
    const payload = {
      id: event.id,
      adminStatus: values.eventStatus.value,
      partnerId: values.partner.value == -1 ? null : values.partner.value,
    };
    updateEventAdminDetailsMutation.mutate(payload, {
      onSuccess: () => {
        resetForm({ values });
        toast.success("Event details updated successfully");
      },
      onError: () => {
        setSubmitting(false);
        toast.error("Failed to update event details");
      },
    });
  };

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const renderConfirmationModals = useMemo(
    () => (
      <>
        <ConfirmationModal
          isOpen={isConfirmModalOpen}
          setIsOpen={setIsConfirmModalOpen}
          onConfirm={async () => {
            setIsLoading(true);

            const res = await updateEventAdminDetailsMutation.mutateAsync({
              id: event?.id,
              adminStatus: events_admin_status.confirmed,
              partnerId: null,
            });

            if (res.success) {
              toast.success("Event confirmed successfully!");
              return router.reload();
            }

            setIsLoading(false);
            toast.error("Something went wrong!");
          }}
          title="Confirm Event"
          description="You're about to confirm the event, proceed?"
          confirmText="Yes"
          cancelText="No"
        />
        <ConfirmationModal
          isOpen={isCancelModalOpen}
          setIsOpen={setIsCancelModalOpen}
          onConfirm={async () => {
            setIsLoading(true);

            const res = await updateEventAdminDetailsMutation.mutateAsync({
              id: event?.id,
              adminStatus: events_admin_status.cancelled,
              partnerId: null,
            });

            if (res.success) {
              toast.success("Event cancelled successfully!");
              return router.reload();
            }

            setIsLoading(false);
            toast.error("Something went wrong!");
          }}
          title="Cancel Event"
          description="You're about to cancel the event, proceed?"
          confirmText="Yes"
          cancelText="No"
        />
      </>
    ),
    [event?.id, isCancelModalOpen, isConfirmModalOpen, updateEventAdminDetailsMutation],
  );

  if (isLoading || loadingPartners) {
    return <ShimmerEventDetail />;
  }

  return (
    <>
      {renderConfirmationModals}
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ setFieldValue, initialValues, values, resetForm, setSubmitting }) => (
          <Form>
            <Card className="card-apply-job bg-white">
              <CardHeader className="p-0 mx-2 mt-2 mb-75">
                <CardTitle className="sy-tx-primary">Admin</CardTitle>
                <p className="sy-tx-modal f-500">
                  Event ID: <span className="sy-tx-primary f-600">#{event.eventNumber}</span>
                </p>
              </CardHeader>
              <CardBody>
                <Row>
                  <Col md="6">
                    <FormGroup>
                      <CardTitle tag="h4" className="f-18">
                        Event Status
                      </CardTitle>
                      {values.eventStatus.value !== "awaiting" ? (
                        <Select
                          id="eventStatus"
                          name="eventStatus"
                          className={`react-select`}
                          classNamePrefix="select"
                          options={options}
                          value={values.eventStatus}
                          onChange={(option) => setFieldValue("eventStatus", option)}
                        />
                      ) : (
                        <div>
                          <p className="">{values.eventStatus.label}</p>
                          <div className="d-flex tw-gap-2">
                            <Button
                              className=" me-75 mb-75"
                              color="secondary"
                              outline
                              onClick={() => setIsCancelModalOpen(true)}
                            >
                              Cancel
                            </Button>
                            <Button
                              className=" me-75 mb-75"
                              type="button"
                              onClick={() => setIsConfirmModalOpen(true)}
                            >
                              Confirm
                            </Button>
                          </div>
                        </div>
                      )}
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    {values.eventStatus.value !== "awaiting" && (
                      <FormGroup>
                        <Label for="partner" className="sy-tx-primary">
                          Partner
                        </Label>
                        <Select
                          id="partner"
                          name="partner"
                          className="react-select"
                          classNamePrefix="select"
                          options={partnerOptions}
                          value={values.partner}
                          onChange={(option) => setFieldValue("partner", option)}
                        />
                      </FormGroup>
                    )}
                  </Col>
                </Row>

                {JSON.stringify(values) !== JSON.stringify(initialValues) && (
                  <Row>
                    <Col md="12" className="flex tw-justify-end tw-mt-2">
                      <Button
                        onClick={() => resetForm()}
                        className="me-1"
                        color="secondary"
                        outline
                      >
                        Reset
                      </Button>
                      <Button onClick={() => handleSubmit(values, { setSubmitting, resetForm })}>
                        Save
                      </Button>
                    </Col>
                  </Row>
                )}
              </CardBody>
            </Card>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default EventAdminEdit;
