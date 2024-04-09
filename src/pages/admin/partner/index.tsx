import { type ReactElement } from "react";
import Layout from "@components/layouts/Layout";
import type { NextPageWithLayout } from "@pages/_app";
//imports from packages
import { useEffect, useState } from "react";
import { ChevronDown, Edit, Eye } from "react-feather";
import ReactPaginate from "react-paginate";

import Select from "react-select";
import {
  Badge,
  Button,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Col,
  Input,
  Label,
  Row,
} from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import { partnerListingApiCall } from "@redux/action/PartnerAction";
import DeleteModal from "@components/Modal/DeleteModal";
import Breadcrumbs from "@components/breadcrumbs";
import {
  FirstUpperCase,
  filterOptions,
  onSearchHandler,
  perPageOptions,
  setFilterDropdown,
} from "@utils/Utils";

import { PARTNER, TYPE_PARTNER } from "@constants/CommonConstants";
import { Helmet } from "react-helmet";
import DataTable from "react-data-table-component";
import { ShimmerTable } from "react-shimmer-effects";
import { useRouter } from "next/router";
import Link from "next/link";
import { checkPermisson } from "@utils/platformUtils";

const PartnerMember: NextPageWithLayout = () => {
  const [view, setView] = useState(false);
  const partner = useSelector((state: any) => state?.partnerReducer?.partner);
  const totalPartner = useSelector((state: any) => state?.partnerReducer?.totalPartner);
  const router = useRouter();
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [isActive, setIsActive] = useState(null);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const type = TYPE_PARTNER;
  const totalPage = Math.ceil(totalPartner / perPage);
  const [deleteID, setDeleteID] = useState(null);
  const sortBy = "asc";

  const pertnerAccess = checkPermisson(router.pathname);
  /**
   * This function is used to get the partner list from the API.
   */
  const getPartner = async () => {
    setIsLoading(true);
    /*eslint-disable*/
    const data = {
      type: type,
      page: page,
      per_page: perPage,
      sort_field: "",
      sort_order: sortBy,
      is_active: isActive?.value,
      search: search,
    };
    /*eslint-enable */
    // eslint-disable-next-line @typescript-eslint/await-thenable
    await dispatch(partnerListingApiCall(data) as unknown as AnyAction);
    setIsLoading(false);
  };
  /* The above code is using the useEffect hook to call the getPartner function when the search,
  isActive, perPage, or page state changes. */
  useEffect(() => {
    getPartner();
  }, [search, isActive, perPage, page]);
  const reftesh = () => {
    getPartner();
  };
  const callbackView = () => setView(!view);

  type RowType = {};
  const columns: TableColumn<RowType>[] = [
    {
      name: "NAME",
      selector: (row) => FirstUpperCase(row?.first_name),
      minWidth: "150px",
      maxWidth: "200px",
      sortable: true,
      style: { cursor: "pointer" },
      width: "100",
      cell: (row) => (
        <Link
          href={{
            pathname: `/admin/partner/view-partner-member/${row.id}`,
          }}
        >
          <span className="sy-tx-modal2 fw-bold">{FirstUpperCase(row?.first_name)}</span>
        </Link>
      ),
    },
    {
      name: "EMAIL",
      selector: (row) => row?.email,
      minWidth: "250px",
      maxWidth: "250px",
      style: { cursor: "pointer" },
      sortable: true,
      cell: (row) => (
        <Link
          href={{
            pathname: `/admin/partner/view-partner-member/${row.id}`,
          }}
        >
          {" "}
          <span className="sy-tx-modal2 f-400">{row?.email}</span>
        </Link>
      ),
    },
    {
      name: "ADDRESS",
      style: { cursor: "pointer" },
      selector: (row) => row?.detail?.address,
      minWidth: "250px",
      maxWidth: "250px",
      sortable: true,
      cell: (row) => (
        <Link
          href={{
            pathname: `/admin/partner/view-partner-member/${row.id}`,
          }}
        >
          <span className="sy-tx-modal2 f-400">{row?.detail?.address}</span>
        </Link>
      ),
    },

    {
      name: "AGREEMENT",
      maxWidth: "200px",
      minWidth: "100px",
      style: { cursor: "pointer" },
      sortable: true,
      selector: (row) => row?.is_agreement,
      cell: (row) => (
        <Link
          href={{
            pathname: `/admin/partner/view-partner-member/${row.id}`,
          }}
        >
          <span className="sy-tx-modal2 f-400 single-line-elipsis">
            {row?.is_agreement === 1 ? "Signed" : "Pending"}
          </span>
        </Link>
      ),
    },
    {
      name: "COMPANY",
      minWidth: "300px",
      maxWidth: "300px",
      style: { cursor: "pointer" },
      sortable: true,
      selector: (row) => row?.company,
      cell: (row) => (
        <Link
          href={{
            pathname: `/admin/partner/view-partner-member/${row.id}`,
          }}
        >
          <span className="sy-tx-modal2 f-400 single-line-elipsis2">{row?.company}</span>
        </Link>
      ),
    },
    {
      name: "STATUS",
      style: { cursor: "pointer" },
      selector: (row) => row?.is_active,
      minWidth: "150px",
      maxWidth: "150px",
      sortable: true,
      cell: (row) => (
        <Link
          href={{
            pathname: `/admin/partner/view-partner-member/${row.id}`,
          }}
        >
          <Badge
            pill
            color={row?.is_active === 1 ? "light-success" : "light-warning"}
            className="me-1 mb-0"
          >
            {row?.is_active === 1 ? "Active" : "Inactive"}
          </Badge>
        </Link>
      ),
    },

    {
      omit:
        pertnerAccess?.edit_access !== 1 &&
        pertnerAccess?.delete_access !== 1 &&
        pertnerAccess?.view_access !== 1,
      name: "ACTIONS",
      style: { cursor: "pointer" },
      minWidth: "170px",
      maxWidth: "170px",
      selector: (row) => (
        <>
          <div className="d-flex align-items-center permissions-actions new-roll-a">
            {pertnerAccess?.edit_access === 1 && (
              <Link
                href={{
                  pathname: `/admin/partner/edit-partner-member/${row.id}`,
                }}
                className="btn btn-icon btn btn-transparent btn-sm"
              >
                <span className="iconify me-50 cursor-pointer">
                  <Edit />
                </span>
              </Link>
            )}
            &nbsp;
            {pertnerAccess?.view_access === 1 && (
              <Link
                href={{
                  pathname: `/admin/partner/view-partner-member/${row.id}`,
                }}
              >
                <span
                  onClick={() => {
                    callbackView();
                  }}
                  type="button"
                  className="btn btn-icon btn btn-transparent btn-sm iconify"
                >
                  <Eye />
                </span>
              </Link>
            )}
            &nbsp;
            {pertnerAccess?.delete_access === 1 && (
              <button
                type="button"
                className="btn btn-icon btn btn-transparent btn-sm"
                onClick={() => {
                  setDeleteID({ id: row.id, type: "partner" });
                }}
              >
                <DeleteModal
                  description={row.first_name}
                  id={deleteID}
                  code={PARTNER}
                  refresh={reftesh}
                />
              </button>
            )}
          </div>
        </>
      ),
    },
  ];
  const onRowClicked = (row) => {
    router.push({
      pathname: `/admin/partner/view-partner-member/${row.id}`,
      state: { id: row.id },
    });
  };
  return (
    <>
      <Helmet>
        <title>Hipstr - Partner Members</title>
      </Helmet>
      <div>
        <div>
          <Breadcrumbs title="Partner Members" data={[{ title: "Partner Member Listing" }]} />
          <Card className="bg-white">
            <CardHeader>
              <CardTitle tag="h4">Filter & Search</CardTitle>
            </CardHeader>
            <CardBody>
              <Row>
                <Col md="3">
                  <Label for="status-select">Search</Label>
                  <Input
                    type="search"
                    isClearable={true}
                    placeholder="Search by name  "
                    onChange={(e) => onSearchHandler(e, setSearch, setPage)}
                  />
                </Col>
                <Col md="3">
                  <Label for="status-select">Status</Label>
                  <Select
                    className="react-select"
                    classNamePrefix="select"
                    placeholder="Select Status"
                    options={filterOptions}
                    onChange={(e) => {
                      setFilterDropdown(setIsActive, e);
                    }}
                    isClearable={true}
                    isSearchable={false}
                    value={isActive !== null ? filterOptions?.[isActive] : []}
                  />
                </Col>
                {pertnerAccess?.add_access === 1 && (
                  <Col Col md="6" className="mt-2 text-right">
                    <Link
                      href={{
                        pathname: "/admin/partner/invite-partner-member",
                      }}
                    >
                      <Button className="custom-btn3">Invite</Button> &nbsp;
                    </Link>
                  </Col>
                )}
              </Row>
            </CardBody>
            {!isLoading ? (
              <div className="react-dataTable-partner">
                <DataTable
                  selectableRows
                  columns={columns}
                  className="react-dataTable-partner"
                  sortIcon={<ChevronDown size={10} />}
                  data={partner}
                  onRowClicked={onRowClicked}
                  highlightOnHover
                />
              </div>
            ) : (
              <ShimmerTable col={7} row={10} />
            )}

            {partner?.length !== 0 && (
              <Row className="align-items-center">
                <Col sm="6">
                  <div className="d-flex align-items-center pagination-role">
                    <label htmlFor="rows-per-page">Show 1 To </label>

                    <Select
                      className="react-select mx-1"
                      classNamePrefix="select"
                      onChange={(e) => {
                        /*eslint-disable-next-line */
                        setPerPage(e.value), setPage(1);
                      }}
                      defaultValue={perPageOptions[0]}
                      options={perPageOptions}
                      isSearchable={false}
                    />
                    <label htmlFor="rows-per-page"> Per Page</label>
                  </div>
                </Col>
                <Col sm="6" className="pagination-role-n mt-1">
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
          </Card>
        </div>
      </div>
    </>
  );
};
PartnerMember.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
export default PartnerMember;
