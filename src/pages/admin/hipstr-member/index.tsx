import { type ReactElement } from "react";
import Layout from "@components/layouts/Layout";
import type { NextPageWithLayout } from "@pages/_app";

//imports from packages
import { ChevronDown, Edit, UserCheck, UserX } from "react-feather";
import Select from "react-select";
import ReactPaginate from "react-paginate";
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
  UncontrolledTooltip,
} from "reactstrap";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { memberListingApiCall, statusUpdateAPiCall } from "@redux/action/MemberListingAction";
import { roleListingApiCall } from "@redux/action/RoleAction";
import { MEMBER } from "@constants/CommonConstants";
import { FirstUpperCase, onSearchHandler, perPageOptions, setFilterDropdown } from "@utils/Utils";
import DeleteModal from "@components/Modal/DeleteModal";
import EditMember from "@components/Member/EditMember";
import AddMember from "@components/Member/AddMember";
import Breadcrumbs from "@components/breadcrumbs";
import { Helmet } from "react-helmet";
import DataTable from "react-data-table-component";
import { ShimmerTable } from "react-shimmer-effects";
import { useRouter } from "next/router";
import Link from "next/link";
import { checkPermisson } from "@utils/platformUtils";
const States = [
  { value: "1", label: "Active" },
  { value: "0", label: "Inactive" },
];
const Member: NextPageWithLayout = () => {
  const [add, setAdd] = useState(false);
  const [edit, setEdit] = useState(false);
  const allMemberList = useSelector((state: any) => state?.memberListingReducer?.memberData);
  const totalMemberList = useSelector((state: any) => state?.memberListingReducer?.totalMemberData);
  const roles = useSelector((state: any) => state?.roleReducer?.role);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [roleName, setRoleName] = useState(null);
  const [is_active, setIs_active] = useState("");
  const [search, setSearch] = useState("");
  const totalPage = Math.ceil(totalMemberList / perPage);
  const [roleOptions, setRoleOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [deleteID, setDeleteID] = useState(null);
  const [description, setDescription] = useState(null);
  const dispatch = useDispatch();
  const sort_order = "asc";
  const type = "member";
  const router = useRouter();
  const memberAccess = checkPermisson(router.pathname);
  const [isUpdate, setIsUpdate] = useState(false);
  /**
   * It's a function that calls an API to get a list of members
   * @param page - The page number of the results you want to fetch.
   * @param perPage - The number of items to show per page.
   * @param sort_order - This is the order in which the members will be sorted. It can be either 'asc'
   * or 'desc'.
   * @param is_active - This is a boolean value that determines whether the user is active or not.
   * @param search - The search string
   * @param roleName - The role name of the user you want to fetch.
   * @param type - This is the type of the member you want to fetch. It can be either 'all', 'active',
   * 'inactive', 'deleted' or 'blocked'.
   */
  const getMembers = async (page, perPage, sort_order, is_active, search, roleName, type) => {
    setIsLoading(true);
    const data = {
      /*eslint-disable */
      type: type,
      page: page,
      per_page: perPage,
      sort_order: sort_order,
      is_active: is_active?.value,
      role_name: roleName?.label,
      search: search,
      /*eslint-enable */
    };
    // eslint-disable-next-line @typescript-eslint/await-thenable
    await dispatch(memberListingApiCall(data) as unknown as AnyAction);
    setIsLoading(false);
  };
  /**
   * It makes an API call to get a list of roles, and then it sets the state of the roleOptions array to
   * the list of roles
   */
  const getRolls = async () => {
    const data = {
      page: "",
      perPage: "",
    };
    // eslint-disable-next-line @typescript-eslint/await-thenable
    const res = await dispatch(roleListingApiCall(data) as unknown as AnyAction);
    const tempArray: RequestOption[] = [];
    if (res.status === 200) {
      res.data.data.roles?.map((e) => {
        tempArray.push({ label: e.name, value: e.id });
      });
    }
    setRoleOptions(tempArray);
  };
  /**
   * It filters the roles array and returns the name of the role that matches the id passed to the
   * function
   * @param id - The id of the role you want to filter
   * @returns The name of the role
   */
  const filterRole = (id) => {
    if (!isLoading && roles && roles !== null) {
      const data = roles?.filter((item) => item?.id === id);
      return data[0]?.name;
    }
  };
  /* Calling the getMembers function when the page, perPage, is_active, roleName changes. */
  useEffect(() => {
    getMembers(page, perPage, sort_order, is_active, search, roleName, type);
    getRolls(page, perPage);
  }, [search, page, perPage, is_active, roleName, isUpdate]);
  //Function for refresh page and get member api call again for show add,edit and delete data
  const refreshPage = async () => {
    setIsLoading(true);
    const data = {
      /*eslint-disable */
      type: type,
      page: page,
      per_page: perPage,
      sort_order: sort_order,
      is_active: is_active,
      role_name: roleName,
      search: search,
      /*eslint-enable */
    };
    // eslint-disable-next-line @typescript-eslint/await-thenable
    await dispatch(memberListingApiCall(data) as unknown as AnyAction);
    setIsLoading(false);
  };
  //callback add view
  const callbackAdd = () => setAdd(!add);
  //callback edit view
  const callbackEdit = () => setEdit(!edit);

  const updateStatus = async (status, id) => {
    /*eslint-disable-next-line */
    // eslint-disable-next-line @typescript-eslint/await-thenable
    const res = await dispatch(statusUpdateAPiCall({ id: id }) as unknown as AnyAction);
    if (res?.status === 200) {
      setIsUpdate(!isUpdate);
    }
  };
  type RowType = {};
  const columns: TableColumn<RowType>[] = [
    {
      name: "FIRST NAME",
      selector: (row) => `${FirstUpperCase(row?.first_name)}`,
      minWidth: "150px",
      maxWidth: "250px",
      sortable: true,
      width: "100",
      cell: (row) => <span className="sy-tx-modal2 f-400">{FirstUpperCase(row?.first_name)}</span>,
    },
    {
      name: "LAST NAME",
      selector: (row) => `${FirstUpperCase(row?.last_name)}`,
      minWidth: "150px",
      maxWidth: "250px",
      sortable: true,
      cell: (row) => <span className="sy-tx-modal2 f-400">{FirstUpperCase(row?.last_name)}</span>,
    },
    {
      name: "EMAIL",
      selector: (row) => row?.email,
      minWidth: "200px",
      maxWidth: "250px",
      sortable: true,
      cell: (row) => <span className="sy-tx-modal2 f-400">{row?.email}</span>,
    },
    {
      name: "ROLE",
      selector: (row) => filterRole(row?.role_id),
      minWidth: "200px",
      maxWidth: "250px",
      sortable: true,
      cell: (row) => <span className="sy-tx-modal2 f-400">{filterRole(row?.role_id)}</span>,
    },
    {
      name: "STATUS",
      maxWidth: "200px",
      selector: (row) => row?.is_active,
      sortable: true,
      cell: (row) => (
        <Badge
          pill
          color={row?.is_active === 1 ? "light-success" : "light-danger"}
          className="me-1 mb-0"
        >
          {row?.is_active === 1 ? "Active" : "Inactive"}
        </Badge>
      ),
    },
    {
      omit: memberAccess?.edit_access !== 1 && memberAccess?.delete_access !== 1,
      name: "ACTIONS",
      style: { cursor: "pointer" },
      minWidth: "150px",
      maxWidth: "150px",
      cell: (row) => (
        <>
          <div className="d-flex align-items-center permissions-actions new-roll-a">
            {memberAccess?.edit_access === 1 && (
              <>
                <Link
                  href={{
                    pathname: `/admin/hipstr-member/edit/${row.id}`,
                  }}
                >
                  <span className="iconify cursor-pointer sy-tx-modal2 me-1">
                    <Edit />
                  </span>
                </Link>

                <span
                  className="ml-1 iconify cursor-pointer sy-tx-modal2"
                  id={`${"status"}${row?.id}`}
                >
                  {row?.is_active === 1 ? (
                    <UserCheck onClick={() => updateStatus(0, row.id)} />
                  ) : (
                    <UserX onClick={() => updateStatus(1, row.id)} />
                  )}
                </span>
                <UncontrolledTooltip target={`${"status"}${row?.id}`}>
                  {" "}
                  {row?.is_active === 1 ? "Click to Inactive user" : "Click to active user"}
                </UncontrolledTooltip>
              </>
            )}
            {memberAccess?.delete_access === 1 && (
              <button
                type="button"
                className="btn btn-icon btn btn-transparent btn-sm"
                /*eslint-disable */
                onClick={(e) => {
                  e.preventDefault(),
                    setDeleteID({
                      id: row.id,
                      type: "member",
                    }),
                    setDescription(row.first_name);
                }}
                /*eslint-enable*/
              >
                <DeleteModal
                  description={description}
                  id={deleteID}
                  code={MEMBER}
                  refresh={() => refreshPage()}
                />
              </button>
            )}
          </div>
        </>
      ),
    },
  ];

  return (
    <>
      <Helmet>
        <title>Hipstr - Hipstr Members</title>
      </Helmet>
      {/* <div className={add || edit ? "d-none " : "d-block"}> */}
      <div>
        <Breadcrumbs title="Hipstr Members" data={[{ title: "Hipstr Member Listing" }]} />
        <Card className="bg-white">
          <CardHeader className="p-0 mx-1 mt-2 mb-1">
            <CardTitle tag="h4">Filter & Search</CardTitle>
          </CardHeader>
          <CardBody className="p-0">
            <Row className="mx-50 mt-1">
              <Col md="3">
                <Label for="status-select">Search</Label>
                <Input
                  type="search"
                  isClearable={true}
                  placeholder="Search by name  "
                  onChange={(e) => onSearchHandler(e, setSearch, setPage)}
                />
              </Col>
              <Col className="my-md-0 my-1" md="3">
                <Label for="role-select">Role</Label>
                <Select
                  className="react-select"
                  classNamePrefix="select"
                  placeholder="Select role"
                  options={roleOptions}
                  onChange={(e) => {
                    setFilterDropdown(setRoleName, e);
                  }}
                  isClearable={true}
                />
              </Col>
              <Col md="3">
                <Label for="status-select">Status</Label>
                <Select
                  className="react-select"
                  classNamePrefix="select"
                  placeholder="Select Status"
                  options={States}
                  onChange={(e) => {
                    setFilterDropdown(setIs_active, e);
                  }}
                  isClearable={true}
                />
              </Col>
              {memberAccess?.add_access === 1 && (
                <Col md="3" className="mt-2">
                  <Link href="/admin/hipstr-member/add">
                    {" "}
                    <Button className="custom-btn12">+ Add Member</Button>
                  </Link>
                </Col>
              )}
            </Row>{" "}
            <br />
            {!isLoading ? (
              <div className="react-dataTable-member">
                <DataTable
                  selectableRows
                  columns={columns}
                  className="react-dataTable-member"
                  sortIcon={<ChevronDown size={10} />}
                  data={allMemberList}
                  highlightOnHover
                />
              </div>
            ) : (
              <ShimmerTable col={6} row={10} />
            )}
            {totalMemberList !== 0 && (
              <Row className="align-items-center">
                <Col sm="6">
                  <div className="d-flex align-items-center pagination-role">
                    <label htmlFor="rows-per-page">Show 1 To </label>
                    <Select
                      isSearchable={false}
                      id="rows-per-page"
                      className="react-select mx-1"
                      onChange={(e) => {
                        /*eslint-disable-next-line */
                        setPage(1), setPerPage(e.value);
                      }}
                      classNamePrefix="select"
                      defaultValue={perPageOptions[0]}
                      options={perPageOptions}
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
          </CardBody>
        </Card>
      </div>
      {/* </div> */}
      {add ? <AddMember open={add} callbackAdd={callbackAdd} refresh={refreshPage} /> : null}
      {edit ? <EditMember open={edit} callbackEdit={callbackEdit} refresh={refreshPage} /> : null}
    </>
  );
};

Member.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
export default Member;
