import { getYtEmbed } from "../util/http";
import style from "./MediaViewer.module.css";

/// A component rendering videos, images, and embeds.
export const MediaViewer = ({
  src,
  className,
  onClick,
}: {
  src: string;
  className: string | undefined;
  onClick: () => void | undefined;
}) => {
  let content = <video src={src} />;

  // This is a normal-ass image.
  if (src.includes("imagedelivery.net")) {
    content = <img src={src} alt="An image." />;
  }

  if (src.includes("youtube.com") || src.includes("youtu.be")) {
    content = <iframe src={getYtEmbed(src)} width={560} height={315} />;
  }

  return (
    <div
      className={`${style.viewer} ${className ? className : ""}`}
      onClick={onClick}
    >
      {content}
    </div>
  );
};
