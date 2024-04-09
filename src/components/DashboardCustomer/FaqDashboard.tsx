import Link from "next/link";
import { Card, CardBody } from "reactstrap";
import { env } from "~/env.mjs";

const FaqDashboard = () => {
  const url = env.NEXT_PUBLIC_FAQ_WEBFLOW_URL ?? "";
  return (
    <Card className="action-card bg-white ">
      <Link href={url} className="tw-h-full">
        <CardBody>
          <div className="d-flex justify-content-between sy-tx-modal">
            <div>
              <div className="card-title">FAQ</div>
              <div className="card-subtitle flex tw-items-center gap-1">
                Click here to view our frequently asked questions
              </div>
            </div>
          </div>
        </CardBody>
      </Link>
    </Card>
  );
};

export default FaqDashboard;
