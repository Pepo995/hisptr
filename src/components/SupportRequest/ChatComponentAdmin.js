import { useEffect, useState } from "react";
import { Paperclip } from "react-feather";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Input,
  InputGroup,
  InputGroupText,
  Label,
  Spinner,
} from "reactstrap";
import Avatar from "@components/avatar";
import { convertDate, FirstUpperCase, shiftFirstObject } from "@utils/Utils";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { MESSAGE_REQUIRE } from "@constants/ToastMsgConstants";
import { ticketGetByIdApiCall, ticketReplyApiCall } from "@redux/action/SupportAction";
import ShimmerSupport from "@components/Shimmer/ShimmerSupport";

import { checkPermisson } from "@utils/platformUtils";

const ChatComponent = ({ id, type, isUpdate }) => {
  const dispatch = useDispatch();
  const [message, setMessage] = useState(null);
  const [response, setResponse] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [trails, setTrails] = useState([]);
  const [loadImage, setLoadImage] = useState(false);
  const editPermisson = checkPermisson("support-request");
  /**
   * It gets the chat details by id
   * @param id - The id of the ticket you want to get the details of.
   */
  const getChatDetails = async (id) => {
    const res = await dispatch(ticketGetByIdApiCall(id));
    setResponse(res?.data?.data?.ticket);
    setTrails(res?.data?.data?.ticket?.trails);
  };
  /**
   * It takes a message as an argument, and if the message is not empty, it sends the message to the
   * server and adds the response to the trails array
   * @param message - The message that the user is typing in the textarea.
   */
  const sendReply = async () => {
    if (message && (message !== "" || message !== null || message?.length !== 0)) {
      const formData = new FormData();
      formData.append("ticket_id", response.id);
      formData.append("message", message);

      const res = await dispatch(ticketReplyApiCall(formData));
      if (res.status === 200) {
        if (typeof window !== "undefined") {
          document.getElementById("myInput").value = "";
        }
        setMessage("");
        const newMsg = res?.data?.data?.ticket?.trails;
        setTrails([...trails, newMsg[newMsg?.length - 1]]);
      }
    } else {
      toast.error(MESSAGE_REQUIRE);
    }
  };
  const sendImage = async (e) => {
    setLoadImage(true);
    const formData = new FormData();
    formData.append("ticket_id", response.id);
    formData.append("image", e.target.files[0]);
    formData.append("message", "");
    const res = await dispatch(ticketReplyApiCall(formData));
    if (res.status === 200) {
      if (typeof window !== "undefined") {
        document.getElementById("myInput").value = "";
      }
      setMessage("");
      const newMsg = res?.data?.data?.ticket?.trails;
      setTrails([...trails, newMsg[newMsg?.length - 1]]);
    }
    setLoadImage(false);
  };
  /* A react hook that is used to perform side effects in function components. */
  useEffect(() => {
    setIsLoading(true);

    setIsLoading(false);
  }, [id]);
  /* A function that is used to map the trails array and return the chat data. */
  useEffect(() => {
    getChatDetails(id);
  }, [isUpdate]);
  const chatData =
    trails &&
    trails?.length !== null &&
    shiftFirstObject(trails)?.map((item, key) => {
      return response.created_by === item.created_by ? (
        <div className="chat-box p-2 w-75 mb-1" key={key}>
          {/*eslint-disable-next-line */}
          <p className="sy-tx-black f-600 ">
            {`${FirstUpperCase(response?.user?.first_name)}` +
              " " +
              `${FirstUpperCase(response?.user?.last_name)}` || "--"}
          </p>
          <a href={item?.image} target="_blank">
            <img src={item?.image} className="w-25 h-25 rounded mb-1" />
          </a>
          <p className="sy-tx-black">{item?.message}</p>
          <p className="text-end sy-tx-black">{convertDate(item?.created_at, 0)}</p>
        </div>
      ) : (
        <div className="chat-box-2 p-2 mt-1 mb-1 w-75" key={key}>
          <p className="sy-tx-black f-600">You</p>
          <a href={item?.image} target="_blank">
            <img src={item?.image} className="w-25 h-25 rounded mb-1" />
          </a>

          <p className="sy-tx-black">{item?.message}</p>
          <p className="text-end sy-tx-black">{convertDate(item?.created_at, 0)}</p>
        </div>
      );
    });
  const onKeyDownOfEnter = (event) => {
    if (event.keyCode === 13) {
      sendReply();
    }
  };

  return (
    <div>
      {!isLoading ? (
        <Card>
          <CardHeader className="ticket-header justify-content-start">
            {response?.user?.picture ? (
              <Avatar img={response?.user?.picture} />
            ) : (
              <Avatar
                color={`secondary`}
                /*eslint-disable-next-line */
                content={
                  `${FirstUpperCase(response?.user?.first_name)}` +
                    " " +
                    `${FirstUpperCase(response?.user?.last_name)}` || FirstUpperCase(type)
                }
                showOnlyInitials
              />
            )}
            {/*eslint-disable-next-line */}
            <span className="mx-1 sy-tx-white f-900">
              {`${FirstUpperCase(response?.user?.first_name)}` +
                " " +
                `${FirstUpperCase(response?.user?.last_name)}` || "--"}
            </span>
          </CardHeader>
          <CardBody className="chat-card pt-2 bg-white">
            <div id="chat-scroll">
              <div className="chat-box p-2 w-75 mb-1">
                {response?.images &&
                  response?.images?.length !== 0 &&
                  response?.images.map((item, i) => {
                    return (
                      <a key={i} href={item?.url} target="_blank">
                        <img src={item?.url} className="w-25 h-25 rounded mb-1 me-1" key={i} />
                      </a>
                    );
                  })}

                <p className="sy-tx-black f-600">
                  {FirstUpperCase(response?.user?.first_name)}{" "}
                  {FirstUpperCase(response?.user?.last_name)}
                </p>
                <p className="sy-tx-black">{response?.description}</p>

                <p className="text-end sy-tx-black">{convertDate(response?.created_at, 0)}</p>
              </div>
              {trails && trails?.length !== 0 ? chatData : null}
            </div>
          </CardBody>
          <CardFooter className="p-0">
            {editPermisson?.edit_access === 1 && (
              <InputGroup className="chat-box-footer">
                <InputGroupText className="chat-input-group">
                  <div className="me-25">
                    <div>
                      <Button
                        tag={Label}
                        className=" custom-btn-clip"
                        size="sm"
                        color="primary"
                        disabled={response?.status === "close"}
                      >
                        {!loadImage ? <Paperclip size={14} /> : <Spinner size="sm" />}
                        <Input
                          type="file"
                          onChange={sendImage}
                          hidden
                          accept="image/*"
                          disabled={response?.status === "close"}
                        />
                      </Button>
                    </div>
                  </div>
                </InputGroupText>
                <Input
                  id="myInput"
                  type="text"
                  placeholder="Type your message..."
                  className="chat-input"
                  onKeyDown={onKeyDownOfEnter}
                  onChange={(e) => setMessage(e.target.value)}
                  disabled={response?.status === "close"}
                ></Input>
                <InputGroupText className="chat-input-group">
                  <Button
                    className="custom-btn7"
                    type="reset"
                    onClick={sendReply}
                    disabled={response?.status === "close"}
                  >
                    SEND
                  </Button>
                </InputGroupText>
              </InputGroup>
            )}
          </CardFooter>
        </Card>
      ) : (
        <ShimmerSupport />
      )}
    </div>
  );
};

export default ChatComponent;
