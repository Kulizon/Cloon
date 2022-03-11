import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router";
import { SocketContext, PeerIDContext } from "../../../App";
import { peer } from "../../../App";

import styles from "./TalkingBox.module.scss";

import CameraWindow from "./CameraWindow/CameraWindow";
import Controls from "./Controls/Controls";

const TalkingBox = () => {
  const socket = useContext(SocketContext);
  const peerID = useContext(PeerIDContext);
  const { roomID } = useParams();
  const [userStream, setUserStream] = useState<MediaStream>();
  const [callerStream, setCallerStream] = useState<MediaStream | undefined>();

  const [callerPeer, setCallerPeer] = useState<any>();

  const [isCallerMicOn, setIsCallerMicOn] = useState(true);
  const [isCallerCamOn, setIsCallerCamOn] = useState(true);

  useEffect(() => {
    const connectDevices = async () => {
      let stream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      } catch (e) {
        console.log(e);
        try {
          stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        } catch (e) {
          console.log(e);
        }
      }

      setUserStream(stream);
    };

    connectDevices();
  }, []);

  useEffect(() => {
    peer.on("call", (call) => {
      call.answer(userStream);

      setCallerPeer(call);

      call.on("stream", (receivedStream) => {
        setCallerStream(receivedStream);
      });
    });
  }, [userStream]);

  useEffect(() => {
    socket.on("user-connected", (clients: [], peerID: string) => {
      if (!userStream) return;

      const call = peer.call(peerID, userStream);

      setCallerPeer(call);

      call.on("stream", (receivedStream) => {
        setCallerStream(receivedStream);
      });

      call.on("close", () => {
        setCallerStream(undefined);
      });
    });
  }, [socket, userStream, roomID, peerID]);

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

    socket.on("user-disconnected", () => {
      console.log(callerPeer);

      if (!callerPeer) return;

      callerPeer.close();
      setCallerStream(undefined);
    });
  }, [socket, callerPeer]);

  return (
    <div className={styles.menu}>
      <ul>
        <li>
          <CameraWindow stream={userStream} muted isVideoHidden={false}></CameraWindow>
        </li>
        {callerStream && (
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
