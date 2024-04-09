import {
  ShimmerButton,
  ShimmerText,
  ShimmerThumbnail,
  ShimmerTitle,
} from "react-shimmer-effects";
import { Card, CardBody } from "reactstrap";

function ShimmerViewBlog() {
  return (
    <>
      <div className="main-role-ui">
        <div className="d-flex justify-content-between">
          <div></div>

          <div className="d-flex">
            <ShimmerButton size="sm" />

            <ShimmerButton size="sm" />
          </div>
        </div>
        <div className="blog-card">
          <Card>
            <ShimmerThumbnail />
            <CardBody>
              <ShimmerTitle line={3} gap={10} variant="secondary" />
              <ShimmerText line={7} gap={10} />
              <Card>
                <ShimmerThumbnail className="w-40 mt-2 mx-5" />
                <ShimmerTitle line={3} gap={10} variant="secondary" />
              </Card>
            </CardBody>
          </Card>
        </div>
      </div>
    </>
  );
}

export default ShimmerViewBlog;
