import styles from "./ChatMessage.module.scss";

const ChatMessage = (props: { message: string; isUserMessage: boolean }) => {
  return (
    <li className={`${styles.message} ${props.isUserMessage ? styles["not-user"] : ""}`}>
      {!props.isUserMessage && <span>{!props.isUserMessage && "Guest"}</span>}
      <p>{props.message}</p>
    </li>
  );
};

export default ChatMessage;
