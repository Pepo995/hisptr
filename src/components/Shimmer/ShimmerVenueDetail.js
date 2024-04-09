import { ShimmerTitle } from "react-shimmer-effects";
import { CardBody, Card } from "reactstrap";

function ShimmerVenueDetail() {
  return (
    <>
      <Card className="card-apply-job bg-white">
        <ShimmerTitle line={1} className="w-30 mx-2 mt-1" />
        <CardBody>
          <ShimmerTitle line={1} className="w-30" variant="secondary" />
          <ShimmerTitle line={1} className="w-30" variant="secondary" />
          <ShimmerTitle line={1} className="w-30" variant="secondary" />
        </CardBody>
      </Card>
    </>
  );
}
export default ShimmerVenueDetail;
