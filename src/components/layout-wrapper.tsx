// ** React Imports
import { Fragment, memo, useEffect } from "react";

// ** Third Party Components
import classnames from "classnames";

// ** Store & Actions
import { useDispatch, useSelector } from "react-redux";
import { handleContentWidth, handleMenuCollapsed, handleMenuHidden } from "@redux/layout";
import { type AppState } from "@types";

type LayoutWrapperProps = {
  children?: React.ReactNode;
  routeMeta?: {
    className: string;
    appLayout: string;
    contentWidth: number;
    menuCollapsed: string;
    menuHidden: string;
  };
};

const LayoutWrapper = ({ children, routeMeta }: LayoutWrapperProps) => {
  // ** Store Vars
  const dispatch = useDispatch();
  const store = useSelector((state: AppState) => state);

  const navbarStore = store.navbar;
  const layoutStored = store.layout.layout;
  const contentWidth = store.layout.contentWidth;
  const transition = store.layout.routerTransition;
  //** Vars
  const appLayoutCondition =
    (layoutStored === "horizontal" && !routeMeta) ||
    (layoutStored === "horizontal" && routeMeta && !routeMeta.appLayout);
  const Tag = appLayoutCondition ? "div" : Fragment;

  // ** Clean Up Function
  const cleanUp = () => {
    if (routeMeta) {
      if (routeMeta.contentWidth) {
        dispatch(handleContentWidth("full"));
      }
      if (routeMeta.menuCollapsed) {
        dispatch(handleMenuCollapsed(!routeMeta.menuCollapsed));
      }
      if (routeMeta.menuHidden) {
        dispatch(handleMenuHidden(!routeMeta.menuHidden));
      }
    }
  };

  // ** ComponentDidMount
  useEffect(() => {
    if (routeMeta) {
      if (routeMeta.contentWidth) {
        dispatch(handleContentWidth(routeMeta.contentWidth));
      }
      if (routeMeta.menuCollapsed) {
        dispatch(handleMenuCollapsed(routeMeta.menuCollapsed));
      }
      if (routeMeta.menuHidden) {
        dispatch(handleMenuHidden(routeMeta.menuHidden));
      }
    }
    return () => cleanUp();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routeMeta]);

  return (
    <div
      className={classnames("app-content content ", {
        [routeMeta ? routeMeta.className : ""]: routeMeta?.className,
        "show-overlay": navbarStore.query.length,
      })}
    >
      <div className="content-overlay"></div>
      <div className="header-navbar-shadow" />
      <div
        className={classnames({
          "content-wrapper": routeMeta && !routeMeta.appLayout,
          "content-area-wrapper": routeMeta?.appLayout,
          "container-xxl p-0": contentWidth === "boxed",
          [`animate__animated animate__${transition}`]: transition !== "none" && transition.length,
        })}
      >
        <Tag {...(appLayoutCondition ? { className: "content-body" } : {})}>{children}</Tag>
      </div>
    </div>
  );
};

export default memo(LayoutWrapper);
