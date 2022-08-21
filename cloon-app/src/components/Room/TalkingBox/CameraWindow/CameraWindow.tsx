import { useEffect, useRef, useState } from "react";

import styles from "./CameraWindow.module.scss";

import IconButton from "../../../UI/IconButton/IconButton";
import OptionsIcon from "../../../../assets/icons/Options";
import MiniMenu from "../../../UI/MiniMenu/MiniMenu";
import MicOffIcon from "../../../../assets/icons/Controls/MicOff";
import MicOnIcon from "../../../../assets/icons/Controls/MicOn";
import CamOffIcon from "../../../../assets/icons/Controls/CamOff";
import CamOnIcon from "../../../../assets/icons/Controls/CamOn";

const CameraWindow = (props: {
  stream: MediaStream | undefined;
  muted?: boolean;
  isVideoHidden: boolean;
  hiddenOptions?: boolean;
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!videoRef.current || !props.stream) return;

    videoRef.current.srcObject = props.stream;
  }, [props.stream, videoRef]);

  const [isMicOn, setIsMicOn] = useState(true);
  const [isCamOn, setIsCamOn] = useState(true);

  const turnMicOnHandler = () => {
    setIsMicOn(true);
  };

  const turnMicOffHandler = () => {
    setIsMicOn(false);
  };

  const turnCamOnHandler = () => {
    setIsCamOn(true);
  };

  const turnCamOffHandler = () => {
    setIsCamOn(false);
  };

  return (
    <div className={styles["window"]}>
      {(!isCamOn || props.isVideoHidden) && <h3>Camera is hidden.</h3>}
      <video
        muted={props.muted || !isMicOn}
        ref={videoRef}
        onLoadedMetadata={() => {
          videoRef.current?.play();
        }}
        className={!isCamOn || props.isVideoHidden ? styles.hidden : ""}
      ></video>

      {!props.hiddenOptions && (
        <MiniMenu activateButtonContent={<OptionsIcon></OptionsIcon>}>
          <div>
            {isMicOn ? (
              <IconButton onClick={turnMicOffHandler}>
                <MicOnIcon></MicOnIcon>
              </IconButton>
            ) : (
              <IconButton onClick={turnMicOnHandler}>
                <MicOffIcon></MicOffIcon>
              </IconButton>
            )}
            {isCamOn ? (
              <IconButton onClick={turnCamOffHandler}>
                <CamOnIcon></CamOnIcon>
              </IconButton>
            ) : (
              <IconButton onClick={turnCamOnHandler}>
                <CamOffIcon></CamOffIcon>
              </IconButton>
            )}
          </div>
        </MiniMenu>
      )}
    </div>
  );
};

export default CameraWindow;
