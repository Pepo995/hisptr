import AES from "crypto-js/aes";
import enc from "crypto-js/enc-utf8";

import { Config } from "@configs/Config";
import dayjs from "dayjs";
import { BEARER_TOKEN, USER_TYPE } from "@constants/CommonConstants";
import type { Module, UserType } from "@types";
import { type NextRouter } from "next/router";

export const encryptData = (data: string) => {
  return data && AES?.encrypt(data, Config.tokenEncr ?? "").toString();
};

export const decryptData = (data: string) => {
  const bytes = data && AES?.decrypt(data, Config.tokenEncr ?? "");
  const decryptedData = bytes?.toString(enc);
  return decryptedData;
};

export const encodeBase64 = (inputnToEncode: string | number | bigint) =>
  Buffer.from(inputnToEncode.toString()).toString("base64");

export const decodeBase64 = (inputBase64: string) =>
  Buffer.from(inputBase64, "base64").toString("ascii");

export const isUserLoggedIn = () => !!localStorage.getItem(BEARER_TOKEN);

export const convertDate = (date: string | Date | null, format: number) => {
  if (!date) return "";
  const formatArray = ["DD MMM, YYYY hh:mm a", "DD MMM YYYY", "MM/DD/YYYY", "YYYY-MM-DD"];
  if (typeof date === "string") {
    const day = dayjs(date);
    return day?.format(formatArray?.[format]);
  } else {
    return dayjs(date).format(formatArray?.[format]);
  }
};

export const onSearchHandler = (
  e: React.ChangeEvent<HTMLInputElement>,
  setSearch: React.Dispatch<React.SetStateAction<string>>,
  setPage: React.Dispatch<React.SetStateAction<number>>,
): void => {
  setTimeout(() => {
    setSearch(e.target.value);
    setPage(1);
  }, 1000);
};

export const perPageOptions = [
  { value: "10", label: "10" },
  { value: "25", label: "25" },
  { value: "50", label: "50" },
];

export const cardPerPageOptions = [
  { value: "9", label: "9" },
  { value: "18", label: "18" },
  { value: "27", label: "27" },
];

export const filterOptions = [
  { value: "1", label: "Active" },
  { value: "0", label: "Inactive" },
];

export const FirstUpperCase = (string: string) => {
  return string?.charAt(0)?.toUpperCase() + string?.slice(1);
};

export const TwoUpperCase = (string: string) => {
  return string?.charAt(0)?.toUpperCase() + string?.charAt(1)?.toUpperCase();
};

export const LastChar = (string: string) => {
  return string?.charAt(0)?.toUpperCase();
};
export const userPerPageOptions = [
  { value: "5", label: "5" },
  { value: "10", label: "10" },
  { value: "15", label: "15" },
];

export const perPageHandler = (
  e: { value: string },
  setPerPage: (perPage: number) => void,
  setPage: (page: number) => void,
) => {
  setPage(1);
  setPerPage(parseInt(e.value));
};

export const setFilterDropdown = <T,>(
  setData: React.Dispatch<React.SetStateAction<T | undefined>>,
  value: T | undefined,
) => setData(value);

export const StartingValue = (page: string, perPage: string) => {
  return (parseInt(page) - 1) * parseInt(perPage) + 1;
};

export const shiftFirstObject = (arr: unknown[]) => {
  return arr?.slice(1);
};

export const separateUserTrail = (
  arr: { created_by: unknown; is_read: number; ticket_id: number; id: number }[],
) => {
  const filterData = arr?.filter((e) => e.created_by === arr?.[0]?.created_by);
  const filterRead = filterData?.filter((e) => e.is_read === 0);
  return filterRead;
};

export const PushToFirstMenu = (
  arr: Module[],
  urlPrefix: string | undefined,
  router: NextRouter,
) => {
  const isSuperAdmin = decryptData(localStorage.getItem(USER_TYPE) ?? "") === "superadmin";

  if (isSuperAdmin) {
    const data = arr.sort(
      (a, b) =>
        (b?.display_order ?? 0) - (a?.display_order ?? 0) ||
        (a?.display_order ?? 0) - (b?.display_order ?? 0),
    );

    void router.replace(`/${urlPrefix}/${data?.[0]?.code}`);
  } else {
    const data = arr.sort(
      (a, b) =>
        (b?.module?.display_order ?? 0) - (a?.module?.display_order ?? 0) ||
        (a?.module?.display_order ?? 0) - (b?.module?.display_order ?? 0),
    );

    void router.replace(`/${urlPrefix}/${data?.[0]?.module?.code}`);
  }
};

// ** Returns K format from a number
export const kFormatter = (num: number) => (num > 999 ? `${(num / 1000).toFixed(1)}k` : num);

// ** Converts HTML to string
export const htmlToString = (html: string) => html.replace(/<\/?[^>]+(>|$)/g, "");

// ** Checks if the passed date is today
const isToday = (date: Date) => {
  const today = new Date();
  return (
    /* eslint-disable operator-linebreak */
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
    /* eslint-enable */
  );
};

export const formatDate = (
  value: string,
  formatting = {
    month: "short",
    day: "numeric",
    year: "numeric",
  } satisfies Intl.DateTimeFormatOptions,
) => {
  if (!value) return value;
  return new Intl.DateTimeFormat("en-US", formatting).format(new Date(value));
};

export const formatDateToMonthShort = (value: string, toTimeForCurrentDay = true) => {
  const date = new Date(value);
  let formatting: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
  };

  if (toTimeForCurrentDay && isToday(date)) {
    formatting = { hour: "numeric", minute: "numeric" };
  }

  return new Intl.DateTimeFormat("en-US", formatting).format(new Date(value));
};

/**
 ** Return if user is logged in
 ** This is completely up to you and how you want to store the token in your frontend application
 *  ? e.g. If you are using cookies to store the application please update this function
 */
export const getUserData = () => JSON.parse(localStorage.getItem("userData") ?? "{}") as unknown;

/**
 ** This function is used for demo purpose route navigation
 ** In real app you won't need this function because your app will navigate to same route for each users regardless of ability
 ** Please note role field is just for showing purpose it's not used by anything in frontend
 ** We are checking role just for ease
 * ? NOTE: If you have different pages to navigate based on user ability then this function can be useful. However, you need to update it.
 * @param {String} userRole Role of user
 */
export const getHomeRouteForLoggedInUser = (userRole: string) => {
  if (userRole === "admin") return "/";
  if (userRole === "client") return "/access-control";
  return "/signin";
};

// ** React Select Theme Colors
export const selectThemeColors = (theme: { colors: Record<string, string> }) => ({
  ...theme,
  colors: {
    ...theme.colors,
    primary25: "#7367f01a", // for option hover bg-color
    primary: "#7367f0", // for selected option bg-color
    neutral10: "#7367f0", // for tags bg-color
    neutral20: "#ededed", // for input border-color
    neutral30: "#ededed", // for input hover border-color
  },
});

export const getUserType = () => decryptData(localStorage.getItem(USER_TYPE) ?? "") as UserType;

export const formatPrice = (price: number) =>
  price.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

export const validateURL = (
  url: string,
): {
  url?: URL;
  isValid: boolean;
} => {
  if (!url) {
    return {
      isValid: false,
    };
  }

  try {
    const validURL = new URL(url);
    return {
      url: validURL,
      isValid: true,
    };
  } catch (error) {
    return {
      isValid: false,
    };
  }
};
