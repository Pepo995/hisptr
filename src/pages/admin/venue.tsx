import { type ReactElement } from "react";
import Layout from "@components/layouts/Layout";
import type { NextPageWithLayout } from "@pages/_app";

import { useEffect, useState } from "react";
import DataTable, { type TableColumn } from "react-data-table-component";
import { ChevronDown } from "react-feather";
import ReactPaginate from "react-paginate";
import Select from "react-select";
import { venueListApiCalls } from "@redux/action/VenueAction";
import { Card, CardBody, CardHeader, Col, Input, Row } from "reactstrap";
import { ShimmerTable } from "react-shimmer-effects";

import { onSearchHandler, perPageHandler, perPageOptions } from "@utils/Utils";
import { NoOfEntries } from "@utils/platformUtils";
import { useDispatch, useSelector } from "react-redux";
import { Helmet } from "react-helmet";
import { type Venue } from "@types";
import { type AnyAction } from "@reduxjs/toolkit";

const columns: TableColumn<Venue>[] = [
  {
    name: "Venue Name",
    selector: (row) => row?.name,
    minWidth: "250px",
    maxWidth: "250px",
    sortable: true,
    width: "100",
    cell: (row) => <span className="sy-tx-modal2 f-400">{row?.name}</span>,
  },
  {
    name: "Venue Address",
    selector: (row) => row.address_line_1,
    minWidth: "450px",
    maxWidth: "450px",
    cell: (row) => (
      <span className="sy-tx-modal2 f-400">{row.address_line_1 + row.address_line_2}</span>
    ),
  },
  {
    name: " City",
    minWidth: "250px",
    maxWidth: "250px",
    selector: (row) => row?.city,
    cell: (row) => <span className="sy-tx-modal2 f-400">{row?.city}</span>,
  },
  {
    name: "State",
    selector: (row) => row?.state?.name,
    cell: (row) => <span className="sy-tx-modal2 f-400">{row?.state?.name}</span>,
    sortable: true,
  },
  {
    name: "Market",
    selector: (row) => row?.event?.market?.name,
    cell: (row) => <span className="sy-tx-modal2 f-400">{row?.event?.market?.name}</span>,
    sortable: true,
  },
];

const VenueList: NextPageWithLayout = () => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
  const venue = useSelector((state: any) => state?.venueReducer?.venue);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
  const totalVenue = useSelector((state: any) => state?.venueReducer?.totalVenue);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [search, setSearch] = useState("");
  const [IsLoading, setIsLoading] = useState(false);
  const totalPage = Math.ceil(totalVenue / perPage);
  const dispatch = useDispatch();

  /**
   * It takes in three parameters, page, perPage, and search, and then it sets the isLoading state to
   * true, creates a new FormData object, appends the three parameters to the formData object, and then
   * dispatches the venueListApiCalls action with the formData object as the parameter.
   *
   * The venueListApiCalls action is an asynchronous function that makes an API call to the backend and
   * returns the response. The response is then set to the venueData state, the total state, and the
   * isLoading state.
   *
   * The venueListApiCalls action is defined in the venueActions.js file.
   * @param page - The page number of the data you want to fetch.
   * @param perPage - The number of items to show per page.
   * @param search - The search term
   */
  const getVenueData = async (page: number, perPage: number, search: string) => {
    setIsLoading(true);
    const formData = new FormData();
    formData.append("page", page.toString());
    formData.append("per_page", perPage.toString());
    formData.append("search", search);
    // eslint-disable-next-line @typescript-eslint/await-thenable
    await dispatch(venueListApiCalls(formData) as unknown as AnyAction);
    setIsLoading(false);
  };
  /* This is a React hook that is used to perform side effects in function components. It takes in a
  function as a parameter and a list of dependencies. The function is executed after the render is
  committed to the screen. The list of dependencies is used to determine when the function should be
  executed. If the list is empty, the function is executed after every render. If the list is not
  empty, the function is executed after every render if the values in the list have changed. */
  useEffect(() => {
    void getVenueData(page, perPage, search);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, perPage, search]);

  return (
    <>
      <Helmet>
        <title>Hipstr - Venue</title>
      </Helmet>
      <div>
        <div className="mb-sm-2">
          <h3>Venue List</h3>
        </div>
        <Card className="bg-white">
          <CardHeader className="p-0 mx-1 mt-2">
            <div className="header-search-filter">
              <div>{NoOfEntries(page.toString(), perPage.toString(), totalVenue.toString())}</div>
              <div className="support-header mb-1">
                <Input
                  type="search"
                  isClearable={true}
                  placeholder="Search"
                  className="me-sm-1"
                  onChange={(e) => onSearchHandler(e, setSearch, setPage)}
                />
              </div>
            </div>
          </CardHeader>
          <CardBody className="p-0">
            {!IsLoading ? (
              <div className="react-dataTable-support">
                <DataTable
                  selectableRows
                  columns={columns}
                  className="react-dataTable-support"
                  sortIcon={<ChevronDown size={10} />}
                  data={venue}
                  highlightOnHover
                />
              </div>
            ) : (
              <ShimmerTable col={7} row={10} />
            )}

            {totalVenue !== 0 && (
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

VenueList.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
export default VenueList;
