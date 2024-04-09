import { type ReactElement } from "react";
import Layout from "@components/layouts/Layout";
import type { NextPageWithLayout } from "@pages/_app";
import { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import Breadcrumbs from "@components/breadcrumbs";
import { ArrowLeft } from "react-feather";
import { useDispatch } from "react-redux";
import Select from "react-select";
import {
  Badge,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Col,
  Form,
  Label,
  Row,
  Table,
} from "reactstrap";

import ShimmerViwepartner from "@components/Shimmer/ShimmerViwepartner";
import { partnerGetByIdApiCall, partnerMemberListApiCall } from "@redux/action/PartnerAction";
import { userPerPageOptions } from "@utils/Utils";
import ShimmerInvitemember from "@components/Shimmer/ShimmerInvitemember";
import { countryListApiCall } from "@redux/action/CountryAction";

import NoDataFound from "@components/Common/NoDataFound";

import { useRouter } from "next/router";
import { Helmet } from "react-helmet";
import Link from "next/link";

const ViewPartnerMember: NextPageWithLayout = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [partner, setPartner] = useState([]);
  const [isMember, setIsMember] = useState(false);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(5);
  const [partnerUserList, setPartnerUserList] = useState([]);
  const [count, setCount] = useState(null);
  const totalPage = Math.ceil(count / perPage);
  const [country, setCountry] = useState([]);
  const router = useRouter();
  /**
   * It fetches the partner data from the API and sets the state of the component
   */
  const getPartner = async (id) => {
    setIsLoading(true);
    /*eslint-disable-next-line */
    const response = await dispatch(partnerGetByIdApiCall({ id, type: "partner" }));
    if (response.status === 200) {
      setPartner(response.data);
      // eslint-disable-next-line @typescript-eslint/await-thenable
      const res = await dispatch(countryListApiCall() as unknown as AnyAction);
      const tempArray: RequestOption[] = [];
      if (res.status === 200) {
        res.data.data.countries.map((c) => tempArray.push({ label: c.name, value: c.id }));
      }

      setCountry(tempArray);
    }
    setIsLoading(false);
  };
  /**
   * It fetches the partner members from the API.
   */
  const getPartnerMamber = async (id) => {
    setIsMember(true);
    const data = {
      partner_id: id,
      type: "partneruser",
      /*eslint-disable-next-line */
      page: page,
      per_page: perPage,
    };
    // eslint-disable-next-line @typescript-eslint/await-thenable
    const res = await dispatch(partnerMemberListApiCall(data) as unknown as AnyAction);
    if (res.status === 200) {
      setPartnerUserList(res?.data?.data?.users);
    }
    setCount(res?.data?.data?.count);
    setIsMember(false);
  };
  /* A react hook that is used to fetch the data from the API. */
  useEffect(() => {
    if (router.query === undefined) {
      void router.replace("/partner");
    } else if (router.query.id !== undefined) {
      void getPartner(router.query.id);
    }
  }, [router.query.id]);

  /* A react hook that is used to fetch the data from the API when page and perPage is updated. */
  useEffect(() => {
    if (router.query.id !== undefined) void getPartnerMamber(router.query.id);
  }, [page, perPage, router.query.id]);

  /**
   * It takes an array of objects, and returns an array of strings
   * @param countryArray - The array of countries that you want to filter.
   * @returns const filterCountry = (countryArray) => {
   *     if (!isLoading && country && country.length !== 0) {
   *       const tempArray = []
   *       countryArray?.map((e) => tempArray.push(e.country_id))
   *       const filterData = tempArray.map((x) => country?.find((e)
   */
  const filterCountry = (countryArray) => {
    if (!isLoading && country && country?.length !== 0) {
      const tempArray: RequestOption[] = [];
      countryArray?.map((e) => tempArray.push(e.country_id));
      const filterData = tempArray.map((x) => country?.find((e) => e.value === x));
      let arr = [];
      filterData?.map((e) => arr.push(` ${e?.label}`));
      arr = arr + [];
      return arr;
    }
  };

  return (
    <>
      <Helmet>
        <title>Hipstr - View Partner Member</title>
      </Helmet>
      <div>
        <Breadcrumbs
          title="Partner Members"
          data={[
            { title: "Partner Member Listing", link: "/admin/partner" },
            { title: "View Partner Member" },
          ]}
        />
        <Card className="bg-white">
          <CardHeader>
            <CardTitle tag="h4" className="back-arrow-h cursor-pointer">
              <Link href="/admin/partner">
                <ArrowLeft className="sy-tx-primary" />
              </Link>
              &nbsp; View Partner Member
            </CardTitle>
          </CardHeader>

          <CardBody>
            {!isLoading ? (
              <Form>
                <Row className="mb-1">
                  <Label sm="2" for="name" className="add-form-header">
                    Name
                  </Label>
                  <Col sm="9" className="mt-sm-1">
                    <p>
                      {partner?.first_name} {partner?.last_name}
                    </p>
                  </Col>
                </Row>
                <Row className="mb-1">
                  <Label sm="2" for="Email" disabled className="add-form-header">
                    Email
                  </Label>
                  <Col sm="9">
                    <p>{partner?.email}</p>
                  </Col>
                </Row>
                <Row className="mb-1">
                  <Label sm="2" for="address" className="add-form-header">
                    Address
                  </Label>
                  <Col sm="9" className="mt-sm-1">
                    <p>
                      {partner?.detail?.address} <br />
                      {partner?.detail?.state?.name}
                    </p>
                  </Col>
                </Row>
                <Row className="mb-1">
                  <Label sm="2" for="address" className="add-form-header">
                    Company
                  </Label>
                  <Col sm="9" className="mt-sm-1">
                    <p>{partner?.company ? partner?.company : "-"}</p>
                  </Col>
                </Row>
                <Row className="mb-1">
                  <Label sm="2" for="address" className="add-form-header">
                    Status
                  </Label>

                  <Col sm="9" className="mt-sm-1">
                    <Badge
                      pill
                      color={partner?.is_active === 1 ? "light-success" : "light-warning"}
                      className="me-1"
                    >
                      {partner?.is_active === 1 ? "Active" : "Inactive"}
                    </Badge>
                  </Col>
                </Row>
                <Row className="mb-1">
                  <Label sm="2" for="agreement" disabled className="add-form-header">
                    Agreement
                  </Label>
                  <Col sm="9" className="mt-sm-1">
                    <p>{partner?.invitation_status === "accepted" ? "Signed" : "Pending"}</p>
                  </Col>
                </Row>
                <Row className="mb-1">
                  <Label sm="2" for="address" className="add-form-header">
                    Online
                  </Label>
                  <Col sm="9" className="mt-sm-1">
                    <p>{partner?.is_online === true ? "Yes" : "No"}</p>
                  </Col>
                </Row>
                <Row className="mb-1">
                  <Label sm="2" for="market" className="add-form-header">
                    Market
                  </Label>
                  <Col sm="9" className="mt-sm-1">
                    <p>
                      {filterCountry(partner?.countries)}
                      {/* {partner?.countries?.map((ele, i) => { return (filterCountry(ele.id)) })} */}
                    </p>
                  </Col>
                </Row>
              </Form>
            ) : (
              <ShimmerInvitemember />
            )}
          </CardBody>
        </Card>
        <Card className="bg-white">
          <CardBody className="p-0">
            <div className="">
              <CardHeader className="p-0">
                <CardTitle tag="h4" className="mx-2 mt-2">
                  Partner Member
                </CardTitle>
              </CardHeader>
              {!isMember ? (
                <Table responsive className="mt-1">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Role</th>
                      <th>Email Id</th>
                    </tr>
                  </thead>
                  <tbody>
                    {partnerUserList && partnerUserList?.length !== 0 ? (
                      partnerUserList.map((item, key) => {
                        return (
                          <tr key={key}>
                            <td>
                              {item?.first_name} &nbsp; {item?.last_name || null}
                            </td>
                            <td>{item?.detail?.designation}</td>
                            <td>{item?.email}</td>
                          </tr>
                        );
                      })
                    ) : (
                      <div className="no-data-found">
                        <NoDataFound message={"partner member"} bgWhite />
                      </div>
                    )}
                  </tbody>
                </Table>
              ) : (
                <ShimmerViwepartner />
              )}
              {partnerUserList && partnerUserList?.length !== 0 && (
                <Row className="align-items-center">
                  <Col sm="6">
                    {/* <ShimmerTitle line={1} className="w-40"> */}
                    <div className="d-flex align-items-center pagination-role">
                      <label htmlFor="rows-per-page">Show 1 To </label>
                      <Select
                        className="react-select mx-1"
                        classNamePrefix="select"
                        onChange={(e) => {
                          /*eslint-disable-next-line */
                          setPerPage(e.value), setPage(1);
                        }}
                        defaultValue={userPerPageOptions[0]}
                        options={userPerPageOptions}
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
            </div>
          </CardBody>
        </Card>
      </div>
    </>
  );
};

ViewPartnerMember.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
export default ViewPartnerMember;
