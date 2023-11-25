import { getYtEmbed } from "../util/http";
import styles from "./MediaViewer.module.css";
import Image from "next/image";
import clickable from "./Clickable.module.css";
import { useContext, useState, CSSProperties } from "react";
import { ModalContext as GeneralModalContext } from "./ModalDisplay";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

/// A component rendering videos, images, and embeds.
export const MediaViewer = ({
  title,
  style,
  src,
  className,
  onClick,
  width,
  height,
  expandable,
}: {
  title?: string;
  style?: CSSProperties;
  src: string;
  width?: number;
  height?: number;
  className?: string | undefined;
  onClick?: () => void | undefined;
  expandable?: boolean;
}) => {
  const { setModal } = useContext(GeneralModalContext);
  const [loaded, setLoaded] = useState<boolean>(false);

  let content = (
    <video
      className={loaded ? styles.loaded : styles.unloaded}
      onLoad={() => setLoaded(true)}
      src={src}
    />
  );
  let modalContent = <video className={styles.modalContent} src={src} />;

  if (src.endsWith("mp4")) {
    return;
  }

  // This is a normal-ass image.
  if (
    src.includes("imagedelivery.net") ||
    src.includes("base64") ||
    src.includes("png") ||
    src.includes("jpeg") ||
    src.includes("jpg")
  ) {
    content = (
      <img
        className={loaded ? styles.loaded : styles.unloaded}
        onLoad={() => setLoaded(true)}
        src={src}
        alt=""
      />
    );
    modalContent = <img className={styles.modalContent} src={src} alt="" />;
  }

  if (src.includes("youtube.com") || src.includes("youtu.be")) {
    content = (
      <iframe
        className={loaded ? styles.loaded : styles.unloaded}
        onLoad={() => setLoaded(true)}
        src={getYtEmbed(src)}
        frameBorder="0"
        width={width ?? 560}
        height={height ?? 315}
      />
    );
    modalContent = (
      <iframe
        className={styles.modalContent}
        src={getYtEmbed(src)}
        frameBorder="0"
        width={width ?? 560}
        height={height ?? 315}
      />
    );
  }

  modalContent = (
    <div className={styles.modalContentContainer} key="child">
      {modalContent}
    </div>
  );

  const toggleFullscreen = () => {
    setModal({
      title: title,
      children: [modalContent],
      onClose: () => {
        setModal({ children: [], onClose: () => {}, active: false });
      },
      active: true,
    });
  };

  return (
    <div
      className={`${styles.viewer} ${className ? className : ""}`}
      onClick={onClick}
      style={style}
    >
      {content}
      {!loaded && (
        <Skeleton containerClassName={styles.skeleton} height="100%" />
      )}
      {expandable && (
        <Image
          className={`${styles.fullscreen} ${clickable.clickable}`}
          src="/fullscreen.svg"
          height={40}
          width={40}
          alt="Fullscreen button"
          onClick={toggleFullscreen}
        />
      )}
    </div>
  );
};
