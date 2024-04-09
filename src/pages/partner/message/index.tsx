import DataTable, { type TableColumn } from "react-data-table-component";
import { ChevronDown, MessageSquare } from "react-feather";
import Select from "react-select";
import { Card, CardBody, CardHeader, CardTitle, Col, Row } from "reactstrap";

import Avatar from "@components/avatar";
import Link from "next/link";

import { Helmet } from "react-helmet";
import { type ReactElement } from "react";
import Layout from "@components/layouts/Layout";
import type { NextPageWithLayout } from "@pages/_app";
import { type EventFromPhp } from "@types";

type RowType = Pick<EventFromPhp, "first_name" | "last_name" | "email" | "event_date"> & {
  id: string;
  phone: string;
  package_type?: string;
  event_assign_to?: string;
};
const columns: TableColumn<RowType>[] = [
  {
    name: "Event ID",
    selector: (row) => row.id,
    width: "150px",
    sortable: true,
    cell: (row) => <span className="sy-tx-primary f-900">{row.id}</span>,
  },
  {
    name: "Customer Name",
    selector: (row) => row.first_name + row.last_name,
    width: "250px",
    sortable: true,
    cell: (row) => (
      <Link
        href={
          {
            // pathname: `/event/add-event/${row.id}`
          }
        }
        className="link-color"
      >
        {" "}
        <div className="d-flex align-items-center">
          <Avatar
            className="me-1 intial-content"
            content={
              `${FirstUpperCase(row?.first_name)}` + " " + `${FirstUpperCase(row?.last_name)}`
            }
            imgHeight={42}
            imgWidth={42}
            showOnlyInitials
          />

          <div className="user-info text-truncate ms-1">
            <span className="d-block fw-bold text-truncate">
              {row.first_name} {row.last_name}
              {/* {FirstUpperCase(row.email)} */}
            </span>
            <small className="post-name single-line-elipsis">{row.email}</small>
          </div>
        </div>
      </Link>
    ),
  },
  {
    name: "Event Date",
    selector: (row) => row.event_date,
    width: "200px",
    cell: (row) => <span className="sy-tx-modal2 f-400">{row.event_date}</span>,
  },
  {
    name: "Package Type",
    selector: (row) => row.package_type ?? "Not defined",
    width: "200px",
    cell: (row) => <span className="sy-tx-modal2 f-400">{row.package_type}</span>,
  },
  {
    name: "Phone no",
    width: "200px",
    selector: (row) => row.phone,
    cell: (row) => <span className="sy-tx-modal2 f-400 single-line-elipsis">{row.phone}</span>,
  },
  {
    name: "Event Assign to",
    selector: (row) => row.event_assign_to ?? "Not defined",
    width: "200px",
    cell: (row) => <span className="sy-tx-modal2 f-600">{row.event_assign_to}</span>,
  },
  {
    name: "ACTIONS",
    // width: "200px",
    sortable: true,
    cell: (row) => (
      <span className="sy-tx-modal2 message">
        <Link href={`/partner/message/message-detail/${row.id}`}>
          <MessageSquare size={16} className="sy-tx-white" />
        </Link>
      </span>
    ),
  },
];
const data = [
  {
    id: "91716",
    first_name: "Sweden",
    last_name: "Robertson",
    email: "dugoko@tiljez.io",
    event_date: "09 Feb 2020",
    package_type: "Lorem Ipsum is simply",
    phone: "+1 98765 43210",
    event_assign_to: "Martha Barnes",
    action: "",
  },
  {
    id: "91716",
    first_name: "Sweden",
    last_name: "Robertson",
    email: "dugoko@tiljez.io",
    event_date: "09 Feb 2020",
    package_type: "Lorem Ipsum is simply",
    phone: "+1 98765 43210",
    event_assign_to: "Martha Barnes",
    action: "",
  },
  {
    id: "91716",
    first_name: "Sweden",
    last_name: "Robertson",
    email: "dugoko@tiljez.io",
    event_date: "09 Feb 2020",
    package_type: "Lorem Ipsum is simply",
    phone: "+1 98765 43210",
    event_assign_to: "Martha Barnes",
    action: "",
  },
  {
    id: "91716",
    first_name: "Sweden",
    last_name: "Robertson",
    email: "dugoko@tiljez.io",
    event_date: "09 Feb 2020",
    package_type: "Lorem Ipsum is simply",
    phone: "+1 98765 43210",
    event_assign_to: "Martha Barnes",
    action: "",
  },
  {
    id: "91716",
    first_name: "Sweden",
    last_name: "Robertson",
    email: "dugoko@tiljez.io",
    event_date: "09 Feb 2020",
    package_type: "Lorem Ipsum is simply",
    phone: "+1 98765 43210",
    event_assign_to: "Martha Barnes",
    action: "",
  },
  {
    id: "91716",
    first_name: "Sweden",
    last_name: "Robertson",
    email: "dugoko@tiljez.io",
    event_date: "09 Feb 2020",
    package_type: "Lorem Ipsum is simply",
    phone: "+1 98765 43210",
    event_assign_to: "Martha Barnes",
    action: "",
  },
  {
    id: "91716",
    first_name: "Sweden",
    last_name: "Robertson",
    email: "dugoko@tiljez.io",
    event_date: "09 Feb 2020",
    package_type: "Lorem Ipsum is simply",
    phone: "+1 98765 43210",
    event_assign_to: "Martha Barnes",
    action: "",
  },
  {
    id: "91716",
    first_name: "Sweden",
    last_name: "Robertson",
    email: "dugoko@tiljez.io",
    event_date: "09 Feb 2020",
    package_type: "Lorem Ipsum is simply",
    phone: "+1 98765 43210",
    event_assign_to: "Martha Barnes",
    action: "",
  },
  {
    id: "91716",
    first_name: "Sweden",
    last_name: "Robertson",
    email: "dugoko@tiljez.io",
    event_date: "09 Feb 2020",
    package_type: "Lorem Ipsum is simply",
    phone: "+1 98765 43210",
    event_assign_to: "Martha Barnes",
    action: "",
  },
];

