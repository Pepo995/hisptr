// ** React Imports
import { useEffect, useState } from "react";

// ** Store & Actions
import { useDispatch, useSelector } from "react-redux";
import { handleContentWidth, handleMenuCollapsed, handleMenuHidden } from "@redux/layout";

// ** Third Party Components
import classnames from "classnames";

// ** Reactstrap Imports
import { Navbar } from "reactstrap";

// ** Configs
import themeConfig from "@configs/themeConfig";

// ** Custom Components
import Customizer from "@components/customizer";
import ScrollToTop from "@components/ScrollToTop/ScrollToTop";
import FooterComponent from "@components/Footer";
import NavbarComponent from "@components/navbar";
import SidebarComponent from "@components/menu/vertical-menu";

// ** Custom Hooks
import { useRTL } from "@hooks/useRTL";
import { useSkin } from "@hooks/useSkin";
import { useNavbarType } from "@hooks/useNavbarType";
import { useFooterType } from "@hooks/useFooterType";
import { useNavbarColor } from "@hooks/useNavbarColor";

// ** Styles
import { useRouter } from "next/router";
import { UserType } from "@types";
import { decryptData } from "@utils/Utils";
import { USER_TYPE } from "@constants/CommonConstants";

const VerticalLayout = (props) => {
  // ** Props
  const {
    menu,
    navbar,
    footer,
    menuData,
    children,
    routerProps,
    setLastLayout,
    currentActiveItem,
  } = props;

  // ** Hooks
  const [isRtl, setIsRtl] = useRTL();
  const { skin, setSkin } = useSkin();
  const { navbarType, setNavbarType } = useNavbarType();
  const { footerType, setFooterType } = useFooterType();
  const { navbarColor, setNavbarColor } = useNavbarColor();

  // ** States
  const [isMounted, setIsMounted] = useState(false);
  const [menuVisibility, setMenuVisibility] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // ** Store Vars
  const dispatch = useDispatch();
  const layoutStore = useSelector((state) => state.layout);

  // ** Update Window Width
  const handleWindowWidth = () => {
    setWindowWidth(window.innerWidth);
  };

  // ** Vars
  const router = useRouter();
  const contentWidth = layoutStore.contentWidth;
  const menuCollapsed = layoutStore.menuCollapsed;
  const isHidden = layoutStore.menuHidden;

  // ** Toggles Menu Collapsed
  const setMenuCollapsed = (val) => dispatch(handleMenuCollapsed(val));

  // ** Handles Content Width
  const setContentWidth = (val) => dispatch(handleContentWidth(val));

  // ** Handles Content Width
  const setIsHidden = (val) => dispatch(handleMenuHidden(val));

  const userType = decryptData(localStorage.getItem(USER_TYPE) ?? "");

  //** This function will detect the Route Change and will hide the menu on menu item click
  useEffect(() => {
    if (menuVisibility && windowWidth < 1200) {
      setMenuVisibility(false);
    }
  }, [router.pathname]);

  //** Sets Window Size & Layout Props
  useEffect(() => {
    if (window !== undefined) {
      window.addEventListener("resize", handleWindowWidth);
    }
  }, [windowWidth]);

  //** ComponentDidMount
  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  // ** Vars
  const footerClasses = {
    static: "footer-static",
    sticky: "footer-fixed",
    hidden: "footer-hidden",
  };

  const navbarWrapperClasses = {
    floating: "navbar-floating",
    sticky: "navbar-sticky",
    static: "navbar-static",
    hidden: "navbar-hidden",
  };

  const navbarClasses = {
    floating: contentWidth === "boxed" ? "floating-nav" : "floating-nav",
    sticky: "fixed-top",
    static: "navbar-static-top",
    hidden: "d-none",
  };

  const bgColorCondition = navbarColor !== "" && navbarColor !== "light" && navbarColor !== "white";

  if (!isMounted) {
    return null;
  }

  return (
    <div
      className={classnames(
        `wrapper vertical-layout ${navbarWrapperClasses[navbarType] || "navbar-floating"} ${
          footerClasses[footerType] || "footer-static"
        }`,
        {
          // Modern Menu
          "vertical-menu-modern": windowWidth >= 1200,
          "menu-collapsed": menuCollapsed && windowWidth >= 1200,
          "menu-expanded": !menuCollapsed && windowWidth > 1200,

          // Overlay Menu
          "vertical-overlay-menu": windowWidth < 1200,
          "menu-hide": !menuVisibility && windowWidth < 1200,
          "menu-open": menuVisibility && windowWidth < 1200,
        },
      )}
      {...(isHidden ? { "data-col": "1-column" } : {})}
    >
      {!isHidden ? (
        <SidebarComponent
          skin={skin}
          menu={menu}
          menuData={menuData}
          routerProps={routerProps}
          menuCollapsed={menuCollapsed}
          menuVisibility={menuVisibility}
          setMenuCollapsed={setMenuCollapsed}
          setMenuVisibility={setMenuVisibility}
          currentActiveItem={currentActiveItem}
        />
      ) : null}

      <Navbar
        expand="lg"
        container={false}
        light={skin !== "dark"}
        dark={skin === "dark" || bgColorCondition}
        color={bgColorCondition ? navbarColor : undefined}
        className={classnames(
          `header-navbar navbar align-items-center ${
            navbarClasses[navbarType] || "floating-nav"
          } navbar-shadow`,
        )}
      >
        <div className="navbar-container d-flex content">
          {navbar ? (
            navbar
          ) : (
            <NavbarComponent setMenuVisibility={setMenuVisibility} skin={skin} setSkin={setSkin} />
          )}
        </div>
      </Navbar>
      {children}

      {/* Vertical Nav Menu Overlay */}
      <div
        className={classnames("sidenav-overlay", {
          show: menuVisibility,
        })}
        onClick={() => setMenuVisibility(false)}
      />
      {/* Vertical Nav Menu Overlay */}

      {themeConfig.layout.customizer === true ? (
        <Customizer
          contentWidth={contentWidth}
          footerType={footerType}
          isHidden={isHidden}
          isRtl={isRtl}
          layout={props.layout}
          menuCollapsed={menuCollapsed}
          navbarColor={navbarColor}
          navbarType={navbarType}
          setContentWidth={setContentWidth}
          setFooterType={setFooterType}
          setIsHidden={setIsHidden}
          setIsRtl={setIsRtl}
          setLastLayout={setLastLayout}
          setLayout={props.setLayout}
          setMenuCollapsed={setMenuCollapsed}
          setNavbarColor={setNavbarColor}
          setNavbarType={setNavbarType}
          setSkin={setSkin}
          setTransition={props.setTransition}
          skin={skin}
          themeConfig={themeConfig}
          transition={props.transition}
        />
      ) : null}

      {userType !== UserType.SUPER_ADMIN && (
        <footer
          className={classnames(
            `footer footer-light ${userType === UserType.CUSTOMER ? "d-none" : ""} ${
              footerClasses[footerType] || "footer-static"
            }`,
            {
              "d-none": footerType === "hidden",
            },
          )}
        >
          {footer ? (
            footer
          ) : (
            <FooterComponent footerType={footerType} footerClasses={footerClasses} />
          )}
        </footer>
      )}

      {themeConfig.layout.scrollTop === true ? (
        <div className="scroll-to-top">
          <ScrollToTop showOffset={300} className="scroll-top d-block" />
        </div>
      ) : null}
    </div>
  );
};

export default VerticalLayout;
