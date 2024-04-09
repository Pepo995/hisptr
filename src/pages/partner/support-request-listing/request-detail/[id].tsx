import { useEffect, useState } from "react";
import Breadcrumbs from "@components/breadcrumbs";
import { Badge, Card, CardBody, CardHeader } from "reactstrap";

import { ArrowLeft, FileText } from "react-feather";
import Link from "next/link";
import { useRouter } from "next/router";
import { separateUserTrail } from "@utils/Utils";

import { useDispatch } from "react-redux";
import { customerTicketReadApiCall, ticketGetByIdApiCall } from "@redux/action/SupportAction";
import ChatComponent from "@components/SupportRequest/ChatComponentPartner";
import { PARTNER, TICKET_STATUS } from "@constants/CommonConstants";
import ShimmerTicketHeader from "@components/Shimmer/ShimmerTicketHeader";
import { Helmet } from "react-helmet";
import { type ReactElement } from "react";
import Layout from "@components/layouts/Layout";
import type { NextPageWithLayout } from "@pages/_app";
import { type AnyAction } from "@reduxjs/toolkit";

const TicketDetails: NextPageWithLayout = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<{
    title: string;
    ticket_number: number;
    status: string;
  }>();
  const ticketMarkAsRead = (
    trails: { created_by: unknown; is_read: number; ticket_id: number; id: number }[],
  ) => {
    setIsLoading(true);
    if (trails && trails?.length !== 0) {
      separateUserTrail(trails);
      separateUserTrail(trails)?.map(
        async (ele) =>
          // eslint-disable-next-line @typescript-eslint/await-thenable
          await dispatch(
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            customerTicketReadApiCall({
              id: ele.id,
              ticket_id: ele.ticket_id,
            }) as unknown as AnyAction,
          ),
      );
    }
  };
  const getTicketDetails = async (id: string) => {
    // eslint-disable-next-line @typescript-eslint/await-thenable
    const res = await dispatch(ticketGetByIdApiCall(id) as unknown as AnyAction);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
    ticketMarkAsRead(res?.data?.data?.ticket?.trails);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
    setResponse(res?.data?.data?.ticket);
    setIsLoading(false);
  };

  useEffect(() => {
    if (typeof router.query.id !== "string") {
      router.back();
    } else {
      void getTicketDetails(router.query.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
              link: "/partner/support-request-listing",
            },
            { title: "Support Details" },
          ]}
        />
        {!isLoading ? (
          <Card className="bg-white">
            <CardHeader>
              <div>
                <Link href="/partner/support-request-listing" className="primary">
                  <ArrowLeft />
                </Link>{" "}
                <label className="fw-bolder">{response?.title}</label>
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
        {router.query.id && <ChatComponent id={router.query.id} permission={true} type={PARTNER} />}
      </div>
    </>
  );
};
TicketDetails.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
export default TicketDetails;
