import { type ReactElement, useMemo, useState } from "react";
import Layout from "@components/layouts/Layout";
import { type NextPageWithLayout } from "@pages/_app";
import { api } from "@utils/api";
import { ShimmerTable } from "react-shimmer-effects";
import { Helmet } from "react-helmet";
import BreadCrumbs from "@components/breadcrumbs";
import InvoicesTable from "@components/InvoicesTable";
import makeAnimated from "react-select/animated";
import Select, { type ActionMeta } from "react-select";
import { type SelectOption } from "@types";
import { useListMarkets } from "~/queries/market/list";
import { getMarketNameFromCityAndState } from "@server/services/markets";
import { DatePickerWithRange, type DateRange } from "@components/DatePickerWithRange";
import { decryptData } from "@utils/Utils";
import { BEARER_TOKEN } from "@constants/CommonConstants";

import ClearableDebouncedInput from "@components/inputs/ClearableDebouncedInput";

const ALL_INVOICES = "all";
const PAID_INVOICES = "paid";
const UNPAID_INVOICES = "unpaid";

type TabsTypes = "all" | "paid" | "unpaid";

const activeStyles = "tw-border-b-2 tw-border-primary tw-text-primary";
const tabStyles = "tw-cursor-pointer tw-font-medium tw-px-4 tw-py-2 tw-capitalize";

