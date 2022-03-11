import { ReactElement } from "react";
import styles from "./IconButton.module.scss";

const IconButton = (props: {
  children: ReactElement;
  onClick?: () => void;
  className?: string;
  id?: string;
  highlighted?: boolean;
}) => {
  return (
    <button
      className={`${styles.button} ${props.highlighted ? styles.highlighted : ""} ${props.className}`}
      onClick={props.onClick}
      id={props.id}
    >
      {props.children}
    </button>
  );
};

export default IconButton;
