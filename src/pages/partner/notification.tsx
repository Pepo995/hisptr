import { type Key, useEffect, useState } from "react";
import LongText from "@components/Common/CustomeAccordian";

import { useDispatch, useSelector } from "react-redux";
import { partnerNotificationListing } from "@redux/action/NotificationAction";
import { isMobile } from "react-device-detect";
import { Helmet } from "react-helmet";
import flatpickr from "flatpickr";
import { type ReactElement } from "react";
import Layout from "@components/layouts/Layout";
import type { NextPageWithLayout } from "@pages/_app";
import { type AnyAction } from "@reduxjs/toolkit";

const Notification: NextPageWithLayout = () => {
  const dates = new Date();
  const [IsRead, setIsRead] = useState();
  const dispatch = useDispatch();
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const notificationList = useSelector(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-explicit-any
    (state: any) => state.notificationReducer.notificationData,
  );
  /**
   * It returns the time if the date is the same as the current date, otherwise it returns the date
   * @param date - The date you want to format.
   * @returns The dategettime function is returning the date in the format of day-month-year and
   * hour:minute am/pm.
   */
  const dategettime = (date: string) => {
    const newdate = new Date(date);
    return flatpickr.formatDate(newdate, "d-M-Y") === flatpickr.formatDate(dates, "d-M-Y")
      ? flatpickr.formatDate(newdate, "h:i K")
      : flatpickr.formatDate(newdate, "d-M-Y");
  };
  /**
   * An async function that calls the partnerNotificationListing action creator.
   */
  const getnt = async () => {
    // eslint-disable-next-line @typescript-eslint/await-thenable
    await dispatch(
      partnerNotificationListing({ sort_order: "asc", sort_field: "id" }) as unknown as AnyAction,
    );
  };
  /* Calling the `getnt()` function whenever the `IsRead` or `setIsRead` changes. */
  useEffect(() => {
    void getnt();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [IsRead, setIsRead]);
  return (
    <>
      <Helmet>
        <title>Hipstr - Notifications</title>
      </Helmet>
      <h2 className="mb-2">Notifications</h2>
      {// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
      notificationList?.map(
        (
          e: {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            notification: { title: string | any[]; created_at: string; description: any };
            is_read: number;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            notification_id: any;
          },
          key: Key | null | undefined,
        ) => (
          <>
            <div className="notification" key={key}>
              <div className="d-flex justify-content-between flex-wrap">
                <h4 className=" f-15">{e?.notification?.title.slice(0, 50)}</h4>
                <p>{dategettime(e?.notification?.created_at)}</p>
              </div>
              <div className={` ${e.is_read === 0 ? "pending-notification" : ""}`}>
                <LongText
                  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                  content={e?.notification?.description}
                  limit={isMobile === true ? 30 : 200}
                  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                  notification_id={e.notification_id}
                  setIsRead={setIsRead}
                />
                <div className="pending-review"></div>
              </div>
            </div>
          </>
        ),
      )}
    </>
  );
};
Notification.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
export default Notification;