const Message: NextPageWithLayout = () => {
  return (
    <>
      <div className="main-role-ui">
        <Helmet>
          <title>Hipstr - Message</title>
        </Helmet>
        <h2 className="mb-2">Message</h2>

        <Card className="bg-white">
          <CardHeader className="p-0 mx-1 mt-2 mb-1 filter-section">
            <CardTitle>Today’s Events</CardTitle>
          </CardHeader>

          <CardBody className="p-0">
            <div className="react-dataTable">
              <DataTable
                selectableRows
                columns={columns}
                className="react-dataTable"
                sortIcon={<ChevronDown size={10} />}
                data={data}
                highlightOnHover
              />
            </div>

            <Row className="align-items-center mx-25">
              <Col sm="6">
                <div className="d-flex align-items-center pagination-role">
                  <label htmlFor="rows-per-page">Show 1 To </label>
                  <Select
                    id="rows-per-page"
                    className="react-select mx-1"
                    classNamePrefix="select"
                    // defaultValue={perPageOptions[0]}
                    // options={perPageOptions}
                    // onChange={(e) => perPageHandler(e, setPerPage, setPage)}
                    isSearchable={false}
                  />
                  <label htmlFor="rows-per-page"> Per Page</label>
                </div>
              </Col>
              {/* <Col sm="6" className="pagination-role-n mt-1 d-flex justify-content-end">
                <ReactPaginate
                  nextLabel=""
                  //   onPageChange={(e) => setPage(e.selected + 1)}
                  // pageCount={totalPage || 1}
                  breakLabel="..."
                  previousLabel=""
                  pageRangeDisplayed={2}
                  marginPagesDisplayed={1}
                  activeClassName="active"
                  pageClassName="page-item"
                  breakClassName="page-item"
                  nextLinkClassName="page-link"
                  pageLinkClassName="page-link"
                  nextClassName="page-item next"
                  breakLinkClassName="page-link"
                  previousLinkClassName="page-link"
                  previousClassName="page-item prev"
                  containerClassName="pagination react-paginate"
                />
              </Col> */}
            </Row>
          </CardBody>
        </Card>
      </div>
    </>
  );
};

Message.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
export default Message;
