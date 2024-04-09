import Layout from "@components/layouts/Layout";
import { type NextPageWithLayout } from "@pages/_app";

import { type ReactElement, useEffect, useMemo, useState } from "react";
import MainTitle from "@components/Title/MainTitle";

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { api } from "@utils/api";
import { useRouter } from "next/router";
import ShimmerAddEvent from "@components/Shimmer/ShimmerAddEvent";
import Link from "next/link";
import { toast } from "react-toastify";
import { Copy, Loader, Plus } from "react-feather";
import { FieldArray, Form, Formik } from "formik";
import { toFormikValidationSchema } from "zod-formik-adapter";
import FormInput from "@components/inputs/FormInput";
import FormDateInput from "@components/inputs/FormDate";
import FormSelect from "@components/inputs/FormSelect";
import { getStateQuery } from "@server/api/queries";
import type { LineItem, SelectNumericOption, SelectOption } from "@types";
import Button from "@components/Button";
import EventLineItem from "@components/EventItems/EventLineItem";
import EventLineItemHeader from "@components/EventItems/EventLineItemHeader";
import { useListAddOns } from "~/queries/addOns/list";
import { packageOptions } from "@constants/packages";
import { formatPrice } from "@utils/Utils";
import { PACKAGE_ID_360, PACKAGE_ID_ARRAY, PACKAGE_ID_HALO } from "@constants/packages";
import DebouncedFormInput from "@components/inputs/DebouncedFormInput";
import { useListMarkets } from "~/queries/market/list";
import { createInvoiceFormSchema } from "@schemas";
import { getMarketNameFromCityAndState } from "@server/services/markets";
import { event_payment_plan } from "@prisma/client";
import { getPricesForEventLineItems } from "@utils/price";

dayjs.extend(utc);

const UNITIALIZED_LINE_OPTION = {
  id: -1,
  type: "add-on" as const,
  name: "Not selected",
  description: "Not selected",
  quantity: 1,
  retailPriceInCents: 0,
  lineAmountInCents: 0,
};

