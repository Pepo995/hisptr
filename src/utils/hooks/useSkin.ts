// ** React Imports
import { useEffect } from "react";

// ** Store Imports
import { handleSkin } from "@redux/layout";
import { useDispatch, useSelector } from "react-redux";
import { Skin } from "@types";

export const useSkin = () => {
  // ** Hooks
  const dispatch = useDispatch();
  const store: { skin: Skin } = useSelector(
    (state: { layout: { skin: Skin } }) => state.layout,
  );

  const setSkin = (type: { skin: Skin }) => {
    dispatch(handleSkin(type));
  };

  useEffect(() => {
    if (!(typeof window !== "undefined")) return;
    // ** Get Body Tag
    const element = window.document.body;

    // ** Define classnames for skins
    const classNames = {
      dark: "dark-layout",
      bordered: "bordered-layout",
      "semi-dark": "semi-dark-layout",
    };

    // ** Remove all classes from Body on mount
    element.classList.remove(...element.classList);

    // ** If skin is not light add skin class
    if (store?.skin !== Skin.Light) {
      element.classList.add(classNames[store?.skin]);
    }
  }, [store?.skin]);

  return { skin: store?.skin, setSkin };
};
