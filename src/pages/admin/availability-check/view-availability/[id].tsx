import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { ArrowLeft, ChevronDown } from "react-feather";
import ReactPaginate from "react-paginate";
import Select from "react-select";
import {
  Badge,
  Card,
  CardBody,
  CardHeader,
  Col,
  Input,
  Row,
  UncontrolledTooltip,
} from "reactstrap";

import Avatar from "@components/avatar";
import Breadcrumbs from "@components/breadcrumbs";

import {
  FirstUpperCase,
  onSearchHandler,
  perPageHandler,
  perPageOptions,
  setFilterDropdown,
} from "@utils/Utils";

import { checkIsRead, checkPermisson } from "@utils/platformUtils";

import OffCanvasPlacement from "@components/Common/OffCanvas";

import DescriptionModal from "@components/Modal/DescriptionModal";
import { useDispatch, useSelector } from "react-redux";
import { AvailabilityDetailAPICall } from "@redux/action/AvailabilityAction";

import { ShimmerTable } from "react-shimmer-effects";
import { type ReactElement } from "react";
import Layout from "@components/layouts/Layout";
import type { NextPageWithLayout } from "@pages/_app";
import { useRouter } from "next/router";
import Link from "next/link";

const reasonOption = [
  { value: "pending", label: "Pending" },
  { value: "available", label: "Available" },
  { value: "unavailable", label: "Unavailable" },
];

type RowType = {};
const columns: TableColumn<RowType>[] = [
  {
    name: "Partners Name",
    selector: (row) =>
      `${FirstUpperCase(row?.partner?.first_name)}  ${FirstUpperCase(row?.partner?.last_name)}`,
    minWidth: "350px",
    maxWidth: "350px",
    sortable: true,
    cell: (row) => (
      <div className="d-flex align-items-center">
        {row?.partner?.picture ? (
          <Avatar
            className=""
            img={row?.partner?.picture}
            imgHeight="32"
            imgWidth="32"
            showOnlyInitials
          />
        ) : (
          <Avatar
            className="intial-content cu-avatar"
            content={`${FirstUpperCase(row?.partner?.first_name)}  ${FirstUpperCase(
              row?.partner?.last_name,
            )}`}
            imgHeight="32"
            imgWidth="32"
            showOnlyInitials
          />
        )}
        <div className="user-info text-truncate ms-1 sy-tx-modal f-600">
          <span
            className={
              checkIsRead(row) ? "d-block fw-bold text-truncate " : "d-block fw-bold text-truncate"
            }
          >
            {`${FirstUpperCase(row?.partner?.first_name)}  ${FirstUpperCase(
              row?.partner?.last_name,
            )}`}
          </span>
          <small className="post-name single-line-elipsis">{row?.partner?.email}</small>
        </div>
      </div>
    ),
  },
  {
    name: "Status",
    className: "status",
    minWidth: "250px",
    maxWidth: "250px",
    sortable: true,
    selector: (row) => row?.status,
    sortable: true,
    cell: (row) => (
      <>
        <Badge
          pill
          color={
            (row?.status === "available" && "light-success") ||
            (row?.status === "unavailable" && "light-danger") ||
            (row?.status === "pending" && "light-warning")
          }
          className="me-1 cu-badge"
        >
          {FirstUpperCase(row?.status)}
        </Badge>
      </>
    ),
  },
  {
    name: "Reason Type",
    minWidth: "350px",
    maxWidth: "350px",
    selector: (row) => row?.reason_type,
    cell: (row) => (
      <span className="sy-tx-modal2 f-400">
        {
          /*eslint-disable-next-line */
          row?.reason_type ? (
            /*eslint-disable-next-line */
            <>
              {row?.reason_type === "unavailable_staff" && "Unavailable staff"}
              {row?.reason_type === "out_of_service_area" && "Out of service area"}
              {row?.reason_type === "unavailable_equipment" && "Unavailable equipment"}
              {row?.reason_type === "other" && "Other staff"}
            </>
          ) : (
            "--"
          )
        }
      </span>
    ),
  },
  {
    name: "Reason Description",
    minWidth: "250px",
    maxWidth: "250px",
    selector: (row) => row?.reason,

    cell: (row) => (
      <>
        {" "}
        {row?.reason ? (
          <>
            <div className="sy-tx-modal2 f-400 single-line-elipsis">{row?.reason}</div>
            <div className="sy-tx-modal2 f-400">
              <span id={`view${row?.id}`}>
                <DescriptionModal description={row?.reason} />
              </span>
              <UncontrolledTooltip placement="top" target={`view${row?.id}`}>
                Click to view full description
              </UncontrolledTooltip>
            </div>
          </>
        ) : (
          "--"
        )}
      </>
    ),
  },
];

