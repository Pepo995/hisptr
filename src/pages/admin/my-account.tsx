import { Helmet } from "react-helmet";
import Layout from "@components/layouts/Layout";
import Tabs from "@components/AccountTab/AdminTabs";
import { type NextPageWithLayout } from "@pages/_app";
import { type ReactElement } from "react";

const MyAccount: NextPageWithLayout = () => {
  return (
    <>
      <Helmet>
        <title>Hipstr - My Account - Admin</title>
      </Helmet>
      <Tabs />
    </>
  );
};

MyAccount.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
export default MyAccount;
