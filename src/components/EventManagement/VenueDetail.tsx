import { Card, CardBody, CardHeader, CardTitle } from "reactstrap";
import ShimmerVenueDetail from "@components/Shimmer/ShimmerVenueDetail";
import { type EventFromPhp } from "@types";

type VenueDetailProps = {
  event: EventFromPhp;
  isLoading: boolean;
};

const VenueDetail = ({ event, isLoading }: VenueDetailProps) => (
  <>
    {!isLoading ? (
      <Card className="card-apply-job bg-white">
        <CardHeader className="p-0 mx-2 mt-2 mb-75">
          <CardTitle className="sy-tx-primary">Venue Details</CardTitle>
        </CardHeader>
        <CardBody>
          <p>
            Venue Name : <span className="sy-tx-modal f-500">{event.venue?.name ?? "--"} </span>
          </p>
          <p>
            Venue Address :{" "}
            <span className="sy-tx-modal f-500">
              {" "}
              {event.venue?.address_line_1 ?? "--"} {event.venue?.address_line_2}
            </span>
          </p>
          <p>
            Will elevator be available? :{" "}
            <span className="sy-tx-modal f-500">{event.venue?.is_elevator_available} </span>
          </p>
        </CardBody>
      </Card>
    ) : (
      <ShimmerVenueDetail />
    )}
  </>
);

export default VenueDetail;
