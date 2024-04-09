import { type ReactElement, useEffect, useState } from "react";

import { ChevronDown, Eye } from "react-feather";
import { Badge, Card, CardBody, CardHeader, CardTitle, Input } from "reactstrap";
import { ShimmerTable } from "react-shimmer-effects";
import Link from "@components/ActiveLink";

import ReactPaginate from "react-paginate";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";

import Breadcrumbs from "@components/breadcrumbs";
import { FirstUpperCase, onSearchHandler, perPageHandler, perPageOptions } from "@utils/Utils";
import { customerListingApiCall } from "@redux/action/CustomerAction";

import { Helmet } from "react-helmet";
import DataTable, { type TableColumn } from "react-data-table-component";
import { type NextPageWithLayout } from "@pages/_app";
import Layout from "@components/layouts/Layout";
import { type AppState, type BaseAction, type FilterAndPagination } from "@types";
import { type UserFromPhp } from "@types";
import { useRouter } from "next/router";

const Client: NextPageWithLayout = () => {
  const router = useRouter();
  const customers = useSelector(
    (state: AppState) => state?.customerReducer?.customer,
  ) as UserFromPhp[];
  const totalCustomer = useSelector(
    (state: AppState) => state?.customerReducer?.totalCustomer,
  ) as number;
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState<string>("");
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const totalPage = Math.ceil(totalCustomer / perPage);

  const getClient = async (page: number, perPage: number, search?: string) => {
    setIsLoading(true);
    const filter: FilterAndPagination = {
      page,
      per_page: perPage,
      search,
      type: "customer",
    };
    await dispatch(customerListingApiCall(filter) as unknown as BaseAction);
    setIsLoading(false);
  };
  /* A react hook that is called when the component is mounted. */
  useEffect(() => {
    void getClient(page, perPage, search);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, page, perPage]);

  const columns: TableColumn<UserFromPhp>[] = [
    {
      name: "FIRST NAME",
      selector: (row) => FirstUpperCase(row?.first_name),
      minWidth: "150px",
      maxWidth: "300px",
      sortable: true,
      style: { cursor: "pointer" },
      width: "100",
      cell: (row) => (
        <Link
          href={{ pathname: `/admin/customer/detail/${row.id}` }}
          className="btn btn-icon btn btn-transparent btn-sm"
        >
          <span className="sy-tx-modal2 fw-bold">{FirstUpperCase(row?.first_name)}</span>
        </Link>
      ),
    },
    {
      name: "LAST NAME",
      selector: (row) => FirstUpperCase(row?.last_name),
      minWidth: "150px",
      maxWidth: "300px",
      sortable: true,
      style: { cursor: "pointer" },
      width: "100",
      cell: (row) => (
        <Link
          href={{ pathname: `/admin/customer/detail/${row.id}` }}
          className="btn btn-icon btn btn-transparent btn-sm"
        >
          <span className="sy-tx-modal2 fw-bold">{FirstUpperCase(row?.last_name)}</span>
        </Link>
      ),
    },
    {
      name: "EMAIL",
      selector: (row) => row?.email,
      minWidth: "300px",
      maxWidth: "500px",
      style: { cursor: "pointer" },
      sortable: true,
      cell: (row) => (
        <Link
          href={{ pathname: `/admin/customer/detail/${row.id}` }}
          className="btn btn-icon btn btn-transparent btn-sm"
        >
          {" "}
          <span className="sy-tx-modal2 f-400">{row?.email}</span>
        </Link>
      ),
    },
    {
      name: "STATUS",
      style: { cursor: "pointer" },
      selector: (row) => row.detail.address,
      minWidth: "150px",
      maxWidth: "250px",
      sortable: true,
      cell: (row) => (
        <Link
          href={{ pathname: `/admin/customer/detail/${row.id}` }}
          className="btn btn-icon btn btn-transparent btn-sm"
        >
          {row?.is_online === true ? (
            <Badge pill color="light-success" className="me-1">
              Online
            </Badge>
          ) : (
            <Badge pill color="light-warning" className="me-1">
              Offline
            </Badge>
          )}
        </Link>
      ),
    },
    {
      name: "ACTIONS",
      style: { cursor: "pointer" },
      minWidth: "110px",
      maxWidth: "110px",
      cell: (row) => (
        <>
          <Link
            href={{ pathname: `/admin/customer/detail/${row.id}` }}
            className="btn btn-icon btn btn-transparent btn-sm"
          >
            <span className="iconify">
              <Eye />
            </span>
          </Link>
        </>
      ),
    },
  ];

  return (
    <>
      <Helmet>
        <title>Hipstr - Customer Management</title>
      </Helmet>
      <div>
        <Breadcrumbs title="Customer Management" data={[{ title: "Customer Listing" }]} />

        <Card className="bg-white">
          <CardBody className="p-0">
            <div className="p-2">
              <CardHeader className="p-0">
                <CardTitle tag="h4">Customers</CardTitle>
              </CardHeader>
              <div className="mt-sm-2 mt-50">
                <Input
                  type="search"
                  isClearable={true}
                  placeholder="Search by name  "
                  className="client-serach-filter"
                  onChange={(e) => onSearchHandler(e, setSearch, setPage)}
                />
              </div>
            </div>
            {!isLoading ? (
              <div className="react-dataTable-client">
                <DataTable
                  selectableRows
                  columns={columns}
                  className="react-dataTable-client"
                  sortIcon={<ChevronDown size={10} />}
                  data={customers}
                  onRowClicked={(row) =>
                    router.push({ pathname: `/admin/customer/detail/${row.id}` })
                  }
                  highlightOnHover
                />
              </div>
            ) : (
              <ShimmerTable col={7} row={10} />
            )}
            {customers?.length !== 0 && (
              <div className="d-flex justify-content-between mx-2 flex-wrap">
                <div className="d-flex align-items-center pagination-role m-0">
                  <label htmlFor="rows-per-page">Show 1 To </label>
                  <Select
                    id="rows-per-page"
                    className="react-select mx-1"
                    classNamePrefix="select"
                    defaultValue={perPageOptions[0]}
                    options={perPageOptions}
                    onChange={(e) => perPageHandler(e ?? perPageOptions[0], setPerPage, setPage)}
                    isSearchable={false}
                    isMulti={false}
                  />
                  <label htmlFor="rows-per-page"> Per Page</label>
                </div>
                <div className="mt-1">
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
                </div>
              </div>
            )}
          </CardBody>
        </Card>
      </div>
    </>
  );
};

Client.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
export default Client;
