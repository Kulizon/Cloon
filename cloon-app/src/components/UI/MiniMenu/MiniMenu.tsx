import { ReactElement, useState } from "react";
import { createPortal } from "react-dom";

import styles from "./MiniMenu.module.scss";

import IconButton from "../IconButton/IconButton";

const MiniMenu = (props: { children: ReactElement; activateButtonContent: ReactElement }) => {
  const [isMenuVisible, setIsMenuVisible] = useState(false);

  return (
    <div className={styles.menu}>
      {isMenuVisible && (
        <>
          <div>{props.children}</div>
          {createPortal(
            <div
              className={styles.backdrop}
              onClick={() => {
                setIsMenuVisible(false);
              }}
            ></div>,
            document.getElementById("root")!
          )}
        </>
      )}
      <IconButton
        onClick={() => {
          setIsMenuVisible((prevState) => !prevState);
        }}
      >
        {props.activateButtonContent}
      </IconButton>
    </div>
  );
};

export default MiniMenu;