const InvoiceHistory: NextPageWithLayout = () => {
  const { isLoading: isLoadingMarkets, marketsList } = useListMarkets();

  const marketOptions: SelectOption[] | undefined = useMemo(
    () =>
      marketsList?.map((market) => ({
        value: getMarketNameFromCityAndState(market.fields.Name, market.fields.State),
        label: getMarketNameFromCityAndState(market.fields.Name, market.fields.State),
      })),
    [marketsList],
  );

  const [activeTab, setActiveTab] = useState(ALL_INVOICES);
  const [invoicesListQueryInfo, setInvoicesListQueryInfo] = useState<{
    tab: TabsTypes;
    enabled: boolean;
    page: number;
    pageSize: number;
    filter?: string;
    market?: string;
    dateRange?: DateRange;
  }>({
    tab: ALL_INVOICES,
    enabled: false,
    page: 1,
    pageSize: 10,
    filter: undefined,
    market: undefined,
    dateRange: undefined,
  });

  const { data: invoicesResult, isLoading: isLoadingInvoices } =
    api.invoiceRouter.all.useQuery(invoicesListQueryInfo);

  const selectTab = (selected: TabsTypes) => {
    setActiveTab(selected);
    setInvoicesListQueryInfo({
      ...invoicesListQueryInfo,
      tab: selected,
    });
  };

  const token = decryptData(localStorage.getItem(BEARER_TOKEN) ?? "");

  const url = `/api/utils/export-invoices-to-csv`;
  const params = new URLSearchParams();
  params.append("filter", invoicesListQueryInfo.filter ?? "");
  params.append("tab", invoicesListQueryInfo.tab ?? "");
  params.append("market", invoicesListQueryInfo.market ?? "");
  params.set("dateRangeFrom", invoicesListQueryInfo.dateRange?.from?.toString() ?? "");
  params.set("dateRangeTo", invoicesListQueryInfo.dateRange?.to?.toString() ?? "");
  params.set("token", token);
  const href = `${url}?${params.toString()}`;

  return (
    <div>
      <Helmet>
        <title>Invoices</title>
      </Helmet>

      <div>
        <BreadCrumbs title="Invoices" data={[{ title: "Invoices List" }]} />
      </div>

      <div className="tw-flex md:tw-flex-row tw-flex-col tw-mb-3.5 tw-items-center tw-gap-3">
        <p className="tw-font-bold tw-m-0">Filter</p>

        <ClearableDebouncedInput
          placeholder="Search"
          text={invoicesListQueryInfo.filter}
          inputClassName="input-group form-control focus:tw-bg-white"
          containerClassName="tw-w-full md:tw-w-1/3"
          onDebounce={(filter: string) => {
            setInvoicesListQueryInfo({
              ...invoicesListQueryInfo,
              enabled: true,
              page: 1,
              filter,
            });
          }}
        />

        <Select
          isClearable={true}
          closeMenuOnSelect={true}
          components={makeAnimated()}
          placeholder="Select Market"
          className="focus:tw-border-primary tw-w-full md:tw-w-1/3"
          id="market"
          classNamePrefix="Select Market"
          styles={{
            control: (base, state) => ({
              ...base,
              // boxShadow will be removed when focused
              boxShadow: state.isFocused ? "none" : "all",
            }),
          }}
          options={marketOptions}
          onChange={(e: unknown, _actionMeta: ActionMeta<unknown>) => {
            if (e instanceof Array) {
              return;
            }

            if (e instanceof Object && "value" in e) {
              if (typeof e?.value === "string" && e?.value !== invoicesListQueryInfo.market) {
                setInvoicesListQueryInfo({
                  ...invoicesListQueryInfo,
                  market: e.value,
                });
              } else {
                setInvoicesListQueryInfo({
                  ...invoicesListQueryInfo,
                  market: undefined,
                });
              }
            }
          }}
          isSearchable={true}
        />

        <DatePickerWithRange
          setDate={(date) =>
            setInvoicesListQueryInfo({
              ...invoicesListQueryInfo,
              dateRange: date,
            })
          }
          placeholder="Select date range"
          isClearable={true}
          className="tw-w-full md:tw-w-1/3 tw-bg-white focus:tw-bg-white focus:tw-border-primary"
        />
      </div>

      <div className="tw-flex tw-items-center tw-flex-row tw-justify-between">
        <div className="tw-flex tw-flex-row tw-mb-3.5">
          <div
            className={`${
              activeTab === ALL_INVOICES ? activeStyles : "tw-text-[#6e6b7b]"
            } ${tabStyles} `}
            onClick={() => selectTab(ALL_INVOICES)}
          >
            {ALL_INVOICES}
          </div>
          <div
            className={`${
              activeTab === PAID_INVOICES ? activeStyles : "tw-text-[#6e6b7b]"
            } ${tabStyles}`}
            onClick={() => selectTab(PAID_INVOICES)}
          >
            {PAID_INVOICES}
          </div>
          <div
            className={`${
              activeTab === UNPAID_INVOICES ? activeStyles : "tw-text-[#6e6b7b]"
            } ${tabStyles}`}
            onClick={() => selectTab(UNPAID_INVOICES)}
          >
            {UNPAID_INVOICES}
          </div>
        </div>
        <a
          type="button"
          className="custom-btn3 tw-uppercase tw-ml-auto tw-mr-2"
          href={`${href}`}
          download
        >
          Export CSV
        </a>
      </div>

      {isLoadingInvoices || isLoadingMarkets || !invoicesResult?.invoices ? (
        <ShimmerTable />
      ) : (
        <InvoicesTable
          invoices={invoicesResult.invoices}
          pageSize={invoicesListQueryInfo.pageSize}
          setPageSize={(pageSize: number) =>
            setInvoicesListQueryInfo({
              ...invoicesListQueryInfo,
              enabled: true,
              page: 1,
              pageSize,
            })
          }
          page={invoicesListQueryInfo.page}
          setPage={(page: number) =>
            setInvoicesListQueryInfo({ ...invoicesListQueryInfo, enabled: true, page })
          }
          totalInvoices={invoicesResult?.total ?? 0}
          applyFilter={(filter?: string) => {
            setInvoicesListQueryInfo({
              ...invoicesListQueryInfo,
              enabled: true,
              page: 1,
              filter,
            });
          }}
          filter={invoicesListQueryInfo.filter}
        />
      )}
    </div>
  );
};

InvoiceHistory.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default InvoiceHistory;
