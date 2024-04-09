import { type ReactElement, useEffect } from "react";
import { Helmet } from "react-helmet";
import Layout from "@components/layouts/Layout";
import type { NextPageWithLayout } from "@pages/_app";
import { useRouter } from "next/router";
import { api } from "@utils/api";

const SuccessfullyPaid: NextPageWithLayout = () => {
  const router = useRouter();

  const savePaymentMutation = api.paymentRouter.savePayment.useMutation();

  useEffect(() => {
    if (typeof router.query.payment_intent === "string") {
      savePaymentMutation.mutate({
        paymentId: router.query.payment_intent,
        email: "email1@mail.com",
        eventId: 1,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query.payment_intent]);

  return (
    <>
      <Helmet>
        <title>Hipstr - Successfully paid</title>
      </Helmet>
      <p>Successfully paid!</p>
    </>
  );
};

SuccessfullyPaid.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
export default SuccessfullyPaid;
