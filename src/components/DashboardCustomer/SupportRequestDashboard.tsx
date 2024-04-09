import React from "react";
import DataTable, { type TableColumn } from "react-data-table-component";
import { Badge, Button, Card, CardBody, CardTitle } from "reactstrap";
import { FirstUpperCase } from "@utils/Utils";
import { FileText } from "react-feather";

import Avatar from "@components/avatar";
import Link from "next/link";
import dayjs from "dayjs";
import { type TicketWithEventAndUser } from "@server/api/routers/customer/events";
import { userImageUrl } from "@utils/userImageUrl";

const status = [
  { title: "Open", color: "light-success" },
  { title: "In progress", color: "light-warning" },
  { title: "Closed", color: "light-danger" },
];

const SupportRequestDashboard = ({ tickets }: { tickets: TicketWithEventAndUser[] }) => {
  const columns: TableColumn<TicketWithEventAndUser>[] = [
    {
      name: "Request ID",
      selector: (row) => row?.id,
      sortable: false,
      width: "120px",
      cell: (row) => (
        <Link href={`/customer/support-request-listing/request-detail/${row.id}`}>
          <span className="sy-tx-primary f-900">#{row?.ticketNumber}</span>
        </Link>
      ),
    },
    {
      name: "Name",
      selector: (row) => row?.ticketNumber,
      sortable: false,
      cell: (row) => (
        <Link
          className="link-color d-block w-100"
          href={`/customer/support-request-listing/request-detail/${row.id}`}
        >
          <div className="d-flex w-100 align-items-center">
            {row?.users?.picture !== null ? (
              <Avatar
                img={userImageUrl(row?.users?.picture)}
                className="cu-avatar"
                content={
                  `${FirstUpperCase(row?.users?.firstName)}` +
                  " " +
                  `${FirstUpperCase(row?.users?.lastName)}`
                }
                showOnlyInitials
              />
            ) : (
              <Avatar
                /*eslint-disable-next-line */
                content={
                  `${FirstUpperCase(row?.users?.firstName)}` +
                  " " +
                  `${FirstUpperCase(row?.users?.lastName)}`
                }
                showOnlyInitials
                className="cu-avatar"
              />
            )}
            <div className="text-truncate  ms-1">
              <span className="d-block f-600 sy-tx-modal">
                {FirstUpperCase(row?.users?.firstName)} {FirstUpperCase(row?.users?.lastName)}.
              </span>
              <small className="d-block text-truncate w-100 sy-tx-modal">{row?.users?.email}</small>
            </div>
          </div>
        </Link>
      ),
    },

    {
      name: "Subject",
      selector: (row) => row?.title,
      sortable: false,
      style: { cursor: "pointer" },
      cell: (row) => (
        <Link
          className="link-color d-block w-100"
          href={`/customer/support-request-listing/request-detail/${row.id}`}
        >
          <span className="text-truncate d-block">
            {row?.title}
            {/* {checkIsRead(row) && <span class="partner-name">{checkIsRead(row)}</span>} */}
          </span>
        </Link>
      ),
    },
    {
      name: "Event Date",
      style: { cursor: "pointer" },
      selector: (row) => row?.events?.id ?? "",
      cell: (row) => (
        <Link
          className="link-color"
          href={`/customer/support-request-listing/request-detail/${row.id}`}
        >
          <span>{dayjs(row?.events?.eventDate).format("DD MMM YYYY")}</span>
        </Link>
      ),
      sortable: false,
    },
    {
      name: "category",
      style: { cursor: "pointer" },
      selector: (row) => row?.ticketType,
      cell: (row) => (
        <Link
          className="link-color"
          href={`/customer/support-request-listing/request-detail/${row.id}`}
        >
          <span>{FirstUpperCase(row.ticketType)}</span>
        </Link>
      ),
      sortable: true,
    },
    {
      name: "Issued date",
      style: { cursor: "pointer" },
      selector: (row) => row?.createdAt?.toDateString() ?? "",
      cell: (row) => (
        <Link
          className="link-color"
          href={`/customer/support-request-listing/request-detail/${row.id}`}
        >
          <span>{dayjs(row.createdAt).format("DD MMM YYYY")}</span>
        </Link>
      ),
      sortable: false,
    },
    {
      name: "Status",
      style: { cursor: "pointer" },
      selector: (row) => row?.status,
      sortable: false,
      cell: (row) => {
        return (
          <>
            <Link href={`/customer/support-request-listing/request-detail/${row.id}`}>
              <div className="tw-flex tw-items-center">
                <Badge
                  color={
                    row?.status === "open" || row?.status === "close"
                      ? row?.status === "close"
                        ? status?.[2]?.color
                        : status?.[0]?.color
                      : status?.[1]?.color
                  }
                  pill
                >
                  <FileText size={15} />
                </Badge>
                <Badge
                  color={
                    row?.status === "open" || row?.status === "close"
                      ? row?.status === "close"
                        ? status?.[2]?.color
                        : status?.[0]?.color
                      : status?.[1]?.color
                  }
                  className="remove-bg-badge"
                  pill
                >
                  {FirstUpperCase(row?.status)}
                </Badge>
              </div>
            </Link>
          </>
        );
      },
    },
  ];

  return (
    <Card className="bg-white">
      <CardBody>
        <CardTitle className="sy-tx-modal font2024 f-600 mb-0">
          Support Request
          <Link href="/customer/support-request-listing/create-support-request">
            <Button className="custom-btn3 mx-sm-2"> + Create Request</Button>
          </Link>
        </CardTitle>
      </CardBody>
      <div className="react-dataTable request-dashboard-table mb-1">
        <DataTable
          responsive
          columns={columns}
          className="react-dataTable"
          data={tickets}
          noDataComponent={
            "You currently have no Open Support Requests, Click the button above to open a new Support Request"
          }
        />
      </div>
    </Card>
  );
};

export default SupportRequestDashboard;
