import { getYtEmbed } from "../util/http";
import style from "./MediaViewer.module.css";
import Image from "next/image";
import clickable from "./Clickable.module.css";
import { useContext, useState } from "react";
import { ModalContext as GeneralModalContext } from "./ModalDisplay";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

/// A component rendering videos, images, and embeds.
export const MediaViewer = ({
  title,
  src,
  className,
  onClick,
  width,
  height,
}: {
  title?: string;
  src: string;
  width?: number;
  height?: number;
  className?: string | undefined;
  onClick?: () => void | undefined;
}) => {
  const { setModal } = useContext(GeneralModalContext);
  const [loaded, setLoaded] = useState<boolean>(false);

  let content = (
    <video
      className={loaded ? style.loaded : style.unloaded}
      onLoad={() => setLoaded(true)}
      src={src}
    />
  );
  let modalContent = <video className={style.modalContent} src={src} />;

  // This is a normal-ass image.
  if (src.includes("imagedelivery.net") || src.includes("base64")) {
    content = (
      <img
        className={loaded ? style.loaded : style.unloaded}
        onLoad={() => setLoaded(true)}
        src={src}
        alt=""
      />
    );
    modalContent = <img className={style.modalContent} src={src} alt="" />;
  }

  if (src.includes("youtube.com") || src.includes("youtu.be")) {
    content = (
      <iframe
        className={loaded ? style.loaded : style.unloaded}
        onLoad={() => setLoaded(true)}
        src={getYtEmbed(src)}
        frameBorder="0"
        width={width ?? 560}
        height={height ?? 315}
      />
    );
    modalContent = (
      <iframe
        className={style.modalContent}
        src={getYtEmbed(src)}
        frameBorder="0"
        width={width ?? 560}
        height={height ?? 315}
      />
    );
  }

  modalContent = (
    <div className={style.modalContentContainer} key="child">
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
      className={`${style.viewer} ${className ? className : ""}`}
      onClick={onClick}
    >
      {content}
      {!loaded && (
        <Skeleton containerClassName={style.skeleton} height="100%" />
      )}
      <Image
        className={`${style.fullscreen} ${clickable.clickable}`}
        src="/fullscreen.svg"
        height={40}
        width={40}
        alt="Fullscreen button"
        onClick={toggleFullscreen}
      />
    </div>
  );
};
