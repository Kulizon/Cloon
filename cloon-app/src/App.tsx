import { useState, useEffect, createContext } from "react";
import { Routes, Route } from "react-router";
import io, { Socket } from "socket.io-client";
import Peer from "peerjs";

import "./App.scss";

import Room from "./pages/Room/Room";
import Main from "./pages/Main/Main";

export const peer = new Peer(undefined);

export const SocketContext = createContext<any>({});
export const PeerIDContext = createContext<any>("");

const App = () => {
  const [socket, setSocket] = useState<Socket>();
  const [peerID, setPeerID] = useState<string>();

  useEffect(() => {
    if (socket) return;

    const connect = async () => {
      //http://localhost:4000
      //https://afternoon-ravine-52264.herokuapp.com/
      const receivedSocket = await io("http://localhost:4000");
      setSocket(receivedSocket);
    };

    connect();

    peer.on("open", (id) => {
      setPeerID(id);
    });

    return () => {
      socket!.disconnect();
    }; // eslint-disable-next-line
  }, []);

  return (
    <div className="app">
      <PeerIDContext.Provider value={peerID}>
        <SocketContext.Provider value={socket}>
          <Routes>
            <Route path="/" element={<Main></Main>} />
            <Route path="/room/:roomID" element={<Room></Room>} />
          </Routes>
        </SocketContext.Provider>
      </PeerIDContext.Provider>
    </div>
  );
};

export default App;
