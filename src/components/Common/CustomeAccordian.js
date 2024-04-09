import React from "react";
import { ChevronDown, ChevronUp } from "react-feather";
import { NotificationReadAction } from "@redux/action/NotificationAction";
const { useState } = React;
import { useDispatch } from "react-redux";

const LongText = ({ content, limit, notification_id, setIsRead }) => {
  const [showAll, setShowAll] = useState(false);
  const dispatch = useDispatch();

  const readstatus = async () => {
    const data = new FormData();
    data.append("notification_id", notification_id);
    await dispatch(NotificationReadAction(data));
    setIsRead(notification_id);
  };
  const showMore = async () => {
    const data = new FormData();
    data.append("notification_id", notification_id);
    await dispatch(NotificationReadAction(data));
    setShowAll(true);
    setIsRead(notification_id);
  };

  const showLess = () => setShowAll(false);

  if (content.length <= limit) {
    // there is nothing more to show
    return <div onClick={readstatus}>{content}</div>;
  }
  if (showAll) {
    // We show the extended text and a Link href reduce it
    return (
      <div>
        {content}
        <ChevronUp onClick={showLess} role="button" />
        {/* <button onClick={showLess}>Read less</button>  */}
      </div>
    );
  }
  // In the final case, we show a text with ellipsis and a `Read more` button
  const toShow = content.substring(0, limit).concat("...");
  return (
    <div>
      {toShow}
      <ChevronDown onClick={showMore} role="button" />
      {/* <button >Read more</button> */}
    </div>
  );
};
export default LongText;
