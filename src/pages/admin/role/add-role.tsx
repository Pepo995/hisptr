import { Fragment } from "react";
import { ArrowLeft } from "react-feather";
import { Card, CardHeader, CardTitle } from "reactstrap";
import Breadcrumbs from "@components/breadcrumbs";
import FormRole from "@components/roles/FormRole";
import { type ReactElement } from "react";
import Layout from "@components/layouts/Layout";
import type { NextPageWithLayout } from "@pages/_app";
import { Helmet } from "react-helmet";
import Link from "next/link";

const AddRole: NextPageWithLayout = () => {
  return (
    <>
      <Helmet>
        <title>Hipstr - Add Role</title>
      </Helmet>
      <div>
        <Fragment>
          <Breadcrumbs
            title="Roles and Permission"
            data={[
              { title: "Role Listing", link: "/admin/role" },
              { title: "Add Role" },
            ]}
          />
          <Card noBody className="bg-white">
            <CardHeader>
              <CardTitle tag="h4" className="back-arrow-h cursor-pointer">
                <Link href="/admin/role">
                  <ArrowLeft className="sy-tx-primary" />
                </Link>
                Add Role
              </CardTitle>
            </CardHeader>
            <div className="form-add-role">
              <FormRole />
            </div>
          </Card>
        </Fragment>
      </div>
    </>
  );
};
AddRole.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
export default AddRole;