const NewInvoiceCreation: NextPageWithLayout = () => {
  const router = useRouter();
  const inProcessEventId = router.query.id;
  const createInvoiceMutation = api.invoiceRouter.createInvoice.useMutation();

  const [isLoading, setIsLoading] = useState(false);
  const [linkToCheckout, setLinkToCheckout] = useState<string>();
  const [lineItemOptions, setLineItemOptions] = useState<LineItem[]>([]);
  const [infoForPrice, setInfoForPrice] = useState({
    eventDate: "",
    city: "",
    stateName: "",
    budget: 0,
    marketName: undefined as string | undefined,
    reloadPrices: false,
  });

  const requestInfo = { sortField: "name" as const, sortOrder: "asc" as const };
  const { isLoading: isLoadingStates, data: states } = getStateQuery(requestInfo);
  const stateOptions: SelectNumericOption[] | undefined = useMemo(
    () =>
      states?.map((state) => ({
        value: state.id,
        label: state.name,
      })),
    [states],
  );

  const { addOnsList, isLoading: isLoadingAddOns } = useListAddOns();
  const { isLoading: isLoadingMarkets, marketsList } = useListMarkets();
  const marketOptions: SelectOption[] | undefined = useMemo(
    () =>
      marketsList?.map((market) => ({
        value: getMarketNameFromCityAndState(market.fields.Name, market.fields.State),
        label: getMarketNameFromCityAndState(market.fields.Name, market.fields.State),
      })),
    [marketsList],
  );
  const {
    data: result,
    error,
    isFetching: isLoadingEvent,
  } = api.eventRouter.getInProcessEvent.useQuery({
    id: typeof inProcessEventId === "string" ? inProcessEventId : undefined,
  });
  const { data: packagePrices, isFetching: isLoadingPrices } =
    api.priceRouter.getPricesForEventInfo.useQuery(infoForPrice, {
      enabled:
        !!infoForPrice.eventDate &&
        !!infoForPrice.city &&
        !!infoForPrice.stateName &&
        infoForPrice.reloadPrices,
      onSuccess: () => setInfoForPrice({ ...infoForPrice, reloadPrices: false }),
      onError: () => setInfoForPrice({ ...infoForPrice, reloadPrices: false }),
    });

  const [currentPackagePrices, setCurrentPackagePrices] = useState<typeof packagePrices>();

  useEffect(
    () =>
      setLineItemOptions(
        packageOptions.length || addOnsList?.length
          ? [
              ...packageOptions.map((packageOption) => ({
                id: packageOption.optValue,
                type: "package" as const,
                name: packageOption.title,
                description: packageOption.subtitle,
                quantity: 1,
                retailPriceInCents: 0,
                lineAmountInCents: 0,
              })),
              ...(addOnsList ?? []).map((addOn) => ({
                id: addOn.id,
                type: "add-on" as const,
                name: addOn.name,
                description: addOn.description,
                quantity: 1,
                retailPriceInCents: addOn.priceInCents,
                lineAmountInCents: addOn.priceInCents,
              })),
            ]
          : [{ ...UNITIALIZED_LINE_OPTION }],
      ),
    [addOnsList],
  );

  if (isLoadingEvent || !inProcessEventId) return <ShimmerAddEvent />;

  if (typeof inProcessEventId !== "string" || !!error || !result?.success || !result.event) {
    toast.error("Error getting lead data, you can create a new one to generate an invoice.");

    void router.push("/admin/new-invoice-creation");
    return;
  }

  const inProcessEvent = result.event;

  const initialPackage = lineItemOptions.find(
    (item) => item.id === inProcessEvent.packageId && item.type === "package",
  );

  const eventLineItems: LineItem[] = [
    ...(initialPackage ? [{ ...initialPackage }] : []),
    ...(inProcessEvent.event?.addOns?.map((addOn) => ({
      id: addOn.addOnId,
      type: "add-on" as const,
      name: addOn.addOn.name,
      description: addOn.description,
      quantity: addOn.quantity,
      retailPriceInCents: addOn.unitPriceInCents,
      lineAmountInCents: addOn.unitPriceInCents * addOn.quantity,
    })) ?? []),
  ];

  const initialFormValues = {
    firstName: inProcessEvent.firstName ?? "",
    lastName: inProcessEvent.lastName ?? "",
    email: inProcessEvent.email ?? "",
    city: inProcessEvent.city ?? "",
    stateId: inProcessEvent.stateId ?? 0,
    invoiceDate: dayjs.utc().format("YYYY-MM-DD"),
    dueDate: inProcessEvent?.eventDate
      ? dayjs
          .utc(inProcessEvent?.eventDate)
          .subtract(30, "days")
          .format("YYYY-MM-DD")
      : "",
    eventDate: inProcessEvent?.eventDate
      ? dayjs.utc(inProcessEvent?.eventDate).format("YYYY-MM-DD")
      : "",
    phoneNumber: inProcessEvent.phoneNumber ?? "0",
    approximateBudget: inProcessEvent.approximateBudget ?? 0,
    basePrice: (inProcessEvent.totalPriceForFullInCents ?? 0) / 100,
    paymentPlan: inProcessEvent.paymentPlan ?? event_payment_plan.full,
    inProcessEventId,
    travelAdjustment: (inProcessEvent.travelFeeInCents ?? 0) / 100,
    expeditedEventAdjustment: 0,
    marketName: inProcessEvent.marketName ?? "",
    eventLineItems,
  };

  const submitHandler = async (values: typeof initialFormValues) => {
    setIsLoading(true);

    await createInvoiceMutation.mutateAsync(
      { ...values, inProcessEventId },
      {
        onSuccess: (result) => {
          setIsLoading(false);

          if (result.success && result.linkToCheckout) {
            setLinkToCheckout(result.linkToCheckout);
            return;
          }

          toast.error("Error creating corporate event, please try again later");
        },
        onError: () => {
          setIsLoading(false);
          toast.error("Error saving event, please try again later");
        },
      },
    );
  };

  return isLoading || isLoadingStates || isLoadingMarkets || isLoadingAddOns ? (
    <ShimmerAddEvent />
  ) : (
    <div className="tw-bg-white tw-p-4 tw-rounded-sm">
      {linkToCheckout ? (
        <div className="tw-mt-4 tw-p-4 tw-text-3xl tw-text-center">
          Great! You have created the invoice event, please send the following link to the customer
          in order to make the payment.
          <br />
          <br />
          <div className="tw-flex tw-justify-center tw-items-center tw-gap-2">
            <Link href={linkToCheckout}>{linkToCheckout}</Link>
            <button
              type="button"
              onClick={async () => {
                await navigator.clipboard.writeText(linkToCheckout);
                toast.success("Link copied to clipboard");
              }}
              title="Copy link to clipboard"
            >
              <Copy />
            </button>
          </div>
        </div>
      ) : (
        <Formik
          initialValues={initialFormValues}
          validationSchema={toFormikValidationSchema(createInvoiceFormSchema)}
          validateOnBlur
          validateOnChange
          onSubmit={submitHandler}
        >
          {({ errors, setFieldValue, touched, values }) => {
            const {
              travelFeeInCents,
              subtotalAmountInCents,
              stripeFeeForPartialInCents: convenienceFeeInCents,
              totalPriceForPartialInCents: totalInCents,
            } = getPricesForEventLineItems(values.eventLineItems);

            if (
              !infoForPrice.reloadPrices &&
              (infoForPrice.city !== values.city ||
                infoForPrice.eventDate !== values.eventDate ||
                infoForPrice.stateName !==
                  stateOptions?.find((state) => state.value === values.stateId)?.label)
            ) {
              setInfoForPrice({
                budget: 0,
                city: values.city,
                eventDate: values.eventDate,
                stateName:
                  stateOptions?.find((state) => state.value === values.stateId)?.label ?? "",
                marketName: undefined,
                reloadPrices: true,
              });
            }

            if (
              packagePrices?.success &&
              packagePrices.arrayPrice &&
              packagePrices.haloPrice &&
              packagePrices.threeSixtyPrice &&
              (packagePrices.arrayPrice.marketName !==
                currentPackagePrices?.arrayPrice?.marketName ||
                packagePrices.arrayPrice.retailPriceInCents !==
                  currentPackagePrices?.arrayPrice?.retailPriceInCents ||
                packagePrices.haloPrice.retailPriceInCents !==
                  currentPackagePrices?.haloPrice?.retailPriceInCents ||
                packagePrices.threeSixtyPrice.retailPriceInCents !==
                  currentPackagePrices?.threeSixtyPrice?.retailPriceInCents)
            ) {
              setCurrentPackagePrices(packagePrices);

              if (packagePrices.arrayPrice.marketName !== values.marketName) {
                void setFieldValue("marketName", packagePrices.arrayPrice.marketName);
              }

              values.eventLineItems.forEach((lineItem) => {
                if (lineItem.type === "package") {
                  switch (lineItem.id) {
                    case PACKAGE_ID_HALO:
                      lineItem.retailPriceInCents = packagePrices?.haloPrice.subtotalInCents ?? 0;
                      lineItem.lineAmountInCents = lineItem.retailPriceInCents * lineItem.quantity;
                      break;
                    case PACKAGE_ID_360:
                      lineItem.retailPriceInCents =
                        packagePrices?.threeSixtyPrice.subtotalInCents ?? 0;
                      lineItem.lineAmountInCents = lineItem.retailPriceInCents * lineItem.quantity;
                      break;
                    case PACKAGE_ID_ARRAY:
                      lineItem.retailPriceInCents = packagePrices?.arrayPrice.subtotalInCents ?? 0;
                      lineItem.lineAmountInCents = lineItem.retailPriceInCents * lineItem.quantity;
                      break;
                  }
                }
                return lineItem;
              });

              const newLineItemOptions = lineItemOptions.map((lineItem) => {
                if (lineItem.type === "package") {
                  switch (lineItem.id) {
                    case PACKAGE_ID_HALO:
                      lineItem.retailPriceInCents = packagePrices?.haloPrice.subtotalInCents ?? 0;
                      lineItem.lineAmountInCents = lineItem.retailPriceInCents * lineItem.quantity;
                      break;
                    case PACKAGE_ID_360:
                      lineItem.retailPriceInCents =
                        packagePrices?.threeSixtyPrice.subtotalInCents ?? 0;
                      lineItem.lineAmountInCents = lineItem.retailPriceInCents * lineItem.quantity;
                      break;
                    case PACKAGE_ID_ARRAY:
                      lineItem.retailPriceInCents = packagePrices?.arrayPrice.subtotalInCents ?? 0;
                      lineItem.lineAmountInCents = lineItem.retailPriceInCents * lineItem.quantity;
                      break;
                  }
                }
                return lineItem;
              });

              setLineItemOptions(newLineItemOptions);
            }

            return (
              <Form className="tw-flex tw-flex-col tw-gap-10">
                <div className="tw-flex">
                  <div className="tw-flex-col tw-w-full">
                    <MainTitle text="Create Event Invoice" />
                    {/* NAMES */}
                    <div className="tw-flex sm:tw-flex-row tw-flex-col tw-gap-10    sm:tw-gap-4">
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
                  </div>
                  <div className="tw-flex tw-gap-1 tw-justify-end">
                    <label className="tw-text-black tw-font-bold tw-mb-2" htmlFor="city">
                      Balance Due
                    </label>
                    <div className="tw-w-full">$ {formatPrice(totalInCents / 100)}</div>
                  </div>
                </div>

                {/* CONTACT */}
                <div className="tw-flex sm:tw-flex-row tw-flex-col tw-gap-10    sm:tw-gap-4">
                  <div className="tw-w-full">
                    <FormInput
                      label="Email"
                      name="email"
                      error={errors.email}
                      isTouched={!!touched.email}
                      placeholder="Insert email"
                      enabled={false}
                    />
                  </div>
                  <div className="tw-w-full">
                    <FormInput
                      label="Mobile Phone*"
                      name="phoneNumber"
                      error={errors.phoneNumber}
                      isTouched={!!touched.phoneNumber}
                      placeholder="Insert number"
                    />
                  </div>
                </div>

                {/* PAYMENT DATES */}
                <div className="tw-flex sm:tw-flex-row tw-flex-col tw-gap-10    sm:tw-gap-4">
                  <div className="tw-w-full">
                    <FormDateInput
                      label="Invoice Date*"
                      name="invoiceDate"
                      error={errors.invoiceDate}
                      isTouched={!!touched.invoiceDate}
                      placeholder="Select invoice date"
                      defaultValue={values.invoiceDate}
                      onChange={(invoiceDate) =>
                        setFieldValue(
                          "invoiceDate",
                          invoiceDate?.[0]
                            ? dayjs.utc(invoiceDate?.[0].toUTCString())?.format("YYYY-MM-DD")
                            : "",
                        )
                      }
                    />
                  </div>
                  <div className="tw-w-full">
                    <FormDateInput
                      label="Due Date*"
                      name="dueDate"
                      error={errors.dueDate}
                      isTouched={!!touched.dueDate}
                      placeholder="Select due date"
                      defaultValue={values.dueDate}
                      onChange={(dueDate) =>
                        setFieldValue(
                          "dueDate",
                          dueDate?.[0]
                            ? dayjs.utc(dueDate?.[0].toUTCString())?.format("YYYY-MM-DD")
                            : "",
                        )
                      }
                    />
                  </div>
                </div>

                {/* TODO: WHEN ALLOWING MULTIPLE EVENTS FOR THE SAME INVOICE, WE CAN GENERATE AN <InvoiceEvent /> COMPONENT FOR THE FOLLOWING TITLE AND FIELDS UNTIL "ACTIONS" */}
                <MainTitle text="Event Details" />

                {/* EVENT LOCATION */}
                <div className="tw-flex-col tw-w-full">
                  <div className="tw-flex">
                    <label className="tw-text-black tw-font-bold tw-mb-2" htmlFor="city">
                      Location?*
                    </label>
                  </div>
                  <div className="tw-flex tw-gap-4">
                    <div className="tw-w-full">
                      <DebouncedFormInput
                        name="city"
                        error={errors.city}
                        isTouched={!!touched.city}
                        placeholder="Insert city"
                        secondLabel="City"
                        text={values.city}
                        onDebounce={(text: string) => setFieldValue("city", text)}
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

                {/* MARKET AND EVENT DATE */}
                <div className="tw-flex sm:tw-flex-row tw-flex-col tw-gap-10    sm:tw-gap-4">
                  <div className="tw-w-full">
                    <FormSelect
                      label="Market*"
                      name="marketName"
                      error={errors.marketName}
                      isTouched={!!touched.marketName}
                      placeholder="Select market"
                      onChange={(v) => {
                        if (typeof v === "string" && v !== values.marketName) {
                          void setFieldValue("marketName", v ?? "");
                          setInfoForPrice({
                            ...infoForPrice,
                            marketName: v,
                            reloadPrices: true,
                          });
                        }
                      }}
                      options={marketOptions}
                    />
                  </div>
                  <div className="tw-w-full">
                    <FormDateInput
                      label="Event Date*"
                      name="eventDate"
                      error={errors.eventDate}
                      isTouched={!!touched.eventDate}
                      placeholder="Select event date"
                      defaultValue={
                        inProcessEvent?.eventDate
                          ? dayjs.utc(inProcessEvent?.eventDate).format("YYYY-MM-DD")
                          : ""
                      }
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
                </div>

                {isLoadingPrices ? (
                  <Loader className="tw-m-auto tw-animate-spin-slow" />
                ) : (
                  <>
                    {/* EVENT LINE ITEMS */}
                    <div className="tw-flex-col tw-gap-0">
                      <EventLineItemHeader />
                      <FieldArray
                        name="eventLineItems"
                        render={(arrayHelpers) => (
                          <div className="tw-flex tw-flex-col tw-w-full">
                            {values.eventLineItems.map((eventLineItem, index) => (
                              <EventLineItem
                                lineItem={eventLineItem}
                                lineItemOptions={lineItemOptions}
                                key={`${index}-${eventLineItem.id}`}
                                setLineItem={(newLineItem, index) =>
                                  setFieldValue(
                                    "eventLineItems",
                                    values.eventLineItems.map((item, innerIndex) =>
                                      innerIndex === index ? newLineItem : item,
                                    ),
                                  )
                                }
                                index={index}
                                name={`eventLineItems[${index}]`}
                                onRemove={
                                  index !== 0 ? () => arrayHelpers.remove(index) : undefined
                                }
                              />
                            ))}

                            <div className="tw-w-full tw-flex tw-justify-center tw-mt-1">
                              <button
                                type="button"
                                onClick={() => arrayHelpers.push({ ...UNITIALIZED_LINE_OPTION })}
                              >
                                <Plus />
                              </button>
                            </div>
                          </div>
                        )}
                      />
                      <div className="tw-flex tw-gap-4 tw-justify-end">
                        <label className="tw-text-black tw-font-bold tw-mb-2">Event Subtotal</label>
                        <div>$ {formatPrice(subtotalAmountInCents / 100)}</div>
                      </div>
                    </div>

                    {/* INVOICE PRICES */}
                    <div className="tw-flex-col tw-w-full">
                      <div className="tw-flex tw-gap-4 tw-justify-end">
                        <label className="tw-text-black tw-font-bold tw-mb-2">Travel Fee</label>
                        <div>$ {formatPrice(travelFeeInCents / 100)}</div>
                      </div>

                      <div className="tw-flex tw-gap-4 tw-justify-end">
                        <label className="tw-text-black tw-font-bold tw-mb-2">
                          Convenience Fee
                        </label>
                        <div>$ {formatPrice(convenienceFeeInCents / 100)}</div>
                      </div>

                      <div className="tw-flex tw-gap-4 tw-justify-end">
                        <label className="tw-text-black tw-font-bold tw-mb-2">Total</label>
                        <div>$ {formatPrice(totalInCents / 100)}</div>
                      </div>
                    </div>
                  </>
                )}

                {/* ACTIONS */}
                <div className="tw-w-full tw-flex tw-justify-center">
                  <Button size="2xl" variant="primary" type="submit">
                    GENERATE LINK
                  </Button>
                </div>
              </Form>
            );
          }}
        </Formik>
      )}
    </div>
  );
};

NewInvoiceCreation.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
export default NewInvoiceCreation;
