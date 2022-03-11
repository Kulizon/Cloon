import { useParams, useNavigate } from "react-router";
import { useContext, useEffect, useRef, useState, useCallback } from "react";
import { SocketContext } from "../../App";

import styles from "./Room.module.scss";

import ChatBox from "../../components/Room/ChatBox/ChatBox";
import ActivityMenu from "../../components/Room/ActivityMenu/ActivityMenu";
import TalkingBox from "../../components/Room/TalkingBox/TalkingBox";
import ActivityBox from "../../components/Room/ActivityBox/ActivityBox";

interface Message {
  userID: string;
  message: string;
  id: string;
}

const Room = () => {
  const socket = useContext(SocketContext);
  const navigate = useNavigate();
  const { roomID } = useParams();

  const currentRoomID = useRef("");
  const [selectedActivity, setSelectedActivity] = useState("");

  useEffect(() => {
    currentRoomID.current = roomID!;
  }, [roomID]);

  useEffect(() => {
    if (!roomID || !socket) {
      navigate("/");
      return;
    }

    socket.on("select-activity", (activity: string) => {
      setSelectedActivity(activity);
    });

    return () => {
      socket.emit("disconnect-user", currentRoomID.current);
    };
  }, [roomID, socket, navigate]);

  const [messages, setMessages] = useState<Message[]>([]);

  const addMessageHandler = useCallback((message: Message) => {
    setMessages((prevMessages) => [...prevMessages, message]);
  }, []);

  if (!socket) return <></>;
  
  return (
    <main
      className={`${styles.main} ${
        selectedActivity && selectedActivity !== "chat"
          ? styles.activity
          : selectedActivity === "chat"
          ? styles["chat-on"]
          : ""
      }`}
    >
      <ActivityMenu></ActivityMenu>
      <TalkingBox></TalkingBox>
      {selectedActivity && selectedActivity !== "chat" && (
        <>
          <ActivityBox activity={selectedActivity}></ActivityBox>
          <ChatBox onNewMessage={addMessageHandler} messages={messages}></ChatBox>
        </>
      )}
      {selectedActivity === "chat" && (
        <ChatBox className={styles.chat} onNewMessage={addMessageHandler} messages={messages}></ChatBox>
      )}
    </main>
  );
};

export default Room;
