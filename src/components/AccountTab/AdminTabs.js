import React, { useState } from "react";
import { TabContent, TabPane, Nav, NavItem, NavLink } from "reactstrap";
import ChangePassword from "../authentication/ChangePassword";
import AdminProfile from "./AdminProfile";
import Breadcrumbs from "@components/breadcrumbs";
const Tabs = () => {
  const [active, setActive] = useState("1");

  /**
   * If the active tab is not the tab that was clicked, set the active tab to the tab that was clicked
   * @param tab - The tab that was clicked
   */
  const toggle = (tab) => {
    if (active !== tab) {
      setActive(tab);
    }
  };
  return (
    <div>
      <Breadcrumbs title="My Account" data={[{ title: "My Account" }]} />
      <React.Fragment>
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
            <AdminProfile />
          </TabPane>
          <TabPane tabId="2">
            <ChangePassword />
          </TabPane>
        </TabContent>
      </React.Fragment>
    </div>
  );
};
export default Tabs;
