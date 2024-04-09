//imports from Packages
import { Fragment, useState } from "react";
import { Nav, NavItem, NavLink, TabContent, TabPane } from "reactstrap";
import ChangePassword from "@components/authentication/ChangePassword";
import Profile from "@components/AccountTab/ProfileCustomer";
import Breadcrumbs from "@components/breadcrumbs";
import { Helmet } from "react-helmet";
import { type ReactElement } from "react";
import Layout from "@components/layouts/Layout";
import type { NextPageWithLayout } from "@pages/_app";

const Tabs: NextPageWithLayout = () => {
  //States
  const [active, setActive] = useState("1");
  /**
   * If the active tab is not the tab that was clicked, set the active tab to the tab that was clicked
   * @param tab - The tab that was clicked
   */
  const toggle = (tab: string) => {
    if (active !== tab) {
      setActive(tab);
    }
  };
  return (
    <div className="main-role-ui">
      <Helmet>
        <title>Hipstr - My Account</title>
      </Helmet>
      <Breadcrumbs title="My Account" data={[{ title: "My Account" }]} />
      <Fragment>
        <Nav tabs>
          <NavItem>
            <NavLink
              active={active === "1"}
              onClick={() => {
                toggle("1");
              }}
            >
              General
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              active={active === "2"}
              onClick={() => {
                toggle("2");
              }}
            >
              Change Password
            </NavLink>
          </NavItem>
        </Nav>
        <TabContent className="py-50" activeTab={active}>
          <TabPane tabId="1">
            <Profile />
          </TabPane>
          <TabPane tabId="2">
            <ChangePassword />
          </TabPane>
        </TabContent>
      </Fragment>
    </div>
  );
};

Tabs.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Tabs;
