import { useEffect, useState } from "react";
import Breadcrumbs from "@components/breadcrumbs";
import { Badge, Card, CardBody, CardHeader } from "reactstrap";

import { ArrowLeft, FileText } from "react-feather";
import Link from "next/link";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import {
  customerTicketGetByIdApiCall,
  customerTicketReadApiCall,
} from "@redux/action/SupportAction";
import ChatComponent from "@components/SupportRequest/ChatComponentCustomer";
import { CUSTOMER, TICKET_STATUS } from "@constants/CommonConstants";
import ShimmerTicketHeader from "@components/Shimmer/ShimmerTicketHeader";
import { Helmet } from "react-helmet";
import { separateUserTrail } from "@utils/Utils";
import { type ReactElement } from "react";
import Layout from "@components/layouts/Layout";
import type { NextPageWithLayout } from "@pages/_app";

const TicketDetails: NextPageWithLayout = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState();

  const ticketMarkAsRead = async (trails) => {
    setIsLoading(true);
    if (trails && trails?.length !== 0) {
      separateUserTrail(trails)?.map(
        async (ele) =>
          await dispatch(customerTicketReadApiCall({ id: ele.id, ticket_id: ele.ticket_id })),
      );
    }
  };
  const getTicketDetails = async (id) => {
    // eslint-disable-next-line @typescript-eslint/await-thenable
    const res = await dispatch(customerTicketGetByIdApiCall(id) as unknown as AnyAction);
    setResponse(res?.data?.data?.ticket);
    ticketMarkAsRead(res?.data?.data?.ticket?.trails);
    setIsLoading(false);
  };

  useEffect(() => {
    if (router.query === undefined || router.query === "undefined") {
      router.back();
    } else if (router.query.id !== undefined) {
      getTicketDetails(router.query.id);
    }
  }, [router.query.id]);

  return (
    <>
      <Helmet>
        <title>Hipstr - Support Details</title>
      </Helmet>
      <div className="main-role-ui">
        <Breadcrumbs
          title="Support Request"
          data={[
            {
              title: "Support Request",
              link: "/customer/support-request-listing",
            },
            { title: "Support Details" },
          ]}
        />
        {!isLoading ? (
          <Card className="bg-white">
            <CardHeader>
              <div>
                <Link href="/customer/support-request-listing">
                  <ArrowLeft className="sy-tx-primary me-50" />
                </Link>
                <label>{response?.title}</label>
              </div>
            </CardHeader>
            <CardBody>
              <div className="d-flex align-items-baseline flex-wrap">
                <span className="sy-tx-primary f-900">Request Id: {response?.ticket_number}</span>{" "}
                &nbsp;| &nbsp;
                <Badge
                  color={
                    response?.status === "open" || response?.status === "close"
                      ? response?.status === "close"
                        ? "light-danger"
                        : "light-success"
                      : "light-warning"
                  }
                  pill
                >
                  <FileText size={15} />
                </Badge>
                <Badge
                  color={
                    response?.status === "open" || response?.status === "close"
                      ? response?.status === "close"
                        ? "light-danger"
                        : "light-success"
                      : "light-warning"
                  }
                  className="remove-bg-badge"
                  pill
                >
                  {TICKET_STATUS.get(response?.status)}
                </Badge>
              </div>
            </CardBody>
          </Card>
        ) : (
          <ShimmerTicketHeader />
        )}
        {router.query.id && (
          <ChatComponent id={router.query.id} permission={true} type={CUSTOMER} />
        )}
      </div>
    </>
  );
};
TicketDetails.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
export default TicketDetails;
