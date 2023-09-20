import { MediaViewer } from "./MediaViewer";
import style from "./MediaPreview.module.css";
import clickable from "./Clickable.module.css";
import Image from "next/image";

export const MediaPreview = ({
  src,
  className,
  onRemove,
  width,
  height,
}: {
  src: string;
  className?: string;
  onRemove?: () => void;
  width?: number;
  height?: number;
}) => {
  return (
    <div className={`${style.viewer} ${className}`}>
      <MediaViewer
        src={src}
        className={`${className} ${style.image}`}
        width={width}
        height={height}
      />
      <div className={style.removeIcon}>
        <Image
          className={clickable.clickable}
          onClick={onRemove}
          src="/close.svg"
          height={15}
          width={15}
          alt="Remove attachment icon."
        />
      </div>
    </div>
  );
};
