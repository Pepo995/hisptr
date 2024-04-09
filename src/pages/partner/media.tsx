import { useState } from "react";
import { Nav, NavItem, NavLink, TabContent, TabPane } from "reactstrap";
import VideoList from "@components/FindVideo/Video";
import Resources from "@pages/admin/resource";
import Faq from "@components/Faq/Faq";
import { Helmet } from "react-helmet";
import { type ReactElement } from "react";
import Layout from "@components/layouts/Layout";
import type { NextPageWithLayout } from "@pages/_app";

const MediaList: NextPageWithLayout = () => {
  const [active, setActive] = useState("1");
  /**
   * If the active tab is not the tab that was clicked, set the active tab to the tab that was clicked
   */
  const toggle = (tab: string) => {
    if (active !== tab) {
      setActive(tab);
    }
  };

  return (
    <div className="nav-vertical">
      <Helmet>
        <title>Hipstr - Media</title>
      </Helmet>
      <Nav tabs className="nav-left">
        <NavItem>
          <NavLink
            active={active === "1"}
            onClick={() => {
              toggle("1");
            }}
          >
            Video
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            active={active === "2"}
            onClick={() => {
              toggle("2");
            }}
          >
            Resources
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            active={active === "3"}
            onClick={() => {
              toggle("3");
            }}
          >
            FAQs
          </NavLink>
        </NavItem>
      </Nav>
      <TabContent activeTab={active} className="tap-data">
        <TabPane className="tap-data" tabId="1">
          <VideoList />
        </TabPane>
        <TabPane className="tap-data" tabId="2">
          <Resources />
        </TabPane>
        <TabPane className="tap-data" tabId="3">
          <Faq />
        </TabPane>
      </TabContent>
    </div>
  );
};

MediaList.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
export default MediaList;
