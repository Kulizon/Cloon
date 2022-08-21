import { ReactElement } from "react";

import styles from "./ActivityBox.module.scss";

// import Board from "./../../Activities/Board/Board";
import Wheel from "../../Activities/Wheel/Wheel";

const ActivityBox = (props: { activity: string }) => {
  const activity = props.activity;

  let content: ReactElement = <div></div>;
  // if (activity === "board") content = <Board></Board>;
  if (activity === "wheel") content = <Wheel></Wheel>;

  return <div className={styles.menu}>{content}</div>;
};

export default ActivityBox;
