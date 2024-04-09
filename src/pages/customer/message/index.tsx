/*eslint-disable */
// ** Custom Components
import Avatar from "@components/avatar";
import { Icon } from "@iconify/react";

import Select from "react-select";
import ReactPaginate from "react-paginate";
import avatar from "@images/portrait/small/avatar-s-4.jpg";

// ** Third Party Components
import { Card, CardBody, Row, Col, CardHeader, Input } from "reactstrap";
import Link from "next/link";
import { MessageSquare } from "react-feather";
import { Helmet } from "react-helmet";
import { type ReactElement } from "react";
import Layout from "@components/layouts/Layout";
import type { NextPageWithLayout } from "@pages/_app";

const Message: NextPageWithLayout = () => {
  const temp = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  return (
    <>
      <Helmet>
        <title>Hipstr - Messages</title>
      </Helmet>
      <div className="main-role-ui">
        <div className="mb-2">
          <h2>Messages</h2>
        </div>
        <Card className="bg-white">
          <CardHeader>
            <div>
              <label>Showing 1 to 7 of 100 entries entries</label>
            </div>
            <div className="event-filter">
              <Input
                type="search"
                // isClearable={true}
                placeholder="Search"
                className="me-sm-1 my-0  custom-input"
              />
            </div>
          </CardHeader>
        </Card>
        <>
          <Row className="match-height">
            {temp.map((i) => {
              return (
                <Col xxl={4} xl={6} md={6} sm={6}>
                  <Card className="card-apply-job bg-white">
                    <CardHeader className="p-0 mx-2 mt-2 mb-75">
                      <div className="ticket sy-tx-primary f-900">
                        <span className="sy-tx-modal">Event ID:</span>#91716
                      </div>
                      <div className="sy-tx-modal">09 Feb 2020</div>
                    </CardHeader>
                    <CardBody>
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <div className="d-flex align-items-center">
                          <Avatar
                            className="me-1"
                            img={avatar}
                            // content={`${FirstUpperCase(item?.user?.first_name)}` + " " + `${FirstUpperCase(item?.user?.last_name)}`}
                            imgHeight={42}
                            imgWidth={42}
                            showOnlyInitials
                          />

                          <div>
                            <h5 className="mb-0 f-600">Myra Foster</h5>
                            <small className="text-muted">naifi@kavgapa.net</small>
                          </div>
                        </div>
                      </div>
                      <div className="event-content-customer">
                        <h6 className="sy-tx-grey">
                          Event City: <small className="sy-tx-modal">NewYork</small>
                        </h6>{" "}
                        <span className="border-left2 mx-1"></span>
                        <h6 className="sy-tx-grey">
                          Event State: <small className="sy-tx-modal">NewYork</small>
                        </h6>
                      </div>
                      <h6 className="sy-tx-grey">
                        Country: <small className="sy-tx-modal">United States</small>
                      </h6>
                      <h6 className="sy-tx-grey">
                        Package: <small className="sy-tx-modal">Hipstr Mosiac wall</small>
                      </h6>
                      <div className="d-flex justify-content-between">
                        <div className="d-flex">
                          <Icon
                            icon="akar-icons:circle-alert-fill"
                            color="#ff2725"
                            width="18"
                            className=""
                          />
                          <h6 className="sy-tx-alert mx-25">Data required to be fill</h6>
                        </div>{" "}
                        <div>
                          <Link href={`/customer/message/message-detail/${i}`}>
                            <span className="sy-tx-modal2 message">
                              <MessageSquare size={16} className="sy-tx-white" />
                            </span>
                          </Link>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                </Col>
              );
            })}
          </Row>
        </>
        <div className="mr-b-120">
          <div className="align-items-center d-flex justify-content-between flex-wrap">
            <div className="p-0">
              <div className="d-flex align-items-center pagination-role">
                <label htmlFor="rows-per-page">Show 1 To </label>
                <Select
                  id="rows-per-page"
                  className="react-select mx-1"
                  classNamePrefix="select"
                  dropdownPosition="top"
                />
                <label htmlFor="rows-per-page"> Per Page</label>
              </div>
            </div>
            <div className="pagination-role-n mt-1 d-flex justify-content-end">
              <ReactPaginate
                nextLabel=""
                // forcePage={page - 1}

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
        </div>
      </div>
    </>
  );
};

Message.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
export default Message;
