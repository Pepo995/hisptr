import Layout from "@components/layouts/Layout";
import { type NextPageWithLayout } from "@pages/_app";

import { type ReactElement, useMemo, useState } from "react";
import MainTitle from "@components/Title/MainTitle";

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { Form, Formik } from "formik";
dayjs.extend(utc);

import {
  CITY_REQUIRED,
  EMAIL_REQUIRED,
  EMAIL_VALID,
  EVENT_DATE_REQUIRED,
  EVENT_TYPE_REQUIRED,
  FIRST_NAME_MAX_LENGTH,
  FIRST_NAME_REQUIRED,
  LAST_NAME_MAX_LENGTH,
  LAST_NAME_REQUIRE,
  PHONE_MAX_LENGTH,
  PHONE_MIN_LENGTH,
  PHONE_NO_REGEX,
  PHONE_NO_VALID,
  PHONE_REQUIRED,
  STATE_REQUIRED,
} from "@constants/ValidationConstants";
import { z } from "zod";
import { EMAIL_REGEX } from "@constants/RegexConstants";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { api } from "@utils/api";
import FormDateInput from "@components/inputs/FormDate";
import FormSelect from "@components/inputs/FormSelect";
import FormInput from "@components/inputs/FormInput";
import type { SelectOption } from "@types";
import { getEventTypesQuery, getStateQuery } from "@server/api/queries";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { usableOptions } from "@constants/LeadsConstants";
import BudgetSlider from "@components/Sliders/BudgetSlider";
import ShimmerAddEvent from "@components/Shimmer/ShimmerAddEvent";
import Button from "@components/Button";

const initialFormValues = {
  firstName: "",
  lastName: "",
  email: "",
  city: "",
  stateId: "",
  eventDate: "",
  phoneNumber: "",
  approximateBudget: 0,
  typeId: "",
};

const validationSchema = z.object({
  firstName: z
    .string({
      required_error: FIRST_NAME_REQUIRED,
    })
    .max(25, FIRST_NAME_MAX_LENGTH),
  lastName: z.string({ required_error: LAST_NAME_REQUIRE }).max(25, LAST_NAME_MAX_LENGTH),
  email: z
    .string({ required_error: EMAIL_REQUIRED })
    .email({ message: EMAIL_VALID })
    .refine((v) => EMAIL_REGEX.test(v), EMAIL_VALID),
  city: z.string({ required_error: CITY_REQUIRED }),
  stateId: z.string({ required_error: STATE_REQUIRED }),
  eventDate: z.string({ required_error: EVENT_DATE_REQUIRED }),
  phoneNumber: z
    .string({ required_error: PHONE_REQUIRED })
    .min(10, PHONE_MIN_LENGTH)
    .max(10, PHONE_MAX_LENGTH)
    .regex(PHONE_NO_REGEX, {
      message: PHONE_NO_VALID,
    }),
  approximateBudget: z.number().optional(),
  typeId: z.string({ required_error: EVENT_TYPE_REQUIRED }),
});

