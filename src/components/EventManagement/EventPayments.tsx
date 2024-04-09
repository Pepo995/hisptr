import { StripePaymentEnum } from "@prisma/client";
import { type StripePaymentForFrontend } from "@server/services/parsers";

type EventPaymentsProps = {
  payments: StripePaymentForFrontend[];
};

const EventPayments = ({ payments }: EventPaymentsProps) => (
  <>
    <h3 className="form-label tw-text-lg">Payments</h3>
    {payments.length ? (
      payments.map((payment) => (
        <div className="tw-flex tw-mb-2 tw-w-full" key={payment.paymentId}>
          <div className="tw-w-1/2">
            <b>Payment ID:</b> {payment.paymentId}
          </div>
          <div>
            <b>Payment Status:&nbsp;</b>
            <span
              className={`tw-p-1 tw-rounded ${
                payment.paymentStatus === StripePaymentEnum.succeeded
                  ? "tw-bg-green-200 tw-border-green-500 tw-border"
                  : payment.paymentStatus === StripePaymentEnum.canceled
                  ? "tw-bg-red-300 tw-border-red-600 tw-border tw-text-white"
                  : payment.paymentStatus === StripePaymentEnum.requires_capture
                  ? "tw-bg-yellow-200 tw-border-yellow-700 tw-border"
                  : ""
              }`}
            >
              {payment.paymentStatus}
            </span>
          </div>
        </div>
      ))
    ) : (
      <p>No payments yet</p>
    )}
  </>
);

export default EventPayments;
