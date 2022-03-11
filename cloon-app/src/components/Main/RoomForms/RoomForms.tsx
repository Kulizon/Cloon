import React, { useContext } from "react";
import { useNavigate } from "react-router";
import { SocketContext, PeerIDContext } from "../../../App";

import styles from "./RoomForms.module.scss";

import Button from "../../UI/Button/Button";
import TextInput from "../../UI/TextInput/TextInput";

const RoomForms = () => {
  const navigate = useNavigate();
  const socket = useContext(SocketContext);
  const peerID = useContext(PeerIDContext);

  const createNewRoomHandler = (e: React.SyntheticEvent<EventTarget>) => {
    e.preventDefault();
    if (!socket || !peerID) return;

    socket.emit("new-room", socket.id);
    socket.on("new-room", (roomID: string) => {
      socket.emit("join-room", roomID, peerID);

      navigate(`room/${roomID}`);
    });
  };

  const joinRandomRoomHandler = (e: React.SyntheticEvent<EventTarget>) => {
    e.preventDefault();
    if (!socket || !peerID) return;

    socket.emit("join-random-room");
    socket.on("join-random-room", (randomRoomID: string) => {
      socket.emit("join-room", randomRoomID, peerID);
      navigate(`room/${randomRoomID}`);
    });
  };

  const joinRoomHandler = (e: React.SyntheticEvent<EventTarget>) => {
    e.preventDefault();
    if (!socket || !peerID) return;

    const roomID = ((e.target as unknown as HTMLElement[])[0] as HTMLInputElement).value;

    socket.emit("join-room", roomID, peerID);
    socket.on("full-room", () => {
      alert("Room is full...");
    });
    socket.on("join-room", (roomID: string) => {
      navigate(`room/${roomID}`);
    });
  };

  return (
    <div className={styles.forms}>
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
    </div>
  );
};

export default RoomForms;
