import { Helmet } from "react-helmet";
import Layout from "@components/layouts/Layout";
import Tabs from "@components/AccountTab/tab";
import { type NextPageWithLayout } from "@pages/_app";
import { type ReactElement } from "react";

const MyAccount: NextPageWithLayout = () => {
  return (
    <>
      <Helmet>
        <title>Hipstr - My Account - Partner</title>
      </Helmet>
      <Tabs />
    </>
  );
};

MyAccount.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
export default MyAccount;
