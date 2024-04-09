import { useEffect, useState } from "react";
import Breadcrumbs from "@components/breadcrumbs";
import { Badge, Card, CardBody, CardHeader } from "reactstrap";
import Select from "react-select";
import { ArrowLeft, FileText } from "react-feather";
import { separateUserTrail } from "@utils/Utils";

import {
  OptionComponent,
  checkPermisson,
  ticketStatusInprogress,
  ticketStatusOpen,
  ticketStatusOption,
} from "@utils/platformUtils";
import { useDispatch } from "react-redux";
import {
  ticketGetByIdApiCall,
  adminTicketReadApiCall,
  ticketStatusUpdateApiCall,
} from "@redux/action/SupportAction";
import ChatComponent from "@components/SupportRequest/ChatComponentAdmin";
import { CUSTOMER } from "@constants/CommonConstants";
import ShimmerTicketHeader from "@components/Shimmer/ShimmerTicketHeader";
import { Helmet } from "react-helmet";
import { useRouter } from "next/router";
import Link from "next/link";
import { type ReactElement } from "react";
import Layout from "@components/layouts/Layout";
import type { NextPageWithLayout } from "@pages/_app";

const ClientTicketDetails: NextPageWithLayout = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState();
  const [isUpdate, setIsUpdate] = useState(false);
  const updatePermisson = checkPermisson("support-request");

  /**
   * It fetches the ticket details from the API and sets the response to the state
   * @param id - The id of the ticket you want to get the details of.
   */
  const getTicketDetails = async (id) => {
    // eslint-disable-next-line @typescript-eslint/await-thenable
    const res = await dispatch(ticketGetByIdApiCall(id) as unknown as AnyAction);
    setResponse(res.data.data.ticket);
    separateUserTrail(res?.data?.data?.ticket?.trails)?.map((ele) =>
      dispatch(adminTicketReadApiCall({ id: ele.id, ticket_id: ele.ticket_id })),
    );
  };

  /* Checking if the location state is undefined or not. If it is undefined, it will go back to the
  previous page. If it is not undefined, it will call the getTicketDetails function. */
  useEffect(() => {
    if (router.query === undefined) {
      router.back();
    } else if (router.query.id !== undefined) {
      setIsLoading(true);
      void getTicketDetails(router.query.id);
      setIsLoading(false);
    }
  }, [router.query.id]);

  /**
   * It takes the value of the dropdown and sends it to the backend to update the status of the ticket
   * @param e - The event object
   */
  const onStatusChangeHandler = async (e) => {
    const data = {
      id: router.query.id,
      status: e.value,
    };
    dispatch(ticketStatusUpdateApiCall(data));
    getTicketDetails(router.query.id);
    setIsUpdate(!isUpdate);
  };
  return (
    <>
      <Helmet>
        <title>Hipstr - Request Details</title>
      </Helmet>
      <div>
        <Breadcrumbs
          title="Support Request"
          data={[
            { title: "Support Request" },
            {
              title: "Client Support Request",
              link: "/admin/client-support-request",
            },
            { title: "Request Details" },
          ]}
        />
        {!isLoading ? (
          <>
            {" "}
            <Card className="bg-white">
              <CardHeader>
                <div>
                  <Link href="/admin/client-support-request">
                    <ArrowLeft className="sy-tx-primary me-50" />
                  </Link>
                  <label className="fw-bolder">{response?.title}</label>
                </div>
              </CardHeader>
              <CardBody>
                <div className="d-flex align-items-baseline flex-wrap">
                  <span className="sy-tx-primary f-900">Request Id: {response?.ticket_number}</span>
                  &nbsp;|&nbsp;
                  {response?.status === "open" && (
                    <Select
                      className="react-select status-select mx-sm-2 "
                      classNamePrefix="select"
                      options={ticketStatusOpen}
                      defaultValue={
                        ticketStatusOption[0]?.options?.filter(
                          (e) => e.value === response?.status,
                        )?.[0] ||
                        ticketStatusOpen[0]?.options?.filter(
                          (e) => e.value === response?.status,
                        )?.[0]
                      }
                      onChange={(e) => onStatusChangeHandler(e)}
                      isDisabled={updatePermisson?.edit_access === 0}
                      placeholder="Select Status"
                      components={{
                        Option: OptionComponent,
                      }}
                      isSearchable={false}
                      getOptionLabel={(data) => (
                        <div className="select-option">
                          <Badge color={data.color} className="me-50" pill>
                            <FileText size={14} />
                          </Badge>
                          <Badge color={data.color} pill>
                            {data.label}
                          </Badge>
                        </div>
                      )}
                    />
                  )}
                  {response?.status === "inprogress" && (
                    <Select
                      className="react-select status-select mx-sm-2 "
                      classNamePrefix="select"
                      options={ticketStatusInprogress}
                      defaultValue={
                        ticketStatusOption[0]?.options?.filter(
                          (e) => e.value === response?.status,
                        )?.[0] ||
                        ticketStatusInprogress[0]?.options?.filter(
                          (e) => e.value === response?.status,
                        )?.[0]
                      }
                      onChange={(e) => onStatusChangeHandler(e)}
                      isDisabled={updatePermisson?.edit_access === 0}
                      placeholder="Select Status"
                      components={{
                        Option: OptionComponent,
                      }}
                      isSearchable={false}
                      getOptionLabel={(data) => (
                        <div className="select-option">
                          <Badge color={data.color} className="me-50" pill>
                            <FileText size={14} />
                          </Badge>
                          <Badge color={data.color} pill>
                            {data.label}
                          </Badge>
                        </div>
                      )}
                    />
                  )}
                  {response?.status === "close" && (
                    <>
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
                        {response?.status}
                      </Badge>
                    </>
                  )}
                </div>
              </CardBody>
            </Card>
          </>
        ) : (
          <ShimmerTicketHeader />
        )}

        {router.query.id && (
          <ChatComponent
            id={router.query.id}
            permission={true}
            type={CUSTOMER}
            isUpdate={isUpdate}
          />
        )}
      </div>
    </>
  );
};
ClientTicketDetails.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
export default ClientTicketDetails;
