import { Card, CardBody, CardHeader, CardTitle, Label } from "reactstrap";
import Avatar from "@components/avatar";
import { FirstUpperCase, convertDate } from "@utils/Utils";
import ShimmerEventDetail from "@components/Shimmer/ShimmerEventDetail";
import moment from "moment";
import type { EventFromPhp } from "@types";
import { userImageUrl } from "@utils/userImageUrl";

type EventDetailProps = {
  event: EventFromPhp;
  isLoading: boolean;
};

const EventDetail = ({ event, isLoading }: EventDetailProps) => (
  <>
    {!isLoading ? (
      <div>
        <Card className="card-apply-job bg-white">
          <CardHeader className="p-0 mx-2 mt-2 mb-75">
            <CardTitle className="sy-tx-primary">Event Details</CardTitle>
          </CardHeader>
          <CardBody>
            <div className="d-flex justify-content-between align-items-center mb-1">
              <div className="d-flex align-items-center">
                {event.user?.picture ? (
                  <Avatar
                    className="me-1 cu-avatar"
                    img={userImageUrl(event.user?.picture)}
                    imgHeight={42}
                    imgWidth={42}
                    content={
                      `${FirstUpperCase(event.first_name)}` +
                      " " +
                      `${FirstUpperCase(event.last_name)}`
                    }
                    showOnlyInitials
                  />
                ) : (
                  <Avatar
                    className="me-1 cu-avatar"
                    content={
                      `${FirstUpperCase(event.first_name)}` +
                      " " +
                      `${FirstUpperCase(event.last_name)}`
                    }
                    imgHeight={42}
                    imgWidth={42}
                    showOnlyInitials
                  />
                )}

                <div>
                  <h5 className="mb-0 f-600">
                    {FirstUpperCase(event.first_name)} {FirstUpperCase(event.last_name)}
                  </h5>
                </div>
              </div>
              <p className="sy-tx-modal f-500 mb-0">
                Event ID: <span className="sy-tx-primary f-600">#{event.event_number}</span>
                <br />
                Availability ID:{" "}
                <span className="sy-tx-primary f-600">
                  {event.availability_id ? `#${event.availaility?.availability_number}` : "--"}
                </span>
              </p>
            </div>
            <div className="main-details d-flex justify-content-between flex-wrap">
              <div>
                <div className="d-flex">
                  <Label className="me-25">Type of event:</Label>
                  <p className="sy-tx-modal f-500">{event.type?.name ?? "--"}</p>
                </div>
                <div className="d-flex">
                  <Label className="me-25">Event Date:</Label>
                  <p className="sy-tx-modal f-500">{convertDate(event.event_date, 2)}</p>
                </div>
                <div className="d-flex">
                  <Label className="me-25">Location:</Label>
                  <p className="sy-tx-modal f-500">
                    {event.city && event.state ? `${event.city}, ${event.state.name}` : "--"}
                  </p>
                </div>
              </div>
              <div className="date-part-width">
                <div className="d-flex">
                  <Label className="me-25">Event Start Time:</Label>
                  <p className="sy-tx-modal f-500">
                    {" "}
                    {event.start_time
                      ? moment(event.start_time, "hh:mm:ss")?.format("hh:mm A")
                      : "--"}
                  </p>
                </div>
                <div className="d-flex">
                  <Label className="me-25">Event End Time:</Label>
                  <p className="sy-tx-modal f-500">
                    {event.end_time ? moment(event.end_time, "hh:mm:ss")?.format("hh:mm A") : "--"}
                  </p>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    ) : (
      <ShimmerEventDetail />
    )}
  </>
);
export default EventDetail;
