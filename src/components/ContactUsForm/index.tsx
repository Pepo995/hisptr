"use client";
import { Form, Formik } from "formik";
import { toFormikValidationSchema } from "zod-formik-adapter";
import Checkbox from "@components/Checkbox";
import FormSelect from "@components/inputs/FormSelect";
import { type SelectOption } from "@types";
import { useMemo, useState } from "react";
import { getEventTypesQuery, getStateQuery } from "@server/api/queries";
import FormInput from "@components/inputs/FormInput";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { toast } from "react-toastify";
import { Icon } from "@iconify/react";
import { useRouter } from "next/navigation";
import ControlledDateInput from "@components/inputs/ControlledDateInput";
import { contactUsSchema } from "./contactUsSchema";
import RecaptchaComponent from "@components/RecaptchaComponent";
import { sendGTMEvent } from "@next/third-parties/google";
import { api } from "@utils/api";
import {
  PACKAGE_ID_360,
  PACKAGE_ID_ARRAY,
  PACKAGE_ID_CUSTOM_EVENT,
  PACKAGE_ID_HALO,
  PACKAGE_ID_MOSAIC,
  PACKAGE_ID_SOCIAL_PHOTOGRAPHER,
} from "@constants/packages";
import { getGaClientid } from "@utils/getGaClientid";
import { trpc } from "@components/TrpcProvider";

const usableOptions = [
  "Banquet",
  "Bar Mitzvah",
  "Bat Mitzvah",
  "Birthday Party",
  "Class Reunion",
  "Charity Event",
  "Family Reunion",
  "Fundraiser",
  "Graduation",
  "Holiday Party",
  "Private Party",
  "Prom",
  "Quinceanera",
  "School Dance",
  "Wedding",
  "Wedding Anniversary/Celebration",
  "Other",
];

