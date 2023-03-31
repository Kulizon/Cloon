import React, { useContext, useState } from "react";
import { useNavigate } from "react-router";
import { SocketContext, PeerIDContext, StreamContext } from "../../../App";

import styles from "./RoomForms.module.scss";

import Button from "../../UI/Button/Button";
import TextInput from "../../UI/TextInput/TextInput";

const RoomForms = () => {
  const navigate = useNavigate();
  const socket = useContext(SocketContext);
  const peerID = useContext(PeerIDContext);
  const userStream = useContext(StreamContext);
  const [isError, setIsError] = useState<boolean>(false);

  const createNewRoomHandler = (e: React.SyntheticEvent<EventTarget>) => {
    e.preventDefault();
    if (!socket || !peerID) return;

    try {
      socket.emit("new-room", socket.id);
      socket.on("new-room", (roomID: string) => {
        socket.emit("join-room", roomID, peerID);

        navigate(`room/${roomID}`);
      });
    } catch (e) {
      console.log(e);
      setIsError(true);
    }
  };

  const joinRandomRoomHandler = (e: React.SyntheticEvent<EventTarget>) => {
    e.preventDefault();
    if (!socket || !peerID) return;

    try {
      socket.emit("join-random-room");
      socket.on("join-random-room", (randomRoomID: string) => {
        socket.emit("join-room", randomRoomID, peerID);
        navigate(`room/${randomRoomID}`);
      });
    } catch (e) {
      console.log(e);
      setIsError(true);
    }
  };

  const joinRoomHandler = (e: React.SyntheticEvent<EventTarget>) => {
    e.preventDefault();
    if (!socket || !peerID) return;

    const roomID = (
      (e.target as unknown as HTMLElement[])[0] as HTMLInputElement
    ).value;

    try {
      socket.emit("join-room", roomID, peerID);
      socket.on("full-room", () => {
        alert("Room is full...");
      });
      socket.on("join-room", (roomID: string) => {
        navigate(`room/${roomID}`);
      });
    } catch (e) {
      console.log(e);
      setIsError(true);
    }
  };

  return (
    <div className={styles.forms}>
      {userStream ? (
        <>
          <form onSubmit={createNewRoomHandler}>
            <Button>New Room</Button>
          </form>
          <form onSubmit={joinRandomRoomHandler}>
            <Button>Random Room</Button>
          </form>
          <form onSubmit={joinRoomHandler}>
            <TextInput id="roomID" placeholder="Type room ID..."></TextInput>
            <Button>Join Room</Button>
          </form>
        </>
      ) : (
        <h2>Please connect either audio or video device...</h2>
      )}
      {isError && <span>Server error occured...</span>}
    </div>
  );
};

export default RoomForms;
