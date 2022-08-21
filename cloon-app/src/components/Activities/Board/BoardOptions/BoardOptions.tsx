import { useEffect, useState } from "react";
import { CanvasOptions } from "../Board";

import styles from "./BoardOptions.module.scss";

import MiniMenu from "../../../UI/MiniMenu/MiniMenu";
import IconButton from "../../../UI/IconButton/IconButton";
import DrawingColorIcon from "../../../../assets/icons/BoardOptions/DrawingColor";
import LineWidthIcon from "../../../../assets/icons/BoardOptions/LineWidth";
import TrashIcon from "../../../../assets/icons/BoardOptions/Trash";

const BoardOptions = (props: {
  onChangeOptions: (options: CanvasOptions) => void;
  clearCanvasHandler: () => void;
}) => {
  const [drawingColor, setDrawingColor] = useState("red");
  const [lineWidth, setLineWidth] = useState(5);

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

  useEffect(() => {
    props.onChangeOptions({ drawingColor, lineWidth });
    // eslint-disable-next-line
  }, [drawingColor, lineWidth]);

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
      <div>
        <IconButton onClick={props.clearCanvasHandler}>
          <TrashIcon></TrashIcon>
        </IconButton>
      </div>
    </div>
  );
};

export default BoardOptions;
