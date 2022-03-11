import styles from "./TextInput.module.scss";

const TextInput = (props: { className?: string; id?: string; placeholder?: string }) => {
  return (
    <input type="text" id={props.id} className={`${styles.input} ${props.className}`} placeholder={props.placeholder} />
  );
};

export default TextInput;
