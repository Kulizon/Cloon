import { useEffect, useContext } from "react";
import { SocketContext } from "../../../App";
import { useParams } from "react-router";

import styles from "./ChatBox.module.scss";

import ChatMessage from "./ChatMessage/ChatMessage";
import SendIcon from "./../../../assets/icons/Send";
import TextInput from "./../../UI/TextInput/TextInput";

interface Message {
  userID: string;
  message: string;
  id: string;
}

const ChatBox = (props: { className?: string; onNewMessage: (message: Message) => void; messages: Message[] }) => {
  const socket = useContext(SocketContext);
  const roomID: string = useParams().roomID!;

  const submitHandler = (e: React.SyntheticEvent<EventTarget>) => {
    e.preventDefault();
    const messageInput = (e.target as unknown as HTMLElement[])[0] as HTMLInputElement;
    if (!messageInput.value.trim()) return;
    const message: Message = {
      userID: socket.id,
      message: messageInput.value,
      id: Math.random().toString(),
    };
    props.onNewMessage(message);
    socket.emit("new-message", message, roomID);
    messageInput.value = "";
  };

  useEffect(() => {
    socket.on("new-message", (message: Message) => {
      props.onNewMessage(message);
    });

    return () => {
      socket.off("new-message");
    };
    // eslint-disable-next-line
  }, [socket]);

  return (
    <div className={styles.menu + " " + props.className}>
      <ul>
        {props.messages.map((m) => (
          <ChatMessage message={m.message} key={m.id} isUserMessage={m.userID === socket.id}></ChatMessage>
        ))}
      </ul>
      <form onSubmit={submitHandler}>
        <TextInput placeholder="Type your message..."></TextInput>
        <button>
          <SendIcon></SendIcon>
        </button>
      </form>
    </div>
  );
};

export default ChatBox;