const ViewAvailability: NextPageWithLayout = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState(null);
  const availabilityDetail = useSelector(
    (state: any) => state?.availabilityReducer?.availabilityDetail,
  );
  const availabilityDetailTotal = useSelector(
    (state) => state?.availabilityReducer?.totalAvailabilityDetail,
  );
  const [isLoading, setIsLoading] = useState(false);
  const totalPage = Math.ceil(availabilityDetailTotal / perPage);
  const permission = checkPermisson("availability-check");
  /*eslint-disable-next-line */
  const startingValue = (page - 1) * parseInt(perPage) + 1;
  const endingValue =
    startingValue + perPage - 2 >= availabilityDetailTotal
      ? ((startingValue + availabilityDetailTotal) % perPage) - 2 + startingValue
      : startingValue + perPage - 1;

  /**
   * It fetches the availability details of a particular request.
   * @param id - The id of the request
   */
  const getAvailability = async (id) => {
    setIsLoading(true);
    const data = {
      request_id: id,
      /*eslint-disable-next-line */
      page: page,
      per_page: perPage,
      status: status?.value,
      sort_field: "id",
      sort_order: "desc",
      /*eslint-disable-next-line */
      search: search,
    };
    // eslint-disable-next-line @typescript-eslint/await-thenable
    await dispatch(AvailabilityDetailAPICall(data) as unknown as AnyAction);
    setIsLoading(false);
  };
  /* This is a react hook that is called when the component is mounted. It checks if the location state
  is undefined, if it is, it redirects to the availability check page. If it is not undefined, it
  calls the getAvailability function with the location state id. */
  useEffect(() => {
    if (router.query === undefined) {
      router.replace("/admin/availability-check");
    } else if (router.query.id !== undefined) {
      getAvailability(router.query.id);
    }
  }, [search, status, page, perPage, router.query.id]);

  /**
   * It calls the getAvailability function, passing in the id of the location that was passed in as a
   * prop
   */
  const refresh = () => getAvailability(router.query.id);

  return (
    <>
      <div>
        <Row className="mb-sm-2">
          <Col lg={7}>
            <Breadcrumbs title="Availability Check" data={[{ title: "View Availability" }]} />
          </Col>
          <Col lg={5} className="text-end mb-75">
            {/* <Button className="custom-btn12">New Availability Request</Button> */}
            {permission?.add_access === 1 && <OffCanvasPlacement refresh={() => refresh()} />}
          </Col>
        </Row>
        <Card className="bg-white">
          <CardHeader className="p-0 mx-1 mt-2">
            <div className="header-search-filter">
              <div>
                <Link href="/admin/availability-check">
                  <ArrowLeft className="sy-tx-primary me-50" />
                </Link>
                <label>
                  {" "}
                  {availabilityDetailTotal !== 0 &&
                    `Showing ${startingValue} to ${endingValue} of ${availabilityDetailTotal}
                entries`}
                </label>
              </div>
              <div className="d-flex support-header mb-1">
                <Input
                  type="search"
                  isClearable={true}
                  placeholder="Search"
                  className="me-sm-1"
                  onChange={(e) => onSearchHandler(e, setSearch, setPage)}
                />
                <Select
                  isSearchable={false}
                  className="react-select w-100 status-select mx-sm-2"
                  classNamePrefix="select"
                  options={reasonOption}
                  placeholder="Select Status"
                  onChange={(e) => setFilterDropdown(setStatus, e)}
                  isClearable={true}
                />
              </div>
            </div>
          </CardHeader>
          <CardBody className="p-0">
            {!isLoading ? (
              <div className="react-dataTable">
                <DataTable
                  selectableRows
                  columns={columns}
                  className="react-dataTable"
                  sortIcon={<ChevronDown size={10} />}
                  data={availabilityDetail}
                  highlightOnHover
                />
              </div>
            ) : (
              <ShimmerTable col={4} row={10} />
            )}

            {availabilityDetailTotal !== 0 && (
              <Row className="align-items-center mx-25">
                <Col sm="6">
                  <div className="d-flex align-items-center pagination-role">
                    <label htmlFor="rows-per-page">Show 1 To </label>
                    <Select
                      id="rows-per-page"
                      className="react-select mx-1"
                      classNamePrefix="select"
                      defaultValue={perPageOptions[0]}
                      options={perPageOptions}
                      onChange={(e) => perPageHandler(e, setPerPage, setPage)}
                      isSearchable={false}
                    />
                    <label htmlFor="rows-per-page"> Per Page</label>
                  </div>
                </Col>
                <Col sm="6" className="pagination-role-n mt-1 d-flex justify-content-end">
                  <ReactPaginate
                    nextLabel=""
                    forcePage={page - 1}
                    onPageChange={(e) => setPage(e.selected + 1)}
                    pageCount={totalPage || 1}
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
                </Col>
              </Row>
            )}
          </CardBody>
        </Card>
      </div>
    </>
  );
};

ViewAvailability.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
export default ViewAvailability;
