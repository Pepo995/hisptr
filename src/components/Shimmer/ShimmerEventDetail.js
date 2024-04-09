import {
  ShimmerTitle,
  ShimmerButton,
  ShimmerThumbnail,
  ShimmerText,
  ShimmerCategoryItem,
} from "react-shimmer-effects";
import { Row, Col, CardBody, Card } from "reactstrap";

function ShimmerEventDetail() {
  return (
    <>
      <Card className="card-apply-job bg-white">
        <ShimmerTitle line={1} className="w-30 mx-2 mt-1" />
        <CardBody>
          <Row>
            <Col>
              <ShimmerCategoryItem
                hasImage
                imageType="circular"
                imageWidth={50}
                imageHeight={50}
                text
              />
              <hr />
              <ShimmerText
                line={5}
                gap={10}
                variant="secondary"
                className={"p-0 mx-2 mt-2 mb-75"}
              />
            </Col>
          </Row>
        </CardBody>
      </Card>

      <Card>
        <ShimmerTitle line={1} className="w-30 mx-2 mt-1" />
        <CardBody>
          <div className="d-flex align-items-end flex-wrap">
            <ShimmerThumbnail height={100} width={150} rounded /> &nbsp;
            <ShimmerButton size="sm" />
          </div>
        </CardBody>
      </Card>
    </>
  );
}
export default ShimmerEventDetail;
