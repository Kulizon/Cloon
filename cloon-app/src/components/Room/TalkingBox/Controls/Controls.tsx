import { useParams } from "react-router";
import { useContext, useState } from "react";
import { SocketContext } from "../../../../App";

import styles from "./Controls.module.scss";

import IconButton from "../../../UI/IconButton/IconButton";
import CamOffIcon from "../../../../assets/icons/Controls/CamOff";
import CamOnIcon from "../../../../assets/icons/Controls/CamOn";
import MicOffIcon from "../../../../assets/icons/Controls/MicOff";
import MicOnIcon from "../../../../assets/icons/Controls/MicOn";

const Controls = (props: { userStream: MediaStream | undefined }) => {
  const { roomID } = useParams();
  const socket = useContext(SocketContext);

  const [isMicOn, setIsMicOn] = useState(true);
  const [isCamOn, setIsCamOn] = useState(true);

  const turnMicOnHandler = () => {
    setIsMicOn(true);
    socket.emit("unmute-mic", roomID);
  };

  const turnMicOffHandler = () => {
    setIsMicOn(false);
    socket.emit("mute-mic", roomID);
  };

  const turnCamOnHandler = () => {
    setIsCamOn(true);
    socket.emit("unmute-cam", roomID);
  };

  const turnCamOffHandler = () => {
    setIsCamOn(false);
    socket.emit("mute-cam", roomID);
  };

  return (
    <div className={styles.controls}>
      <h2>
        Room: <br></br>
        <span>{roomID}</span>
      </h2>
      <div>
        {isMicOn ? (
          <IconButton onClick={turnMicOffHandler} highlighted>
            <MicOnIcon></MicOnIcon>
          </IconButton>
        ) : (
          <IconButton onClick={turnMicOnHandler} highlighted>
            <MicOffIcon></MicOffIcon>
          </IconButton>
        )}
        {isCamOn ? (
          <IconButton onClick={turnCamOffHandler} highlighted>
            <CamOnIcon></CamOnIcon>
          </IconButton>
        ) : (
          <IconButton onClick={turnCamOnHandler} highlighted>
            <CamOffIcon></CamOffIcon>
          </IconButton>
        )}
      </div>
    </div>
  );
};

export default Controls;
