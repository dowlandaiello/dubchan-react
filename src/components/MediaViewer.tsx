import { getYtEmbed } from "../util/http";
import style from "./MediaViewer.module.css";
import Image from "next/image";
import clickable from "./Clickable.module.css";

/// A component rendering videos, images, and embeds.
export const MediaViewer = ({
  src,
  className,
  onClick,
  width,
  height,
}: {
  src: string;
  width?: number;
  height?: number;
  className?: string | undefined;
  onClick?: () => void | undefined;
}) => {
  let content = <video src={src} />;

  // This is a normal-ass image.
  if (src.includes("imagedelivery.net") || src.includes("base64")) {
    content = <img src={src} alt="An image." />;
  }

  if (src.includes("youtube.com") || src.includes("youtu.be")) {
    content = (
      <iframe
        src={getYtEmbed(src)}
        frameBorder="0"
        width={width ?? 560}
        height={height ?? 315}
      />
    );
  }

  return (
    <div
      className={`${style.viewer} ${className ? className : ""}`}
      onClick={onClick}
    >
      {content}
      <Image
        className={`${style.fullscreen} ${clickable.clickable}`}
        src="/fullscreen.svg"
        height={40}
        width={40}
        alt="Fullscreen button"
      />
    </div>
  );
};
