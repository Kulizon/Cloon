import { SocketContext } from "../../../App";
import React, { useState, useContext, useEffect, SyntheticEvent } from "react";
import { useParams } from "react-router";

import styles from "./Wheel.module.scss";

import MiniMenu from "../../UI/MiniMenu/MiniMenu";
import IconButton from "../../UI/IconButton/IconButton";
import PlusIcon from "../../../assets/icons/WheelOptions/Plus";
import CheckIcon from "../../../assets/icons/WheelOptions/Check";
import TextInput from "../../UI/TextInput/TextInput";
import XMarkIcon from "../../../assets/icons/ActivityMenu/XMark";

const getRandomSpinValue = () => Math.floor(Math.random() * 3000 + 1500);

interface WheelStyles {
  deg: number;
  width: number;
  left: number;
  clipPath?: string;
}

const getWheelStyles = (numberOfOptions: number): WheelStyles => {
  const deg = +(360 / numberOfOptions).toFixed(1);

  let styles: WheelStyles = { deg: 0, width: 0, left: 0 };

  switch (numberOfOptions) {
    case 2:
      styles = { deg, width: 250, left: -75, clipPath: "none" };
      break;
    case 3:
      styles = { deg, width: 180, left: -40 };
      break;
    case 4:
      styles = { deg, width: 100, left: 0 };
      break;
    case 5:
      styles = { deg, width: 80, left: 10 };
      break;
    case 6:
      styles = { deg, width: 60, left: 20 };
      break;
    case 7:
      styles = { deg, width: 50, left: 25 };
      break;
    case 8:
      styles = { deg, width: 42, left: 29 };
      break;
  }

  return styles;
};

const Wheel = () => {
  const socket = useContext(SocketContext);
  const { roomID } = useParams();

  const [options, setOptions] = useState<string[]>([
    "Option 1",
    "Option 2",
    "Option 3",
    "Option 4",
    "Option 5",
    "Option 6",
  ]);
  const [wheelRotateValue, setWheelRotateValue] = useState(Number);

  const spinHandler = () => {
    const spinValue = getRandomSpinValue();

    console.log(spinValue);

    setWheelRotateValue(spinValue);
    socket.emit("spin-wheel", spinValue, roomID);
  };

  useEffect(() => {
    socket.on("spin-wheel", (receivedRotateValue: number) => {
      setWheelRotateValue(receivedRotateValue);
    });
    socket.on("change-wheel-options", (receivedOptions: string[]) => {
      setOptions(receivedOptions);
    });
  }, [socket]);

  const addOptionHandler = (e: React.SyntheticEvent<EventTarget>) => {
    e.preventDefault();
    const newOption = ((e.target as HTMLFormElement)[0] as HTMLInputElement).value;

    if (options.length >= 8 || options.includes(newOption)) return;

    const newOptions = [...options, newOption];

    if (newOption.trim()) {
      socket.emit("change-wheel-options", newOptions, roomID);
      setOptions(newOptions);
      ((e.target as HTMLFormElement)[0] as HTMLInputElement).value = "";
    }
  };

  const deleteOptionHandler = (e: SyntheticEvent) => {
    const optionToDelete = (e.target as HTMLDivElement).outerText;

    const newOptions = options.filter((o) => o !== optionToDelete);
    socket.emit("change-wheel-options", newOptions, roomID);
    setOptions(newOptions);
  };

  const wheelStyles = getWheelStyles(options.length);

  return (
    <div className={styles["wheel-activity"]}>
      <div className={styles.wheel}>
        <button onClick={spinHandler}>Spin</button>
        <span className={styles.arrow}></span>
        <div className={styles.container} style={{ transform: `rotate(${wheelRotateValue}deg)` }}>
          {options.map((option, index) => {
            return (
              <div
                key={option}
                style={{
                  transform: `rotate(${(index * wheelStyles.deg).toString()}deg)`,
                  width: `${wheelStyles.width}%`,
                  left: `${wheelStyles.left}%`,
                  clipPath: wheelStyles.clipPath,
                }}
              >
                {option}
              </div>
            );
          })}
        </div>
      </div>
      <div className={styles["options-menu"]}>
        <MiniMenu activateButtonContent={<PlusIcon></PlusIcon>} deactivateButtonContent={<XMarkIcon></XMarkIcon>}>
          <>
            <ul>
              {options.map((o) => (
                <div onClick={deleteOptionHandler} key={o}>
                  {o}
                </div>
              ))}
            </ul>
            <form onSubmit={addOptionHandler}>
              <TextInput placeholder="Type your option..."></TextInput>
              <IconButton>
                <CheckIcon></CheckIcon>
              </IconButton>
            </form>
          </>
        </MiniMenu>
      </div>
    </div>
  );
};

export default Wheel;
