import { ShimmerTitle } from "react-shimmer-effects";
import { Card, CardBody } from "reactstrap";

const ShimmerTicketHeader = () => {
  return (
    <Card>
      <ShimmerTitle line={1} className="w-20 mx-2 mt-1" variant="secondary" />
      <CardBody>
        <div className="d-flex">
          <ShimmerTitle line={1} className="w-10 me-1" variant="secondary" />
          <ShimmerTitle line={1} className="w-10 me-1" variant="secondary" />
        </div>
      </CardBody>
    </Card>
  );
};

export default ShimmerTicketHeader;
