import VerticalNavMenuLink from "./VerticalNavMenuLink";
import VerticalNavMenuGroup from "./VerticalNavMenuGroup";
import VerticalNavMenuSectionHeader from "./VerticalNavMenuSectionHeader";
import { resolveVerticalNavMenuItemComponent as resolveNavItemComponent } from "@components/layouts/layouts/utils";

const VerticalNavMenuItems = (props) => {
  const Components = {
    VerticalNavMenuLink,
    VerticalNavMenuGroup,
    VerticalNavMenuSectionHeader,
  };

  // ** Render Nav Menu Items
  const RenderNavItems = props.items?.map((item, index) => {
    const TagName = Components[resolveNavItemComponent(item)];
    if (item.children) {
      return <TagName item={item} index={index} key={item.id} {...props} />;
    }
    return <TagName key={item.id || item.header} item={item} {...props} />;
  });

  return RenderNavItems;
};

export default VerticalNavMenuItems;
