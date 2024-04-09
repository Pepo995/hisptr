import { type ReactElement, useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import Layout from "@components/layouts/Layout";
import type { NextPageWithLayout } from "@pages/_app";
import { useRouter } from "next/router";
import { Spinner } from "reactstrap";
import { api } from "@utils/api";

const SuccessfullyAdded: NextPageWithLayout = () => {
  const router = useRouter();
  const [success, setSuccess] = useState<boolean | undefined>();

  const saveCardMutation = api.paymentRouter.saveCard.useMutation();
  const setupIntentId = router.query.setup_intent;

  useEffect(() => {
    async function storeSession() {
      if (typeof setupIntentId === "string") {
        try {
          const result = await saveCardMutation.mutateAsync({
            setupIntentId,
            email: "email1@mail.com",
          });
          setSuccess(!!result);
        } catch (error) {
          setSuccess(false);
        }
      }
    }
    void storeSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setupIntentId]);

  return (
    <>
      <Helmet>
        <title>Hipstr - Successfully added</title>
      </Helmet>
      {success === undefined ? (
        <Spinner />
      ) : success ? (
        "Successfully added card!"
      ) : (
        "Error adding card!"
      )}
    </>
  );
};

SuccessfullyAdded.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
export default SuccessfullyAdded;
