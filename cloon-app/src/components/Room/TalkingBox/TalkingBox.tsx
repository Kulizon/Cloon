import { useEffect, useState, useContext } from "react";
import { SocketContext, StreamContext } from "../../../App";
import { peer } from "../../../App";

import styles from "./TalkingBox.module.scss";

import CameraWindow from "./CameraWindow/CameraWindow";
import Controls from "./Controls/Controls";

const TalkingBox = () => {
  const socket = useContext(SocketContext);
  const userStream = useContext(StreamContext);
  const [callerStream, setCallerStream] = useState<MediaStream | undefined>();

  const [callerPeer, setCallerPeer] = useState<any>();

  const [isCallerMicOn, setIsCallerMicOn] = useState(true);
  const [isCallerCamOn, setIsCallerCamOn] = useState(true);

  useEffect(() => {
    peer.on("call", (call) => {
      call.answer(userStream);

      setCallerPeer(call);

      call.on("stream", (receivedStream) => {
        setCallerStream(receivedStream);
      });
    });

    // prevent from subscribing multiple times
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.on("user-connected", (clients: [], peerID: string) => {
      const call = peer.call(peerID, userStream);
      setCallerPeer(call);

      call.on("stream", (receivedStream) => {
        setCallerStream(receivedStream);
      });

      call.on("close", () => {
        setCallerStream(undefined);
      });
    });

    // prevent from subscribing multiple times
    // eslint-disable-next-line
  }, [socket]);

  useEffect(() => {
    socket.on("unmute-mic", () => {
      setIsCallerMicOn(true);
    });

    socket.on("mute-mic", () => {
      setIsCallerMicOn(false);
    });

    socket.on("unmute-cam", () => {
      setIsCallerCamOn(true);
    });

    socket.on("mute-cam", () => {
      setIsCallerCamOn(false);
    });
  }, [socket]);

  useEffect(() => {
    socket.on("user-disconnected", () => {
      if (!callerPeer) return;

      callerPeer.close();
      setCallerStream(undefined);
      setCallerPeer(undefined);
    });
  }, [socket, callerPeer]);

  return (
    <div className={styles.menu}>
      <ul>
        <li>
          <CameraWindow stream={userStream} muted hiddenOptions isVideoHidden={false}></CameraWindow>
        </li>
        {callerPeer && (
          <li>
            <CameraWindow stream={callerStream} muted={!isCallerMicOn} isVideoHidden={!isCallerCamOn}></CameraWindow>
          </li>
        )}
      </ul>
      <Controls userStream={userStream}></Controls>
    </div>
  );
};

export default TalkingBox;