const NewInvoiceCreation: NextPageWithLayout = () => {
  const router = useRouter();
  const createCustomInProcessEventMutation = api.eventRouter.createCustomLead.useMutation();

  const [isLoading, setIsLoading] = useState(false);

  const requestInfo = { sortField: "name" as const, sortOrder: "asc" as const };

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

  const { isLoading: isLoadingStates, data: states } = getStateQuery(requestInfo);

  const stateOptions: SelectOption[] | undefined = useMemo(
    () =>
      states?.map((state) => ({
        value: state.id.toString(),
        label: state.name,
      })),
    [states],
  );

  const submitHandler = async (values: typeof initialFormValues) => {
    setIsLoading(true);

    await createCustomInProcessEventMutation.mutateAsync(
      {
        ...values,
        stateId: parseInt(values.stateId),
        eventDate: dayjs(values.eventDate).toDate(),
        approximateBudget: values.approximateBudget,
      },
      {
        onSuccess: (result) => {
          if (result.success) {
            void router.push(`/admin/invoices/new-invoice-creation/${result.eventId}`);
            return;
          }

          setIsLoading(false);
        },
        onError: () => {
          toast.error("Error saving event, please try again later");
          setIsLoading(false);
        },
      },
    );
  };

  return (
    <div className="tw-bg-white tw-p-4 tw-rounded-sm">
      {createCustomInProcessEventMutation.isLoading ||
      isLoadingEventTypes ||
      isLoadingStates ||
      isLoading ? (
        <ShimmerAddEvent />
      ) : (
        <Formik
          initialValues={initialFormValues}
          validationSchema={toFormikValidationSchema(validationSchema)}
          validateOnBlur={true}
          validateOnChange={true}
          onSubmit={submitHandler}
        >
          {({ errors, setFieldValue, touched }) => (
            <Form className="tw-flex tw-flex-col tw-gap-10">
              <MainTitle text="Create new Lead" />
              {/* NAMES */}
              <div className="tw-flex sm:tw-flex-row tw-flex-col sm:tw-gap-4 tw-gap-10">
                <div className="tw-w-full">
                  <FormInput
                    label="First name*"
                    name="firstName"
                    error={errors.firstName}
                    isTouched={!!touched.firstName}
                    placeholder="Insert first name"
                  />
                </div>
                <div className="tw-w-full">
                  <FormInput
                    label="Last Name*"
                    name="lastName"
                    error={errors.lastName}
                    isTouched={!!touched.lastName}
                    placeholder="Insert last name"
                  />
                </div>
              </div>

              {/* EMAIL */}
              <div className="tw-flex-col tw-w-full">
                <div className="tw-w-full">
                  <FormInput
                    label="Email*"
                    name="email"
                    error={errors.email}
                    isTouched={!!touched.email}
                    placeholder="Insert email"
                  />
                </div>
              </div>

              {/* EVENT TYPE */}
              <div className="tw-flex-col tw-w-full">
                <FormSelect
                  label="Type Of Event*"
                  name="typeId"
                  error={errors.typeId}
                  isTouched={!!touched.typeId}
                  onChange={(v) => setFieldValue("typeId", v ?? "")}
                  placeholder="Select type"
                  options={typeOptions}
                />
              </div>

              {/* EVENT LOCATION */}
              <div className="tw-flex-col tw-w-full">
                <div className="tw-flex">
                  <label className="tw-text-black tw-font-bold tw-mb-2" htmlFor="city">
                    Where will your event be held?*
                  </label>
                </div>
                <div className="tw-flex tw-gap-4">
                  <div className="tw-w-full">
                    <FormInput
                      name="city"
                      error={errors.city}
                      isTouched={!!touched.city}
                      placeholder="Insert city"
                      secondLabel="City"
                    />
                  </div>
                  <div className="tw-w-full">
                    <FormSelect
                      secondLabel="State"
                      name="stateId"
                      error={errors.stateId}
                      isTouched={!!touched.stateId}
                      placeholder="Select state"
                      onChange={(v) => setFieldValue("stateId", v ?? "")}
                      options={stateOptions}
                    />
                  </div>
                </div>
              </div>

              <div>
                <FormDateInput
                  label="Event Date*"
                  name="eventDate"
                  error={errors.eventDate}
                  isTouched={!!touched.eventDate}
                  placeholder="Select event date"
                  defaultValue=""
                  onChange={(eventDate) =>
                    setFieldValue(
                      "eventDate",
                      eventDate?.[0]
                        ? dayjs.utc(eventDate?.[0].toUTCString())?.format("YYYY-MM-DD")
                        : "",
                    )
                  }
                />
              </div>

              {/* PHONE NUMBER */}
              <div className="tw-flex-col tw-w-full">
                <FormInput
                  label="Mobile Phone*"
                  name="phoneNumber"
                  error={errors.phoneNumber}
                  isTouched={!!touched.phoneNumber}
                  placeholder="Insert number"
                />
              </div>

              {/* BUDGET */}
              <div className="tw-flex-col tw-w-full">
                <label className="tw-text-black tw-font-bold tw-mb-2" htmlFor="approximateBudget">
                  Approximate Budget*
                </label>
                <BudgetSlider
                  defaultValue={0}
                  onChange={(e, value) => setFieldValue("approximateBudget", value)}
                />
                {errors.approximateBudget && touched.approximateBudget ? (
                  <span className="text-danger error-msg">{errors?.approximateBudget}</span>
                ) : null}
              </div>

              {/* ACTIONS */}
              <div className="tw-w-full tw-flex tw-justify-center">
                <Button size="2xl" variant="primary" type="submit">
                  GO TO INVOICE CREATION
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      )}
    </div>
  );
};

NewInvoiceCreation.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
export default NewInvoiceCreation;
