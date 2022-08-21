import { useContext } from "react";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import { SocketContext } from "../../../App";

import styles from "./ActivityMenu.module.scss";

import FortuneWheelIcon from "../../../assets/icons/ActivityMenu/FortuneWheel";
// import PenIcon from "../../../assets/icons/ActivityMenu/Pen";
import ExitIcon from "../../../assets/icons/ActivityMenu/Exit";
import IconButton from "../../UI/IconButton/IconButton";
import ChatIcon from "../../../assets/icons/ActivityMenu/Chat";
import XMarkIcon from "../../../assets/icons/ActivityMenu/XMark";

const ActivityMenu = () => {
  const socket = useContext(SocketContext);
  const { roomID } = useParams();

  const selectActivityHandler = (e: any) => {
    e.preventDefault();
    const activity = e.nativeEvent.submitter.id;

    socket.emit("select-activity", activity, roomID);
  };

  return (
    <div className={styles.menu}>
      <form onSubmit={selectActivityHandler}>
        <IconButton id="">
          <XMarkIcon></XMarkIcon>
        </IconButton>
        <IconButton id="chat">
          <ChatIcon></ChatIcon>
        </IconButton>
        <IconButton id="wheel">
          <FortuneWheelIcon></FortuneWheelIcon>
        </IconButton>
        {/* <IconButton id="board">
          <PenIcon></PenIcon>
        </IconButton> */}
      </form>
      <div>
        <Link to="/">
          <IconButton>
            <ExitIcon></ExitIcon>
          </IconButton>
        </Link>
      </div>
    </div>
  );
};

export default ActivityMenu;