const ContactUsForm = ({ className }: { className: string }) => {
  const context = api.useContext();
  const saveEventMutation = trpc.eventRouter.saveEventContactUs.useMutation();

  const router = useRouter();

  const [token, setToken] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(false);

  dayjs.extend(utc);

  const requestInfo = { sortField: "name" as const, sortOrder: "asc" as const };

  const { isLoading: isLoadingStates, data: states } = getStateQuery(requestInfo);

  const stateOptions: SelectOption[] | undefined = useMemo(
    () =>
      states?.map((state) => ({
        value: state.id.toString(),
        label: state.name,
      })),
    [states],
  );

  const { isLoading: isLoadingEventTypes, data: eventTypes } = getEventTypesQuery(requestInfo);

  const typeOptions: SelectOption[] | undefined = useMemo(
    () =>
      eventTypes
        ?.filter((eventType) => usableOptions.some((option) => option === eventType.name))
        .map((eventType) => ({
          value: eventType.id.toString(),
          label: eventType.name,
        })),
    [eventTypes],
  );

  const packageOptions = [
    { value: PACKAGE_ID_HALO.toString(), label: "Halo" },
    { value: PACKAGE_ID_ARRAY.toString(), label: "Array" },
    { value: PACKAGE_ID_360.toString(), label: "360" },
    {
      value: PACKAGE_ID_SOCIAL_PHOTOGRAPHER.toString(),
      label: "Social Photographer",
    },
    { value: PACKAGE_ID_MOSAIC.toString(), label: "Mosaic" },
    { value: PACKAGE_ID_CUSTOM_EVENT.toString(), label: "Custom Events" },
  ];

  const initialFormValues = {
    firstName: "",
    lastName: "",
    eventDate: undefined,
    email: "",
    phoneNumber: "",
    city: undefined,
    stateId: "",
    budgetForPrice: "",
    packageId: "",
    typeId: "",
    message: undefined,
    consent: false,
  };

  const inputClassName =
    "tw-mt-1 tw-p-2 tw-w-full tw-bg-[#ffffffd9] tw-placeholder-[#000000b3] placeholder:tw-font-thin tw-text-black";

  const handleSubmit = async (values: typeof initialFormValues) => {
    if (!token) {
      console.log("Recaptcha has not been loaded");
      return;
    }

    const clientId = getGaClientid();

    await saveEventMutation.mutateAsync(
      {
        ...values,
        captchaToken: token,
        eventDate: dayjs(values.eventDate).toDate(),
        budgetForPrice: !isNaN(parseInt(values.budgetForPrice))
          ? parseInt(values.budgetForPrice)
          : null,
        packageId: !isNaN(parseInt(values.packageId)) ? parseInt(values.packageId) : null,
        typeId: !isNaN(parseInt(values.typeId)) ? parseInt(values.typeId) : null,
        stateId: !isNaN(parseInt(values.stateId)) ? parseInt(values.stateId) : null,
        clientId,
      },
      {
        onSuccess: (result) => {
          if (result.success) {
            sendGTMEvent({
              event: "contact_us",
              value: {
                email: values.email,
                type: result.typeName,
              },
            });

            void context.eventRouter.getInProcessEvent.invalidate();
            router.push("/thank-you");
          }

          setIsLoading(false);
        },
        onError: () => {
          toast.error("Error sending information, please try again later");
          setIsLoading(false);
        },
      },
    );
  };

  if (isLoadingEventTypes || isLoadingStates || saveEventMutation.isLoading || isLoading) {
    return (
      <Icon
        icon="eos-icons:three-dots-loading"
        color="white"
        height={200}
        width={200}
        className="tw-mx-auto"
      />
    );
  }

  return (
    <Formik
      initialValues={initialFormValues}
      validationSchema={toFormikValidationSchema(contactUsSchema)}
      validateOnBlur={true}
      validateOnChange={true}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting, errors, setFieldValue, touched, values }) => (
        <Form className="tw-w-4/5 tw-mx-auto tw-text-white tw-text-lg tw-font-medium">
          <div className="tw-flex tw-flex-col md:tw-flex-row md:tw-space-x-11">
            <div className="md:tw-w-1/2 tw-gap-y-7 tw-flex tw-flex-col md:tw-mb-0 tw-mb-7">
              <label className="tw-block ">
                What is your first name and last name?*
                <div className="tw-flex tw-flex-row tw-gap-x-3">
                  <FormInput
                    type="text"
                    name="firstName"
                    placeholder="FIRST NAME"
                    error={errors.firstName}
                    isTouched={!!touched.firstName}
                    inputStyles={inputClassName}
                    className="tw-flex tw-flex-col tw-w-full"
                    errorStyles="tw-text-[#ff4545]"
                    customSecondLabel={
                      <label
                        className={`tw-text-white tw-relative tw-text-xs tw-italic tw-text-right ${
                          errors.firstName && !!touched.firstName ? "tw-hidden" : "tw-block"
                        }`}
                        htmlFor="firstName"
                      >
                        <p className="tw-absolute tw-right-1">required</p>
                      </label>
                    }
                  />

                  <FormInput
                    type="text"
                    name="lastName"
                    placeholder="LAST NAME"
                    error={errors.lastName}
                    isTouched={!!touched.lastName}
                    inputStyles={inputClassName}
                    className="tw-flex tw-flex-col tw-w-full"
                    errorStyles="tw-text-[#ff4545]"
                    customSecondLabel={
                      <label
                        className={`tw-text-white tw-relative tw-text-xs tw-italic tw-text-right ${
                          errors.firstName && !!touched.firstName ? "tw-hidden" : "tw-block"
                        }`}
                        htmlFor="firstName"
                      >
                        <p className="tw-absolute tw-right-1">required</p>
                      </label>
                    }
                  />
                </div>
              </label>

              <label className="tw-font-medium">
                What is your e-mail address?*
                <FormInput
                  type="text"
                  name="email"
                  placeholder="EXAMPLE@EMAIL.COM"
                  inputStyles={inputClassName}
                  error={errors.email}
                  isTouched={!!touched.email}
                  errorStyles="tw-text-[#ff4545]"
                  customSecondLabel={
                    <label
                      className={`tw-text-white tw-relative tw-text-xs tw-italic tw-text-right ${
                        errors.firstName && !!touched.firstName ? "tw-hidden" : "tw-block"
                      }`}
                      htmlFor="firstName"
                    >
                      <p className="tw-absolute tw-right-1">required</p>
                    </label>
                  }
                />
              </label>

              <label className="tw-font-medium">
                City
                <div className="tw-flex tw-flex-row tw-gap-x-3">
                  <FormInput
                    type="text"
                    name="city"
                    placeholder="CITY"
                    inputStyles={inputClassName}
                    className="tw-w-1/2"
                    error={errors.city}
                    isTouched={!!touched.city}
                    errorStyles="tw-text-[#ff4545]"
                  />

                  <FormSelect
                    name="stateId"
                    placeholder="STATE"
                    error={errors.stateId}
                    isTouched={!!touched.stateId}
                    inputStyles={`${inputClassName} tw-text-left tw-font-thin`}
                    onChange={(value) => setFieldValue("stateId", value ?? "")}
                    className="tw-w-1/2"
                    options={stateOptions}
                    errorStyles="tw-text-[#ff4545]"
                  />
                </div>
              </label>

              <div className="tw-font-medium">
                Package of Interest
                <FormSelect
                  name="packageId"
                  placeholder="SELECT"
                  error={errors.packageId}
                  isTouched={!!touched.packageId}
                  inputStyles={`${inputClassName} tw-text-left tw-font-thin`}
                  onChange={(value) => setFieldValue("packageId", value ?? "")}
                  options={packageOptions}
                  errorStyles="tw-text-[#ff4545]"
                />
              </div>
            </div>

            <div className="md:tw-w-1/2 tw-gap-y-7 tw-flex tw-flex-col">
              <label className="tw-font-medium">
                Event Date?
                <ControlledDateInput
                  name="eventDate"
                  placeholder="01/01/24"
                  defaultValue={undefined}
                  error={errors.eventDate}
                  isTouched={!!touched.eventDate}
                  inputStyles={inputClassName}
                  onChange={(e) => {
                    const eventDate = e.target.value;
                    const [year, month, day] = eventDate.split("-");

                    const datetime = `${year}-${month}-${day} 00:00:00`;

                    void setFieldValue("eventDate", eventDate?.[0] ? datetime : undefined);
                  }}
                  errorStyles="tw-text-[#ff4545]"
                />
              </label>

              <label className="tw-font-medium">
                Mobile Number
                <FormInput
                  type="text"
                  name="phoneNumber"
                  placeholder="000123456789"
                  inputStyles={inputClassName}
                  error={errors.phoneNumber}
                  isTouched={!!touched.phoneNumber}
                  mask="(###) ###-####"
                  errorStyles="tw-text-[#ff4545]"
                  customSecondLabel={
                    <label
                      className={`tw-text-white tw-relative tw-text-xs tw-italic tw-text-right ${
                        errors.firstName && !!touched.firstName ? "tw-hidden" : "tw-block"
                      }`}
                      htmlFor="firstName"
                    >
                      <p className="tw-absolute tw-right-1">required</p>
                    </label>
                  }
                />
              </label>

              <label className="tw-font-medium">
                Budget?
                <FormInput
                  type="text"
                  name="budgetForPrice"
                  placeholder="$1,000"
                  inputStyles={inputClassName}
                  error={errors.budgetForPrice}
                  isTouched={!!touched.budgetForPrice}
                  errorStyles="tw-text-[#ff4545]"
                />
              </label>

              <div className="tw-font-medium">
                Type of Event
                <FormSelect
                  name="typeId"
                  placeholder="SELECT"
                  error={errors.typeId}
                  isTouched={!!touched.typeId}
                  inputStyles={`${inputClassName} tw-text-left tw-font-thin`}
                  onChange={(value) => setFieldValue("typeId", value ?? "")}
                  options={typeOptions}
                  errorStyles="tw-text-[#ff4545]"
                />
              </div>
            </div>
          </div>

          <label className="tw-block tw-pt-7 tw-pb-7 tw-font-medium">
            How can we help?
            <FormInput
              type="textarea"
              name="message"
              placeholder="LEAVE A COMMENT..."
              inputStyles={inputClassName}
              error={errors.message}
              isTouched={!!touched.message}
              errorStyles="tw-text-[#ff4545]"
            />
          </label>

          <div className={`${className} tw-my-5`}>
            <Checkbox
              onChange={(e) => setFieldValue("consent", e.target.checked)}
              checked={values.consent}
              label="I would like to receive future event updates and promotion communications via email/phone/SMS."
              id="consent"
              name="consent"
              white
            />
          </div>

          <RecaptchaComponent validate={setToken} action="contact/us">
            <button
              type="submit"
              className="custom-btn9 tw-h-fit tw-min-h-min tw-w-40 tw-py-3 md:tw-text-lg tw-text-base"
            >
              {isSubmitting ? "LOADING..." : "SUBMIT"}
            </button>
          </RecaptchaComponent>
        </Form>
      )}
    </Formik>
  );
};

export default ContactUsForm;
