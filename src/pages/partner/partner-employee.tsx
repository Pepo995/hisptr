import { Edit2 } from "react-feather";
import { Badge, Button, Card, CardBody, CardHeader, CardTitle, Input, Table } from "reactstrap";
import ReactPaginate from "react-paginate";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import Select from "react-select";
import { useEffect, useState } from "react";
import { partnerMemberListApiCall } from "@redux/action/PartnerAction";
import DeleteModal from "@components/Modal/DeleteModalPartner";
import { USER } from "@constants/CommonConstants";
import { decryptData, onSearchHandler, perPageOptions } from "@utils/Utils";
import Breadcrumbs from "@components/breadcrumbs";
import ShimmerPartnerTable from "@components/Shimmer/ShimmerPartnerTable";
import NoDataFound from "@components/Common/NoDataFound";
import { Helmet } from "react-helmet";
import { type ReactElement } from "react";
import Layout from "@components/layouts/Layout";
import type { NextPageWithLayout } from "@pages/_app";
import { type AnyAction } from "@reduxjs/toolkit";
import { type Partner } from "@types";

const PartnerMember: NextPageWithLayout = () => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const allpartnerList: Partner[] = useSelector(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
    (state: any) => state.partnerReducer?.partnerUserData,
  );
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
  const totalPartnerList = useSelector((state: any) => state.partnerReducer?.totalpartnerUserData);
  const [deleteID, setDeleteID] = useState<number>();
  const [description, setDescription] = useState<string>();
  const type = "partneruser";
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const id = decryptData(localStorage.getItem(USER) ?? "");
  const totalPage = Math.ceil(totalPartnerList / perPage);
  //Function for delete model
  const deleteData = (id: number, name: string) => {
    setDeleteID(id);
    setDescription(name);
  };
  //Function for pagination
  const handleChange = (data: { value: string; label: string } | null) => {
    setPerPage(parseInt(data?.value ?? "10"));
    setPage(1);
  };
  //Function for get members api call
  const getMembers = async (page: number, perPage: number, search: string, type: string) => {
    setIsLoading(true);
    /*eslint-disable */
    const data = {
      partner_id: id,
      type: type,
      page: page,
      per_page: perPage,
      search: search,
    };
    /*eslint-enable */
    // eslint-disable-next-line @typescript-eslint/await-thenable
    await dispatch(partnerMemberListApiCall(data) as unknown as AnyAction);
    setIsLoading(false);
  };
  //onload get member data
  useEffect(() => {
    void getMembers(page, perPage, search, type);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, page, perPage]);
  //Function for refresh page and get member api call  when data edit or delete
  const refreshPage = async () => {
    setIsLoading(true);
    const data = {
      /*eslint-disable*/
      partner_id: id,
      type: type,
      page: page,
      per_page: perPage,
      search: search,
      /*eslint-enable */
    };
    // eslint-disable-next-line @typescript-eslint/await-thenable
    await dispatch(partnerMemberListApiCall(data) as unknown as AnyAction);
    setIsLoading(false);
  };

  return (
    <>
      <div className={"d-block"}>
        <Helmet>
          <title>Hipstr - My Employees</title>
        </Helmet>
        <Breadcrumbs title="My Employees" data={[{ title: "My Employees Listing" }]} />
        <Card className="bg-white">
          <CardBody className="p-0">
            <div className="p-2">
              <CardHeader className="p-0">
                <CardTitle tag="h4">My Employees</CardTitle>
              </CardHeader>
              <div className="d-flex justify-content-between mt-2">
                <Input
                  type="search"
                  isClearable={true}
                  onChange={(e) => onSearchHandler(e, setSearch, setPage)}
                  placeholder="search by name  "
                  className="w-50"
                />
                <Link href="/partner/add-employee">
                  <Button className="custom-btn3">Add Employee</Button>
                </Link>
              </div>
            </div>
            {!isLoading ? (
              <Table responsive>
                <thead>
                  <tr>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Email</th>
                    <th>Status</th>
                    <th>Designation</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {allpartnerList && allpartnerList.length > 0 ? (
                    allpartnerList.map((item, i) => {
                      return (
                        <tr key={i}>
                          <td>{item.first_name || "---"}</td>
                          <td>{item?.last_name || "---"}</td>
                          <td>{item.email || "---"}</td>
                          <td>
                            <Badge
                              pill
                              color={item?.is_active === 1 ? "light-success" : "light-warning"}
                              className="me-1"
                            >
                              {item?.is_active === 1 ? "Active" : "Inactive"}
                            </Badge>
                          </td>
                          <td>{item?.detail?.designation}</td>
                          <td>
                            <div className="d-flex align-items-center">
                              <Link
                                href={{
                                  pathname: `/admin/edit-employee/{item.id}`,
                                }}
                                type="button"
                                className="btn btn-icon btn btn-transparent btn-sm"
                              >
                                <span className="iconify">
                                  <Edit2 />
                                </span>
                              </Link>
                              <span
                                className="iconify"
                                onClick={() => {
                                  deleteData(item.id, item.first_name);
                                }}
                              >
                                <DeleteModal
                                  description={description}
                                  id={deleteID}
                                  refresh={() => refreshPage()}
                                  type="partneruser"
                                />
                              </span>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <div className="no-data-found">
                      <NoDataFound message={"partner employee"} bgWhite />
                    </div>
                  )}
                </tbody>
              </Table>
            ) : (
              <ShimmerPartnerTable />
            )}
            {totalPartnerList !== 0 && (
              <div className="d-flex justify-content-between mx-2">
                <div className="d-flex align-items-center pagination-role">
                  <label htmlFor="rows-per-page">Show 1 To </label>
                  <Select
                    isSearchable={false}
                    id="rows-per-page"
                    className="react-select mx-1"
                    classNamePrefix="select"
                    defaultValue={perPageOptions[0]}
                    options={perPageOptions}
                    onChange={handleChange}
                    isMulti={false}
                  />
                  <label htmlFor="rows-per-page"> Per Page</label>
                </div>
                <div className="mt-1">
                  <ReactPaginate
                    nextLabel=""
                    forcePage={page - 1}
                    onPageChange={(e) => {
                      setPage(e.selected + 1);
                    }}
                    pageCount={totalPage}
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

PartnerMember.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
export default PartnerMember;
