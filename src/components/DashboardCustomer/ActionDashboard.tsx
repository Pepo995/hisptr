import React from "react";

import { Card, CardBody, CardTitle } from "reactstrap";
import { EVENT_STATUS } from "@constants/CommonConstants";
import Link from "next/link";
import { type events_admin_status } from "@prisma/client";

const ActionDashboard = ({
  event,
}: {
  event: { id: bigint; adminStatus: events_admin_status | null } | null;
}) => {
  return (
    <Card className="action-card bg-white">
      <CardBody>
        <CardTitle className="sy-tx-modal f-600 font2024 action-title">Action Required</CardTitle>
        {event?.adminStatus ? (
          <>
            {event?.adminStatus !== "serviced" ? (
              <>
                <Link
                  className="sy-tx-black action-msg fs14 f-300"
                  href={{
                    pathname: `/customer/event-management/upcoming-event/edit-event-detail/${event?.id}`,
                  }}
                >
                  {EVENT_STATUS.get(event?.adminStatus)?.label}
                </Link>
              </>
            ) : (
              <>
                <p className="sy-tx-black f-500">{event?.adminStatus}</p>
                <p className="sy-tx-black font1624 f-300">
                  Your Event has been serviced. We hope you enjoyed your event.
                </p>
              </>
            )}
          </>
        ) : (
          <p className="text-center sy-tx-modal font1624 f-500 mb-0 mt-3">No Data Found</p>
        )}
      </CardBody>
    </Card>
  );
};

export default ActionDashboard;
