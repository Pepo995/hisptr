import { type ReactElement } from "react";
import Layout from "@components/layouts/Layout";
import type { NextPageWithLayout } from "@pages/_app";
import { useEffect, useState } from "react";
import { Badge, Card, CardBody, CardHeader, CardTitle, Col, Form, Label, Row } from "reactstrap";
import ReactPaginate from "react-paginate";
import Select from "react-select";
import { ArrowLeft } from "react-feather";
import ProfileImg from "@images/portrait/small/avatar.jpg";
import Event from "@components/Clientss/Event";
import Breadcrumbs from "@components/breadcrumbs";
import { perPageHandler } from "@utils/Utils";
import { eventListingApiCall } from "@redux/action/EventAction";
import { useDispatch } from "react-redux";
import { ShimmerEventCard } from "@components/Shimmer/ShimmerEventCard";
import NoDataFound from "@components/Common/NoDataFound";
import { Helmet } from "react-helmet";
import Link from "next/link";
import { useRouter } from "next/router";
import { type EventFromPhp, type GetCustomerAction, type GetEventsAction } from "@types";
import { type UserFromPhp } from "@types";
import { customerByIdApiCall } from "@redux/action/CustomerAction";
//States
const Num = [
  { value: "4", label: "4" },
  { value: "8", label: "8" },
  { value: "12", label: "12" },
];

const Detail: NextPageWithLayout = () => {
  const router = useRouter();
  const { id } = router.query;

  const [isLoading, setIsLoading] = useState(false);
  const [total, setTotal] = useState<number>(0);
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(4);
  const totalPage = Math.ceil(total / perPage);
  const [data, setData] = useState<UserFromPhp>();

  const [EventData, setEventData] = useState<EventFromPhp[]>([]);

  /**
   * A function that is used to get the customer details.
   * @param search - The search string to filter the results.
   * @param page - The page number of the results you want to get.
   * @param perPage - The number of items you want to show per page.
   */
  const getClient = async (page: number, perPage: number, id: string) => {
    setIsLoading(true);
    const Data = {
      id: id,
      type: "customer",
    };

    const res = await dispatch(customerByIdApiCall(Data) as unknown as GetCustomerAction);
    setData(res.data.data.user);
    const formData = new FormData();
    formData.append("page", page.toString());
    formData.append("per_page", perPage.toString());
    formData.append("client_id", id);
    const res_event = await dispatch(eventListingApiCall(formData) as unknown as GetEventsAction);
    setTotal(res_event.data.data.count);
    setEventData(res_event.data.data.events);
    setIsLoading(false);
  };
  /* A react hook that is called when the component is mounted. */
  useEffect(() => {
    if (typeof id !== "string") return;
    void getClient(page, perPage, id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, page, perPage]);

  return (
    <>
      <Helmet>
        <title>Hipstr - Customer Detail</title>
      </Helmet>
      <div>
        <Breadcrumbs
          title="Customer Management"
          data={[
            { title: "Customer Listing", link: "/admin/customer" },
            { title: "Customer Detail" },
          ]}
        />
        <Card className="bg-white">
          <CardBody>
            <Row>
              <Col sm={12}>
                <div className="d-flex align-items-center">
                  <Link href="/admin/customer">
                    <ArrowLeft />
                  </Link>{" "}
                  <p className="mb-0 ms-1">Client Details</p>
                </div>
              </Col>

              <Col sm={2}>
                {/* TODO: Use Next's <Image> when possible. Note: adding the following attributes and values after changing img for Image has worked in other cases:
                  <Image
                    className="img-fluid tw-inset-auto tw-w-auto tw-h-auto tw-static"
                    src={source}
                    alt="Login Cover"
                    fill
                  />
                */}
                {/*  eslint-disable-next-line @next/next/no-img-element  */}
                <img
                  className=" me-50"
                  src={data?.picture ? data?.picture.src : ProfileImg.src}
                  alt="Generic placeholder image"
                  height="100"
                  width="100"
                />
              </Col>
              <Col sm={8}>
                <Form>
                  <Row>
                    <Label sm="3" for="name" className="add-form-header">
                      First Name
                    </Label>
                    <Col sm="9" className="mt-sm-1">
                      <p>{data?.first_name}</p>
                    </Col>
                  </Row>
                  <Row>
                    <Label sm="3" for="name" className="add-form-header">
                      Last Name
                    </Label>
                    <Col sm="9" className="mt-sm-1">
                      <p>{data?.last_name}</p>
                    </Col>
                  </Row>
                  <Row>
                    <Label sm="3" for="Email" disabled className="add-form-header">
                      Email
                    </Label>
                    <Col sm="9" className="mt-sm-1">
                      <p>{data?.email}</p>
                    </Col>
                  </Row>
                  <Row>
                    <Label sm="3" for="Phone" className="add-form-header">
                      Phone
                    </Label>
                    <Col sm="9" className="mt-sm-1">
                      <p>{data?.phone_number}</p>
                    </Col>
                  </Row>
                  <Row>
                    <Label sm="3" for="address" className="add-form-header">
                      Status
                    </Label>
                    <Col sm="9" className="mt-sm-1">
                      {data?.is_online ? (
                        <Badge pill color="light-success" className="me-1">
                          Online
                        </Badge>
                      ) : (
                        <Badge pill color="light-warning" className="me-1">
                          Offline
                        </Badge>
                      )}
                    </Col>
                  </Row>
                </Form>
              </Col>
            </Row>
          </CardBody>
        </Card>
        <Card className="bg-white">
          <CardBody>
            <CardHeader className="p-0 mb-1">
              <CardTitle tag="h4" className="back-arrow-h">
                Client Events
              </CardTitle>
            </CardHeader>

            {!isLoading ? (
              <div>
                {EventData?.[0] ? (
                  <Row>
                    {EventData?.map((event) => (
                      <Col sm={6} key={event.id}>
                        <Event
                          eventname={event?.type?.name ? event?.type?.name : "-"}
                          eventdate={event?.event_date ? event?.event_date : "-"}
                          eventpackage={event?.package?.title ? event?.package?.title : "-"}
                          eventvenue={event?.venue?.city ?? "-"}
                          eventstatus={event?.status ?? "-"}
                        />
                      </Col>
                    ))}
                  </Row>
                ) : (
                  <NoDataFound message={"event"} />
                )}
              </div>
            ) : (
              <ShimmerEventCard />
            )}

            {EventData?.length !== 0 && (
              <div className="d-flex justify-content-between">
                <div className="d-flex align-items-center pagination-role m-0">
                  <label htmlFor="rows-per-page">Show 1 To </label>
                  <Select
                    isSearchable={false}
                    id="rows-per-page"
                    className="react-select mx-1"
                    classNamePrefix="select"
                    defaultValue={Num[0]}
                    options={Num}
                    onChange={(e) => perPageHandler(e ?? Num[0], setPerPage, setPage)}
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
Detail.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
export default Detail;
