import { Card, CardBody, CardHeader, CardTitle } from "reactstrap";
import ShimmerEventDetail from "@components/Shimmer/ShimmerEventDetail";
import EventPayments from "./EventPayments";
import { event_payment_plan } from "@prisma/client";
import { formatPrice } from "@utils/Utils";
import type { EventForFrontend, StripePaymentForFrontend } from "@server/services/parsers";

type PaymentsOverlayProps = {
  isLoading: boolean;
  payments: StripePaymentForFrontend[];
  event: EventForFrontend;
};

const PaymentsOverlay = ({ payments, isLoading, event }: PaymentsOverlayProps) =>
  !isLoading ? (
    <div>
      <Card className="card-apply-job bg-white">
        <CardHeader className="p-0 mx-2 mt-2 mb-75">
          <CardTitle className="sy-tx-primary">Payment Details</CardTitle>
        </CardHeader>
        <CardBody>
          <p>
            Total:&nbsp;
            <span className="sy-tx-modal f-500">${formatPrice(event.totalPriceInCents / 100)}</span>
          </p>
          <p>
            Amount Paid:&nbsp;
            <span className="sy-tx-modal f-500">${formatPrice(event.amountPaidInCents / 100)}</span>
          </p>
          <p>
            Payment Method:&nbsp;
            <span className="sy-tx-modal f-500">
              {event.paymentPlan === event_payment_plan.full ? "Full Payment" : "Deposit"}
            </span>
          </p>
          <p>
            Promo code:&nbsp;
            <span className="sy-tx-modal f-500">
              {event.promotionalCodeCode && event.promotionalCodeDiscountInCents
                ? `${event.promotionalCodeCode} ($${formatPrice(
                    event.promotionalCodeDiscountInCents / 100,
                  )})`
                : "None"}
            </span>
          </p>
          <p>
            Fees:&nbsp;
            <span className="sy-tx-modal f-500">${formatPrice(event.stripeFeeInCents / 100)}</span>
          </p>
          <hr />
          <EventPayments payments={payments} />
        </CardBody>
      </Card>
    </div>
  ) : (
    <ShimmerEventDetail />
  );

export default PaymentsOverlay;
