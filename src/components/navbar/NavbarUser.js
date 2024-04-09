// ** Dropdowns Imports
import { getUserType } from "@utils/Utils";
import UserDropdown from "./UserDropdown";

import NotificationDropdown from "@components/navbar/NotificationDropdown";

const NavbarUser = () => {
  return (
    <ul className="nav navbar-nav align-items-center ms-auto">
      <NotificationDropdown />
      <UserDropdown />
    </ul>
  );
};
export default NavbarUser;
