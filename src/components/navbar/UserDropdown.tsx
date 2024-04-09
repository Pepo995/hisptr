// ** React Imports

// ** Custom Components
import Avatar from "@components/avatar";

// ** Third Party Components
import { Power, User } from "react-feather";

// ** Reactstrap Imports
import { DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from "reactstrap";

// ** Default Avatar Image
import { useDispatch } from "react-redux";
import { logoutApiCall } from "@redux/action/LoginAction";
import { getRouterPrefix } from "@utils/platformUtils";
import Link from "next/link";
import { useRouter } from "next/router";
import { api } from "@utils/api";
import { userImageUrl } from "@utils/userImageUrl";
import { FirstUpperCase } from "@utils/Utils";

const UserDropdown = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const logOutHandler = async () => {
    // eslint-disable-next-line @typescript-eslint/await-thenable, @typescript-eslint/no-explicit-any
    await dispatch(logoutApiCall(router) as unknown as any);
  };

  const { data: user, isLoading } = api.usersRouter.getUser.useQuery();

  if (isLoading || !user) {
    return null;
  }

  return (
    <UncontrolledDropdown tag="li" className="dropdown-user nav-item">
      <DropdownToggle
        href="/"
        tag="a"
        className="nav-link dropdown-user-link"
        onClick={(e) => e.preventDefault()}
      >
        <div className="user-nav d-sm-flex d-none">
          <span className="user-name fw-bold">
            {user.firstName} {user.lastName}
          </span>
          <span className="user-status">
            {FirstUpperCase(user.type)}
          </span>
        </div>
        <Avatar
          img={userImageUrl(user.picture)}
          imgHeight={40}
          imgWidth={40}
          content={
            `${FirstUpperCase(user.firstName)}` +
            " " +
            `${FirstUpperCase(user.lastName)}`
          }
          showOnlyInitials
        />
      </DropdownToggle>
      <DropdownMenu end>
        <DropdownItem
          tag={Link}
          href={`/${getRouterPrefix(user.type)}/my-account`}
          className="tw-flex tw-w-full"
        >
          <User size={14} className="me-75" />
          <span className="align-middle">Profile</span>
        </DropdownItem>
        <DropdownItem onClick={logOutHandler} className="tw-flex tw-w-full">
          <Power size={14} className="me-75" />
          <span className="align-middle">Logout</span>
        </DropdownItem>
      </DropdownMenu>
    </UncontrolledDropdown>
  );
};

export default UserDropdown;
