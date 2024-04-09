import { Card, CardBody, Col, Row } from "reactstrap";
import {
  ShimmerButton,
  ShimmerCategoryItem,
  ShimmerCircularImage,
  ShimmerThumbnail,
  ShimmerTitle,
} from "react-shimmer-effects";

function ShimmerChatbox() {
  return (
    <>
      <Row>
        <Col lg={4} xl={4}>
          <Card className="bg-white">
            <CardBody>
              <div className="d-flex">
                <ShimmerCircularImage size={50} />
                <ShimmerTitle
                  line={1}
                  gap={10}
                  variant="primary"
                  className="w-100 mt-1 mx-1"
                />
              </div>

              <ShimmerCategoryItem
                hasImage
                imageType="circular"
                imageWidth={50}
                imageHeight={50}
                title
              />
              <ShimmerCategoryItem
                hasImage
                imageType="circular"
                imageWidth={50}
                imageHeight={50}
                title
              />
              <ShimmerCategoryItem
                hasImage
                imageType="circular"
                imageWidth={50}
                imageHeight={50}
                title
              />
              <ShimmerCategoryItem
                hasImage
                imageType="circular"
                imageWidth={50}
                imageHeight={50}
                title
              />
              <ShimmerCategoryItem
                hasImage
                imageType="circular"
                imageWidth={50}
                imageHeight={50}
                title
              />
            </CardBody>
          </Card>
        </Col>
        <Col>
          <Card className="bg-white">
            <CardBody>
              <div className="d-flex">
                <ShimmerCircularImage size={50} />
                <ShimmerTitle
                  line={1}
                  gap={10}
                  variant="secondary"
                  className="w-20 mt-1 mx-1"
                />
              </div>
              <div className="d-flex">
                <ShimmerCircularImage size={30} />

                <ShimmerThumbnail
                  height={100}
                  width={300}
                  rounded
                  className="mx-1"
                />
              </div>
              <div className="d-flex justify-content-end">
                <ShimmerThumbnail
                  height={100}
                  width={300}
                  rounded
                  className="mx-1"
                />
                <ShimmerCircularImage size={30} />
              </div>
              <div className="d-flex">
                <ShimmerCircularImage size={30} />

                <ShimmerThumbnail
                  height={100}
                  width={300}
                  rounded
                  className="mx-1"
                />
              </div>
              <div className="d-flex">
                <ShimmerThumbnail
                  height={50}
                  width={577}
                  rounded
                  className="m-0"
                />
                <div className="ms-1 mb-0">
                  <ShimmerButton size="lg" className="mb-0" />
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </>
  );
}

export default ShimmerChatbox;
