import { useEffect, useState, useContext } from "react";
import { CanvasOptions } from "../Board";
import { SocketContext } from "../../../../App";
import { useParams } from "react-router";

import styles from "./BoardOptions.module.scss";

import MiniMenu from "../../../UI/MiniMenu/MiniMenu";
import IconButton from "../../../UI/IconButton/IconButton";
import DrawingColorIcon from "../../../../assets/icons/BoardOptions/DrawingColor";
import LineWidthIcon from "../../../../assets/icons/BoardOptions/LineWidth";
import LineOpacityIcon from "../../../../assets/icons/BoardOptions/LineOpacity";
import TrashIcon from "../../../../assets/icons/BoardOptions/Trash";

const BoardOptions = (props: {
  contextRef: any;
  canvasRef: any;
  onChangeOptions: (options: CanvasOptions) => void;
}) => {
  const { contextRef, canvasRef } = props;
  const { roomID } = useParams();
  const socket = useContext(SocketContext);

  const [drawingColor, setDrawingColor] = useState("red");
  const [lineWidth, setLineWidth] = useState(5);
  const [lineOpacity, setLineOpacity] = useState(1);

  const changeColorHandler = (e: any) => {
    e.preventDefault();
    const color = e.nativeEvent.submitter.id;
    setDrawingColor(color);
  };

  const changeLineWidthHandler = (e: any) => {
    e.preventDefault();
    const lineWidth = +e.target.value;
    setLineWidth(lineWidth);
  };

  const changeLineOpacityHandler = (e: any) => {
    e.preventDefault();
    const lineOpacity = +e.target.value / 10;
    setLineOpacity(lineOpacity);
  };

  const clearCanvasHandler = () => {
    contextRef.current!.clearRect(0, 0, canvasRef.current!.width, canvasRef.current!.height);
    socket.emit("clear-canvas", roomID);
  };

  useEffect(() => {
    props.onChangeOptions({ drawingColor, lineOpacity, lineWidth });
    // eslint-disable-next-line
  }, [drawingColor, lineOpacity, lineWidth]);

  return (
    <div className={styles.options}>
      <MiniMenu activateButtonContent={<DrawingColorIcon></DrawingColorIcon>}>
        <form onSubmit={changeColorHandler} className={styles["color-form"]}>
          <button id="red" style={{ background: "red" }}></button>
          <button id="blue" style={{ background: "blue" }}></button>
          <button id="green" style={{ background: "green" }}></button>
          <button id="yellow" style={{ background: "yellow" }}></button>
          <button id="purple" style={{ background: "purple" }}></button>
          <button id="orange" style={{ background: "orange" }}></button>
          <button id="brown" style={{ background: "brown" }}></button>
          <button id="black" style={{ background: "black" }}></button>
          <button id="#f1f1f1" style={{ background: "#f1f1f1" }}></button>
        </form>
      </MiniMenu>
      <MiniMenu activateButtonContent={<LineWidthIcon></LineWidthIcon>}>
        <input type="range" min="2" max="15" value={lineWidth} onChange={changeLineWidthHandler} />
      </MiniMenu>
      <MiniMenu activateButtonContent={<LineOpacityIcon></LineOpacityIcon>}>
        <input type="range" min="1" max="10" value={lineOpacity * 10} onChange={changeLineOpacityHandler} />
      </MiniMenu>
      <div>
        <IconButton onClick={clearCanvasHandler}>
          <TrashIcon></TrashIcon>
        </IconButton>
      </div>
    </div>
  );
};

export default BoardOptions;
