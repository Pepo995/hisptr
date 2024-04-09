// ** React Imports
import { useContext, useEffect } from "react";

// ** Icons Imports
import { Disc, X, Circle } from "react-feather";

// ** Config
import themeConfig from "@configs/themeConfig";

// ** Utils
import { getUserData, getHomeRouteForLoggedInUser } from "@utils/Utils";
import ChartContext from "@utils/context/ChartContext";
import Link from "next/link";

const VerticalMenuHeader = (props) => {
  const { chartLoad, setChartLoad } = useContext(ChartContext);

  // ** Props
  const {
    menuCollapsed,
    setMenuCollapsed,
    setMenuVisibility,
    setGroupOpen,
    menuHover,
  } = props;

  // ** Vars
  const user = getUserData();

  // ** Reset open group
  useEffect(() => {
    if (!menuHover && menuCollapsed) setGroupOpen([]);
  }, [menuHover, menuCollapsed]);

  // ** Menu toggler component
  const Toggler = () => {
    if (!menuCollapsed) {
      return (
        <Disc
          size={20}
          data-tour="toggle-icon"
          className="text-primary toggle-icon d-none d-xl-block"
          onClick={() => {
            setMenuCollapsed(true);
            setChartLoad(!chartLoad);
          }}
        />
      );
    } else {
      return (
        <Circle
          size={20}
          data-tour="toggle-icon"
          className="text-primary toggle-icon d-none d-xl-block"
          onClick={() => {
            setMenuCollapsed(false);
            setChartLoad(!chartLoad);
          }}
        />
      );
    }
  };

  return (
    <div className="navbar-header">
      <ul className="nav navbar-nav flex-row">
        <li className="nav-item me-auto">
          <Link
            //   <NavLink
            href={user ? getHomeRouteForLoggedInUser(user.role) : "/"}
            className="navbar-brand"
          >
            <span className="brand-logo">
              <img src={themeConfig.app.appLogoImage.src} alt="logo" />
            </span>
            <h2 className="brand-text mb-0">{themeConfig.app.appName}</h2>
            {/* <img src={themeConfig.app.appLogoImage} alt='logo' className='img-fluid' /> */}
          </Link>
          {/* </NavLink> */}
        </li>
        <li className="nav-item nav-toggle">
          <div className="nav-link modern-nav-toggle cursor-pointer">
            <Toggler />
            <X
              onClick={() => setMenuVisibility(false)}
              className="toggle-icon icon-x d-block d-xl-none"
              size={20}
            />
          </div>
        </li>
      </ul>
    </div>
  );
};

export default VerticalMenuHeader;
