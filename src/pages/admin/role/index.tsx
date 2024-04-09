import { type ReactElement } from "react";
import Layout from "@components/layouts/Layout";
import type { NextPageWithLayout } from "@pages/_app";

import { useDispatch, useSelector } from "react-redux";
import { Fragment, useEffect, useState } from "react";
import { Button, CardTitle, Col, Input, Row } from "reactstrap";
import Select from "react-select";

import ReactPaginate from "react-paginate";
import Breadcrumbs from "@components/breadcrumbs";
import RoleTable from "@components/roles/RoleTable";
import Card from "@components/card-snippet";
import { roleListingApiCall } from "@redux/action/RoleAction";
import { onSearchHandler, perPageHandler, perPageOptions } from "@utils/Utils";
import { ShimmerTable } from "react-shimmer-effects";
import { Helmet } from "react-helmet";
import { useRouter } from "next/router";
import Link from "next/link";
import { checkPermisson } from "@utils/platformUtils";

const RoleList: NextPageWithLayout = () => {
  const dispatch = useDispatch();
  const role = useSelector((state: any) => state?.roleReducer?.role);
  const totalRole = useSelector((state: any) => state?.roleReducer?.totalRole);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [search, setSearch] = useState("");
  const totalPage = Math.ceil(totalRole / perPage);
  const router = useRouter();
  const roleAccess = checkPermisson(router.pathname);
  const [isUpdate, setIsUpdate] = useState(false);
  /**
   * It makes an API call to the backend to get a list of roles
   * @param page - The page number of the pagination.
   * @param perPage - The number of items to show per page.
   * @param filter - The field to sort by.
   * @param sortBy - This is the sort order. It can be either 'asc' or 'desc'.
   * @param search - The search string
   */
  const getRolls = async (page, perPage, search) => {
    setIsLoading(true);
    /*eslint-disable */
    const data = {
      page: page,
      per_page: perPage,
      search: search,
    };
    /*eslint-enable */
    // eslint-disable-next-line @typescript-eslint/await-thenable
    await dispatch(roleListingApiCall(data) as unknown as AnyAction);
    setIsLoading(false);
  };
  /* A react hook that is called after every render. */
  useEffect(() => {
    getRolls(page, perPage, search);
  }, [page, perPage, search, isUpdate]);

  return (
    <>
      <div className={"main-role-ui-new"}>
        <Fragment>
          <Helmet>
            <title>Hipstr - Roles and Permission</title>
          </Helmet>
          <Breadcrumbs title="Roles and Permission " data={[{ title: "Role Listing" }]} />
          <Row>
            <Col sm="12">
              <Card bgWhite>
                <div className="mx-2 mt-2">
                  <CardTitle tag="h4" className="mb-1">
                    Roles Management
                  </CardTitle>

                  <div className="mb-1 role-search">
                    <Input
                      type="search"
                      isClearable={true}
                      placeholder="Search by name"
                      className="client-serach-filter mb-75"
                      onChange={(e) => onSearchHandler(e, setSearch, setPage)}
                    />
                    {roleAccess?.add_access === 1 && (
                      <Link href="/admin/role/add-role">
                        <Button className="custom-btn3">Add Role</Button>
                      </Link>
                    )}
                  </div>
                </div>

                {!isLoading ? (
                  <RoleTable
                    isLoading={isLoading}
                    role={role}
                    totalRole={totalRole}
                    roleAccess={roleAccess}
                    refresh={() => setIsUpdate(!isUpdate)}
                  />
                ) : (
                  <ShimmerTable col={2} row={5} />
                )}

                {!isLoading && role && role?.length !== 0 && (
                  <Row className="align-items-center">
                    <Col sm="6">
                      <div className="d-flex align-items-center pagination-role mt-1">
                        <label htmlFor="rows-per-page">Show 1 To </label>
                        <Select
                          id="rows-per-page"
                          className="react-select mx-1"
                          onChange={(e) => perPageHandler(e, setPerPage, setPage)}
                          classNamePrefix="select"
                          defaultValue={perPageOptions[0]}
                          options={perPageOptions}
                          isSearchable={false}
                        ></Select>
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
            </Col>
          </Row>
        </Fragment>
      </div>
    </>
  );
};
RoleList.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
export default RoleList;
