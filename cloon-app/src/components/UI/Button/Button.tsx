import styles from "./Button.module.scss";

const Button = (props: { id?: string; onClick?: () => void; children: string }) => {
  return (
    <button className={styles.button} id={props.id} onClick={props.onClick}>
      {props.children}
    </button>
  );
};

export default Button;
