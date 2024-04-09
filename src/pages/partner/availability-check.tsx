/*eslint-disable */
import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { ChevronDown } from "react-feather";
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

import Breadcrumbs from "@components/breadcrumbs";

import AvailabilityModal from "@components/Modal/AvaibilityModal";
import { useDispatch, useSelector } from "react-redux";
import {
  AvailabilityMyListAPICall,
  AvailabilityStatusUpdateAPICall,
} from "@redux/action/AvailabilityAction";
import { ShimmerTable } from "react-shimmer-effects";
import {
  onSearchHandler,
  perPageHandler,
  perPageOptions,
  FirstUpperCase,
  setFilterDropdown,
} from "@utils/Utils";
import moment from "moment";
import { Helmet } from "react-helmet";
import { type ReactElement } from "react";
import Layout from "@components/layouts/Layout";
import type { NextPageWithLayout } from "@pages/_app";

const statusOptions = [
  { label: "Available", value: "available" },
  { label: "Unavailable", value: "unavailable" },
  { label: "Pending", value: "pending" },
];
const availabilityOptions = [
  { label: "Select", value: "select" },
  { label: "Available", value: "available" },
  { label: "Unavailable", value: "unavailable" },
];

const AvailabilityCheck: NextPageWithLayout = () => {
  const availability = useSelector((state: any) => state.availabilityReducer.availabilityRequest);
  const totalAvailability = useSelector(
    (state) => state.availabilityReducer.totalAvailabilityRequest,
  );
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const totalPage = Math.ceil(totalAvailability / perPage);
  /*eslint-disable-next-line */
  const startingValue = (page - 1) * perPage + 1;
  const endingValue =
    startingValue + perPage - 2 >= totalAvailability
      ? ((startingValue + totalAvailability) % perPage) - 2 + startingValue
      : startingValue + perPage - 1;
  const [isUpdate, setIsUpdate] = useState(false);
  const [status, setStatus] = useState(null);
  const [showUnavailableModal, setShowUnavailableModal] = useState(false);
  const [showUnavailableId, setShowUnavailableId] = useState("false");

  const columns = (updateAvailability, refresh) => [
    {
      name: "ACTION",
      minWidth: "220px",
      maxWidth: "220px",
      selector: (row) => row?.status,
      sortable: true,

      cell: (row, i) => {
        const selectedVal = availabilityOptions.find((obj) => row.status === obj.value);

        return (
          <>
            <Select
              id="rows-per-page"
              className={`react-select mx-1 bhavin availability-select ${
                selectedVal?.value === "available" && "avail-color"
              } ${selectedVal?.value === "unavailable" && "unavail-color"} `}
              classNamePrefix="select"
              value={selectedVal}
              // value={row?.status === 'pending' ? 'available' : 'unavailable'}
              isDisabled={row?.is_assigned}
              options={availabilityOptions}
              onChange={(e) => {
                if (e.value === "unavailable") {
                  setShowUnavailableModal(true);
                  setShowUnavailableId(row?.id);
                  return;
                }
                updateAvailability(row?.id, e.value);
              }}
              isSearchable={false}
              menuPlacement={i > availability?.length - 3 ? "top" : "bottom"}
              // menuPortalTarget={document.body}
            />
          </>
        );
      },
      // <>
      //     {row?.status === 'pending' ? (
      //         <div className="d-flex">
      //             <div onClick={() => updateAvailability(row?.id)} id={`${'Available'}${row?.id}`}>
      //                 <Badge pill color="light-success" className="me-1">
      //                     Available
      //                 </Badge>
      //                 <UncontrolledTooltip target={`${'Available'}${row?.id}`}> Click here to update status </UncontrolledTooltip>
      //             </div>
      //             <div id={`${'Unavailable'}${row?.id}`}>
      //                 <AvailabilityModal id={row?.id} refresh={refresh} />
      //                 <UncontrolledTooltip target={`${'Unavailable'}${row?.id}`}> Click here to update status </UncontrolledTooltip>
      //             </div>
      //         </div>
      //     ) : (
      //         <div onClick={() => updateAvailability(row?.id)}>
      //             <Badge pill color={row?.status === 'unavailable' ? 'light-danger' : 'light-success'} className="me-1">
      //                 {FirstUpperCase(row?.status)}
      //             </Badge>
      //         </div>
      //     )}
      // </>
    },
    {
      name: "Availability Id",
      selector: (row) => row?.availability?.availability_number,
      minWidth: "220px",
      maxWidth: "220px",
      sortable: true,
      width: "100",
      cell: (row) => (
        <span className="sy-tx-primary f-900">#{row?.availability?.availability_number}</span>
      ),
    },
    {
      name: "Event Date",
      selector: (row) => row?.availability?.event_date,
      minWidth: "220px",
      maxWidth: "220px",
      sortable: true,
      cell: (row) => <span className="sy-tx-modal2 f-400">{row?.availability?.event_date}</span>,
    },
    {
      name: "Event Time",
      selector: (row) =>
        `${moment(row?.availability?.start_time, "HH:mm:ss").format("hh:mm A")} to ${moment(
          row?.availability?.end_time,
          "HH:mm:ss",
        ).format("hh:mm A")}`,
      minWidth: "220px",
      maxWidth: "220px",
      sortable: true,
      cell: (row) => (
        <span className="sy-tx-modal2 f-400">
          {`${moment(row?.availability?.start_time, "HH:mm:ss").format("hh:mm A")} to ${moment(
            row?.availability?.end_time,
            "HH:mm:ss",
          ).format("hh:mm A")}`}
        </span>
      ),
    },
    {
      name: "Package type",
      selector: (row) => row?.availability?.package?.title,
      minWidth: "220px",
      maxWidth: "220px",
      sortable: true,
      cell: (row) => (
        <span className="sy-tx-modal2 f-400">{row?.availability?.package?.title}</span>
      ),
    },

    {
      name: "Event City",
      selector: (row) => row?.availability?.city,
      minWidth: "220px",
      maxWidth: "220px",
      sortable: true,
      cell: (row) => <span className="sy-tx-modal2 f-400">{row?.availability?.city}</span>,
    },
    {
      name: "Event State",
      selector: (row) => row?.availability?.state?.name,
      minWidth: "220px",
      maxWidth: "220px",
      sortable: true,
      cell: (row) => <span className="sy-tx-modal2 f-400">{row?.availability?.state?.name}</span>,
    },
    {
      name: "Event Market",
      selector: (row) => row?.availability?.location?.name,
      minWidth: "220px",
      maxWidth: "220px",
      sortable: true,
      width: "100",
      cell: (row) => (
        <span className="sy-tx-modal2 f-400">{row?.availability?.location?.name}</span>
      ),
    },
  ];
  /**
   * It fetches the availability list from the API.
   */
  const getAvailabilityList = async () => {
    setIsLoading(true);
    const data = {
      /*eslint-disable-next-line */
      page: page,
      per_page: perPage,
      sort_field: "id",
      sort_order: "desc",
      /*eslint-disable-next-line */
      search: search,
      status: status?.value,
    };
    // eslint-disable-next-line @typescript-eslint/await-thenable
    await dispatch(AvailabilityMyListAPICall(data) as unknown as AnyAction);
    setIsLoading(false);
  };
  /* A react hook that is used to fetch the availability list from the API. */
  useEffect(() => {
    getAvailabilityList();
  }, [page, perPage, search, isUpdate, status]);

  const refresh = () => setIsUpdate(!isUpdate);
  /**
   * It takes an id as an argument, creates an object with the id and a status, and then calls the
   * AvailabilityStatusUpdateAPICall function with the object as an argument
   * @param id - The id of the availability you want to update
   */
  const updateAvailability = async (id, value) => {
    if (value !== "select") {
      const data = {
        availability_id: id,
        status: value,
      };
      // eslint-disable-next-line @typescript-eslint/await-thenable
      const response = await dispatch(
        AvailabilityStatusUpdateAPICall(data) as unknown as AnyAction,
      );
      if (response?.status === 200) {
        refresh();
      }
    }
  };
  // const updateAvailability = async (id) => {
  //     const data = {
  //         availability_id: id,
  //         status: 'available'
  //     }
  //     const response = await dispatch(AvailabilityStatusUpdateAPICall(data))
  //     if (response?.status === 200) {
  //         refresh()
  //     }
  // }

  return (
    <>
      <Helmet>
        <title>Hipstr - Availability Check</title>
      </Helmet>
      <div className="main-role-ui">
        <Breadcrumbs title="Availability Check" data={[{ title: "Availability List" }]} />
        <Card className="bg-white">
          <CardHeader className="p-0 mx-1 mt-2">
            <div className="d-flex justify-content-between w-100 flex-wrap">
              <div>
                <label>
                  {" "}
                  {totalAvailability !== 0 &&
                    `Showing ${startingValue} to ${endingValue} of ${totalAvailability}
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
                  className="react-select status-select mx-sm-2"
                  classNamePrefix="select"
                  options={statusOptions}
                  placeholder="Select status"
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
                  columns={columns(updateAvailability, refresh)}
                  className="react-dataTable"
                  sortIcon={<ChevronDown size={10} />}
                  data={availability}
                  highlightOnHover
                />
              </div>
            ) : (
              <ShimmerTable col={3} row={10} />
            )}
            {totalAvailability !== 0 && (
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
      <AvailabilityModal
        id={showUnavailableId}
        refresh={refresh}
        centeredModal={showUnavailableModal}
        setCenteredModal={(val) => setShowUnavailableModal(val)}
      />
    </>
  );
};

AvailabilityCheck.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
export default AvailabilityCheck;
