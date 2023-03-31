import { useState, useEffect, createContext } from "react";
import { Routes, Route } from "react-router";
import io, { Socket } from "socket.io-client";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Peer from "peerjs";

import "./App.scss";

import Room from "./pages/Room/Room";
import Main from "./pages/Main/Main";

export const peer = new Peer(undefined);

export const SocketContext = createContext<any>({});
export const PeerIDContext = createContext<any>("");
export const StreamContext = createContext<any>("");

const App = () => {
  const [socket, setSocket] = useState<Socket>();
  const [peerID, setPeerID] = useState<string>();
  const [stream, setStream] = useState<string>();
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (socket) return;

    const connect = async () => {
      // http://localhost:4000
      // https://cloon.herokuapp.com/
      try {
        const receivedSocket = await io("http://localhost:4000");

        setSocket(receivedSocket);
      } catch (e) {
        toast("Server error occured...");
      }
    };

    connect();

    peer.on("open", (id) => {
      setPeerID(id);
    });

    return () => {
      socket!.disconnect();
    }; // eslint-disable-next-line
  }, []);

  useEffect(() => {
    const connectDevices = async () => {
      let stream: any = "";
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
      } catch (e) {
        console.log(e);
        try {
          stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        } catch (e) {
          console.log(e);
          try {
            stream = await navigator.mediaDevices.getUserMedia({ video: true });
          } catch (e) {
            console.log(e);
          }
        }
      }

      setStream(stream);
    };

    connectDevices();
  }, []);

  // if !stream return a div with information to connect camera and/or audio

  return (
    <div className="app">
      <StreamContext.Provider value={stream}>
        <PeerIDContext.Provider value={peerID}>
          <SocketContext.Provider value={socket}>
            <Routes>
              <Route path="/" element={<Main></Main>} />
              <Route path="/room/:roomID" element={<Room></Room>} />
            </Routes>
            <ToastContainer />
          </SocketContext.Provider>
        </PeerIDContext.Provider>
      </StreamContext.Provider>
    </div>
  );
};

export default App;
