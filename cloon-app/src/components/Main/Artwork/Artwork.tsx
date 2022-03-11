// @ts-ignore
// eslint-disable-next-line
import TagCloud from "TagCloud";
import { useEffect, useMemo, useRef } from "react";

import styles from "./Artwork.module.scss";

const Artwork = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const TagCloud = require("TagCloud");

  const texts = useMemo(
    () => [
      "Discover",
      "Talk",
      "Befriend",
      "Meet",
      "Chat",
      "Interact",

      "Meet",
      "Chat",
      "Talk",
      "Interact",
      "Discover",

      "Discover",
      "Meet",
      "Chat",
      "Interact",
      "Talk",

      "Discover",
      "Talk",
      "Befriend",
      "Meet",
      "Chat",
      "Interact",

      "Meet",
      "Chat",
      "Talk",
      "Interact",
      "Discover",
    ],
    []
  );

  useEffect(() => {
    if (!containerRef) return;

    TagCloud(containerRef.current, texts, {
      radius: 600,
    });

    return () => {
      containerRef.current = null;
    };
  }, [TagCloud, texts]);

  return <div className={styles.artwork} ref={containerRef}></div>;
};

export default Artwork;
