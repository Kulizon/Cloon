import { SocketContext } from "../../../App";
import { useRef, useEffect, useState, useContext } from "react";
import useWindowDimensions from "../../../hooks/useWindowDimensions";
import { useParams } from "react-router";

import styles from "./Board.module.scss";

import BoardOptions from "./BoardOptions/BoardOptions";

export interface CanvasOptions {
  lineOpacity: number;
  drawingColor: string;
  lineWidth: number;
}

const Board = () => {
  const socket = useContext(SocketContext);
  const { roomID } = useParams();

  const windowWidth = useWindowDimensions().width;

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const contextRef = useRef<CanvasRenderingContext2D>();

  const [isDrawing, setIsDrawing] = useState(false);
  const [options, setOptions] = useState<CanvasOptions>({
    lineOpacity: 1,
    drawingColor: "red",
    lineWidth: 5,
  });

  window.addEventListener("resize", () => {
    const canvas = canvasRef.current!;
    if (!canvas) return;

    if (windowWidth < 1000) {
      canvas!.width = window.innerWidth * 0.75;
      canvas!.height = window.innerWidth * 0.75 * 0.5;
    } else {
      canvas!.width = window.innerWidth * 0.44;
      canvas!.height = window.innerWidth * 0.44 * 0.5;
    }

    //
    // maybe draw on resize so canvas is not lost
    //
  });

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvasRef.current?.getContext("2d");

    if (windowWidth < 1000) {
      canvas!.width = window.innerWidth * 0.75;
      canvas!.height = window.innerWidth * 0.75 * 0.5;
    } else {
      canvas!.width = window.innerWidth * 0.44;
      canvas!.height = window.innerWidth * 0.44 * 0.5;
    }
    contextRef.current = ctx!;
  }, [windowWidth]);

  useEffect(() => {
    socket.on("draw-canvas", (encodedCanvas: string) => {
      const decodedCanvas = new Image();
      decodedCanvas.onload = () => {
        contextRef.current!.drawImage(decodedCanvas, 0, 0);
      };
      decodedCanvas.src = encodedCanvas;
    });
    socket.on("clear-canvas", () => {
      contextRef.current!.clearRect(0, 0, canvasRef.current!.width, canvasRef.current!.height);
    });
  }, [socket]);

  const drawHandler = (e: any, drawDot?: boolean) => {
    if ((!isDrawing && !drawDot) || !contextRef.current) return;

    const ctx = contextRef.current;
    const rect = canvasRef.current!.getBoundingClientRect();

    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
    ctx.lineCap = "round";
    ctx.strokeStyle = options.drawingColor;
    ctx.lineWidth = options.lineWidth;
    ctx.globalAlpha = options.lineOpacity;

    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);

    const encodedCanvas = canvasRef.current?.toDataURL();
    socket.emit("draw-canvas", encodedCanvas, roomID);
  };

  const startDrawHandler = async (e: any) => {
    const { offsetX: x, offSetY: y } = e;
    contextRef.current?.beginPath();
    contextRef.current?.moveTo(x, y);

    await setIsDrawing(true);
    drawHandler(e, true);
  };

  const endDrawHandler = () => {
    contextRef.current?.closePath();
    setIsDrawing(false);
  };

  const onChangeOptions = (receivedOptions: CanvasOptions) => {
    setOptions(receivedOptions);
  };

  return (
    <div className={styles.board}>
      <canvas
        ref={canvasRef}
        onMouseDown={startDrawHandler}
        onMouseUp={endDrawHandler}
        onMouseMove={drawHandler}
        onMouseLeave={endDrawHandler}
      ></canvas>
      <BoardOptions canvasRef={canvasRef} contextRef={contextRef} onChangeOptions={onChangeOptions}></BoardOptions>
    </div>
  );
};

export default Board;
