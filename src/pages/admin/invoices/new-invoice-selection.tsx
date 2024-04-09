import Layout from "@components/layouts/Layout";
import { type NextPageWithLayout } from "@pages/_app";
import { api } from "@utils/api";
import { useRouter } from "next/router";

import { type ReactElement, useState } from "react";
import { toast } from "react-toastify";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import MainTitle from "@components/Title/MainTitle";

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import DebouncedInput from "@components/inputs/DebouncedInput";
import type { EventReduced, SelectOption } from "@types";
import { Loader } from "react-feather";
import Button from "@components/Button";
dayjs.extend(utc);

const NewInvoiceSelection: NextPageWithLayout = () => {
  const router = useRouter();
  const [inProcessEventId, setInProcessEventId] = useState<string | null>(null);
  const [email, setEmail] = useState("");

  const { data: result, isFetching: isLoadingEvents } =
    api.eventRouter.getInProcessEventsForEmail.useQuery(email, {
      enabled: email !== "",
    });

  const eventsMap = new Map<string, EventReduced>();
  result?.events?.forEach((event) => eventsMap.set(event.id, event));

  const getLabelForEventId = (eventId: string | null) => {
    if (!eventId) return "";
    const event = eventsMap.get(eventId);
    if (!event) return "";
    return `${
      event.eventDate ? dayjs.utc(event.eventDate).format("MMMM DD, YYYY") : "Without date"
    } - ${event.email} - ${event.firstName} - ${event.lastName} - ${event.id}`;
  };

  const options: SelectOption[] =
    result?.events?.map((event) => ({
      label: getLabelForEventId(event.id),
      value: event.id,
    })) ?? [];

  return (
    <div className="tw-bg-white tw-p-4 tw-rounded-sm">
      <MainTitle text="New Social Invoice" />
      <div className="tw-flex tw-gap-1 tw-flex-col">
        <div className="tw-flex tw-gap-2 tw-my-6 tw-flex-col    sm:tw-flex-row">
          <label
            className="tw-text-black tw-font-bold tw-mb-2 tw-my-auto"
            htmlFor="in-process-event-id-input"
          >
            Email
          </label>
          <DebouncedInput
            placeholder="Search leads by email"
            text={email}
            className="input-group form-control"
            onDebounce={(value: string) => setEmail(value)}
            autofocus
          />
        </div>

        <span className="tw-flex tw-mx-auto tw-mb-4">-- OR --</span>
        <div className="tw-flex tw-justify-center">
          <Button
            variant="black"
            size="2xl"
            onClick={() => router.push("/admin/invoices/new-invoice-creation")}
          >
            + NEW LEAD
          </Button>
        </div>
      </div>

      {isLoadingEvents && <Loader className="tw-m-auto tw-mt-3 tw-animate-spin-slow" />}

      {!!options.length ? (
        <>
          <div className="tw-flex tw-gap-2 tw-my-6 tw-flex-col tw-mt-4    sm:tw-flex-row sm:tw-mt-10">
            <label
              className="tw-text-black tw-font-bold tw-mb-2 tw-my-auto"
              htmlFor="in-process-event-id-input"
            >
              Choose Your Event
            </label>
            <Select
              isClearable={true}
              closeMenuOnSelect={true}
              components={makeAnimated()}
              placeholder="Select Existing Lead"
              options={options}
              isMulti={false}
              isSearchable={true}
              className="tw-w-4/5"
              value={{ value: inProcessEventId, label: getLabelForEventId(inProcessEventId) }}
              onChange={(option) => setInProcessEventId(option?.value ?? null)}
            />
          </div>
          <div className="tw-flex tw-w-full tw-justify-center">
            <Button
              variant="primary"
              size="2xl"
              onClick={() => {
                if (inProcessEventId) {
                  void router.push(`/admin/invoices/new-invoice-creation/${inProcessEventId}`);
                  return;
                }
                toast.error("Please select a lead from the dropdown.");
              }}
            >
              CONFIRM
            </Button>
          </div>
        </>
      ) : (
        email !== "" &&
        !isLoadingEvents && (
          <>
            <p className="tw-text-red-500 tw-text-center tw-mt-4">
              No leads found for this email, but you can create a new one...
            </p>
          </>
        )
      )}
    </div>
  );
};

NewInvoiceSelection.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
export default NewInvoiceSelection;
