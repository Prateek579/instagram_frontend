import React, { useContext, useEffect, useRef, useState } from "react";
import "./message.css";
import io from "socket.io-client";
import storeContext from "../../context/store";
import Spinner from "../spinner/Spinner";
import { Howl } from "howler";
import notisound from "./notificationsound.mp3";
const ENDPOINT = process.env.REACT_APP_PORT_URI;
var socket;

const Message = () => {
  const context = useContext(storeContext);
  const { loginUserID, userToken, setSpinner } = context;

  const [profileDetails, setProfileDetails] = useState([]);
  const [messageDetails, setMessageDetails] = useState({
    personId: "",
    imagePath: "",
    userName: "",
  });
  const [displayMessages, setDisplayMessages] = useState(false);
  const [message, setMessage] = useState("");
  const [allMessages, setAllMessages] = useState([]);
  const [roomId, setRoomId] = useState("");
  const [active, setActive] = useState("");

  const containerRef = useRef(null);

  // fetching the chat history
  const fetchChatHistory = async (data) => {
    // set the data of user which want to fetch chat history
    setSpinner(true);
    setActive(data._id);
    setMessageDetails({
      personId: data._id,
      imagePath: data.photo,
      userName: data.name,
    });
    setDisplayMessages(true);
    // requesting to server for chat history
    const request = await fetch(
      `${process.env.REACT_APP_PORT_URI}/api/message/chathistory/${data._id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "auth-token": userToken,
        },
      }
    );
    const response = await request.json();
    if (response.success == true) {
      setSpinner(false);
      // set the response data
      setAllMessages(response.chatHistory[0].content);
      setRoomId(response.chatHistory[0].roomId);

      // joining the room
      socket.emit("join chat", response.chatHistory[0].roomId);
    } else {
      setSpinner(false);
      setAllMessages("");
    }
  };

  // sending a new message
  const handleSendMessage = async () => {
    const newMessage = {
      message: message,
      to: loginUserID,
    };
    // sending new message in the room
    socket.emit("new message", newMessage, roomId);
    playNotificationSound();
    setAllMessages((preMessage) => [...preMessage, newMessage]);
    const sendMessage = await fetch(
      `${process.env.REACT_APP_PORT_URI}/api/message/messagestart`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": userToken,
        },
        body: JSON.stringify({
          reciever: messageDetails.personId,
          message: message,
        }),
      }
    );
    const response = await sendMessage.json();
    setMessage("");
  };

  //playing notification sound
  const playNotificationSound = () => {
    const sound = new Howl({
      src: [notisound], // Replace with the path to your notification sound
    });
    sound.play();
  };

  useEffect(() => {
    socket = io(ENDPOINT, { transports: ["websocket"] });
    let isMounted = true;
    const fetchData = async () => {
      try {
        const request = await fetch(
          `${process.env.REACT_APP_PORT_URI}/api/user/allprofile`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const response = await request.json();
        const filterUserLogin = response.profiles.filter(
          (element) => element._id === loginUserID
        );

        const filteredProfiles = response.profiles.filter((element) =>
          filterUserLogin[0].following.includes(element._id)
        );

        if (isMounted) {
          setProfileDetails(filteredProfiles);
        }
      } catch (error) {
        console.error("Error fetching profiles:", error);
      }
    };

    fetchData();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    socket.on("message", (data) => {
      const newMessage = {
        message: data.message,
        sender: data.to,
      };
      playNotificationSound();
      setAllMessages((preMessage) => [...preMessage, newMessage]);
    });
  }, []);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [allMessages]);

  return (
    <>
      {/* // ALL USERS PROFILE SECITON */}
      <div className="message_container">
        <Spinner />
        <div className="message_contacts">
          {profileDetails.length === 0
            ? ""
            : profileDetails.map((item) => {
                return (
                  <div
                    className={`message_card ${
                      active === item._id && "active_background"
                    }`}
                    key={item._id}
                    onClick={() => fetchChatHistory(item)}
                  >
                    <div className="message_user_image">
                      <img src={`${item.photo}`} alt="message user image" />
                      <div className="message_user_details">
                        <p>{item.name}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
        </div>

        {/* SPECIFIC USER PROFILE SECTION */}
        {displayMessages ? (
          <div className="message_container_right">
            <div className="message_per">
              <div className="message_per_details">
                <img src={`${messageDetails.imagePath}`} alt="per image" />
                <p>{messageDetails.userName}</p>
              </div>
            </div>

            {/* MESSAGE SECTION */}
            <div className="message_content" ref={containerRef}>
              {allMessages.length === 0
                ? ""
                : allMessages.map((item) => {
                    return (
                      <div>
                        {item.sender === messageDetails.personId ? (
                          <div className="message_reciver message_modify">
                            <p className="message_modify">{item.message}</p>
                          </div>
                        ) : (
                          <div className="message_sender message_modify">
                            <p className="message_modify">{item.message}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
            </div>

            {/* INPUT SECTION */}
            <div className="message_input">
              <i className="fa-regular fa-face-smile"></i>
              <input
                type="text"
                id="messageinput"
                placeholder="Message..."
                onChange={(e) => setMessage(e.target.value)}
                value={message}
              />
              <i
                className="fa-regular fa-paper-plane"
                onClick={() => handleSendMessage()}
              ></i>
            </div>
          </div>
        ) : (
          ""
        )}
      </div>
    </>
  );
};

export default Message;
