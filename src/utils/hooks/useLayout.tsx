import { useDispatch, useSelector } from "react-redux";
import { handleLayout } from "@redux/layout";
import { type AppState } from "@types";

export const useLayout = () => {
  const dispatch = useDispatch();
  const store = useSelector((state: AppState) => state.layout);

  const setLayout = (value: string) => {
    dispatch(handleLayout(value));
  };

  if (window) {
    const breakpoint = 1200;

    if (window.innerWidth < breakpoint) {
      setLayout("vertical");
    }

    window.addEventListener("resize", () => {
      if (
        window.innerWidth <= breakpoint &&
        store?.lastLayout !== "vertical" &&
        store?.layout !== "vertical"
      ) {
        setLayout("vertical");
      }
      if (window.innerWidth >= breakpoint && store?.lastLayout !== store?.layout) {
        setLayout(store?.lastLayout);
      }
    });
  }

  return store?.layout;
};
