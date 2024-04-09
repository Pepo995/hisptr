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
import { convertDate, decryptData, FirstUpperCase, shiftFirstObject } from "@utils/Utils";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { MESSAGE_REQUIRE } from "@constants/ToastMsgConstants";
import {
  customerTicketGetByIdApiCall,
  customerTicketReplyApiCall,
} from "@redux/action/SupportAction";
import { USER } from "@constants/CommonConstants";
import ShimmerChat from "@components/ShimmerPartner/ShimmerChat";
const ChatComponent = ({ id, permission, type }) => {
  const dispatch = useDispatch();
  const [message, setMessage] = useState(null);
  const [response, setResponse] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [loadImage, setLoadImage] = useState(false);
  /*eslint-disable-next-line */
  const [image, setImage] = useState(null);
  const [trails, setTrails] = useState([]);
  const UserId = decryptData(localStorage.getItem(USER));
  /**
   * It gets the chat details by id
   * @param id - The id of the ticket you want to get the details of.
   */
  const getChatDetails = async (id) => {
    setIsLoading(true);
    const res = await dispatch(customerTicketGetByIdApiCall(id));
    setResponse(res?.data?.data?.ticket);
    setTrails(res?.data?.data?.ticket?.trails);
    setIsLoading(false);
  };
  /**
   * It takes a message as an argument, and if the message is not empty, it sends the message to the
   * server and adds the response to the trails array
   * @param message - The message that the user is typing in the textarea.
   */
  const sendReply = async () => {
    if (message && (message !== "" || message !== null || message.length !== 0)) {
      const formData = new FormData();
      formData.append("ticket_id", response.id);
      formData.append("message", message);
      const res = await dispatch(customerTicketReplyApiCall(formData));
      if (res.status === 200) {
        document.getElementById("myInput").value = "";
        setMessage("");
        const newMsg = res?.data?.data?.ticket?.trails;
        setTrails([...trails, newMsg[newMsg.length - 1]]);
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
    const res = await dispatch(customerTicketReplyApiCall(formData));
    if (res.status === 200) {
      document.getElementById("myInput").value = "";
      setMessage("");
      setImage(null);
      const newMsg = res?.data?.data?.ticket?.trails;
      setTrails([...trails, newMsg[newMsg.length - 1]]);
    }
    setLoadImage(false);
  };
  /* A react hook that is used to perform side effects in function components. */
  useEffect(() => {
    getChatDetails(id);
  }, [id]);
  /* A function that is used to map the trails array and return the chat data. */
  const chatData =
    trails &&
    trails.length !== null &&
    shiftFirstObject(trails)?.map((item, key) => {
      return response.created_by === item.created_by ? (
        <div className="chat-box-2 p-2 w-75 mb-1" key={key}>
          <p className="sy-tx-black f-600 ">You</p>
          <a href={item?.image} target="_blank">
            <img src={item?.image} className="w-25 h-25 rounded mb-1" />
          </a>
          <p className="sy-tx-black">{item?.message}</p>
          <p className="text-end sy-tx-black">{convertDate(item?.created_at, 0)}</p>
        </div>
      ) : (
        <div className="chat-box p-2 mt-1 mb-1 w-75" key={key}>
          <p className="sy-tx-black f-600">Admin</p>
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
          <CardBody className="chat-card mt-2">
            <div id="chat-scroll">
              <div
                className={
                  response?.created_by === UserId
                    ? "chat-box-2 p-2 w-75 mb-1"
                    : "chat-box p-2 w-75 mb-1"
                }
              >
                {response?.images &&
                  response?.images?.length !== 0 &&
                  response?.images.map((item, i) => {
                    return (
                      <a key={i} href={item?.url} target="_blank">
                        <img src={item?.url} className="w-25 h-25 rounded mb-1" key={i} />
                      </a>
                    );
                  })}

                <p className="sy-tx-black f-600">
                  {FirstUpperCase(response?.user?.first_name)}{" "}
                  {FirstUpperCase(response?.user?.last_name)}
                </p>
                <p className="sy-tx-black">{response?.description}</p>

                {/* <p className="text-end sy-tx-black">{convertDate(response?.created_at, 0)}</p> */}
              </div>
              <div className="chat-box p-2 mt-1 mb-1 w-75">
                <p className="sy-tx-black">
                  Thank you for reaching out, this message is a confirmation that we’ve received
                  your Support Request.
                </p>
                <p className="sy-tx-black">
                  For reference, your request number is{" "}
                  <span className="sy-tx-black f-600">#{response?.ticket_number}.</span>{" "}
                </p>
                {/* <p className="sy-tx-black">You can expect the following response times from today’s date:</p>
                                <p className="sy-tx-black">- Event within two weeks: 1 - 2 business days </p>
                                <p className="sy-tx-black">- Event within 30 days: 3 - 5 business days</p>
                                <p className="sy-tx-black">- Event more than 30 days away - 7 - 10 business days</p> */}
                <p className="sy-tx-black">
                  Request responses will be prioritized first by closest Event Date then in the
                  order the request was received.
                </p>
                <p className="sy-tx-black">
                  Looking forward to assisting you as soon as we are able.
                </p>
                {/* <p className="text-end sy-tx-black">{convertDate(response?.created_at, 0)}</p> */}
              </div>
              {trails && trails.length !== 0 ? chatData : null}
            </div>
          </CardBody>
          <CardFooter className="p-0">
            {permission === true && (
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
                  disabled={response?.status === "close"}
                  onKeyDown={onKeyDownOfEnter}
                  onChange={(e) => setMessage(e.target.value)}
                />
                <InputGroupText className="chat-input-group">
                  <Button
                    className="custom-btn4"
                    type="reset"
                    onClick={sendReply}
                    disabled={response?.status === "close"}
                  >
                    {" "}
                    SEND
                  </Button>
                </InputGroupText>
              </InputGroup>
            )}
          </CardFooter>
        </Card>
      ) : (
        <ShimmerChat />
      )}
    </div>
  );
};

export default ChatComponent;
