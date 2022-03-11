import styles from "./Main.module.scss";

import RoomForms from "../../components/Main/RoomForms/RoomForms";
import Artwork from "../../components/Main/Artwork/Artwork";

const Main = () => {
  return (
    <>
      <main className={styles.main}>
        <div className={styles.logo}>
          <h1>Cloon</h1>
          <h6>Meet all kinds of new people...</h6>
        </div>

        <RoomForms></RoomForms>
      </main>
      <Artwork></Artwork>
    </>
  );
};

export default Main;
