import style from "./FileUpload.module.css";
import { SyntheticEvent } from "react";
import clickable from "./Clickable.module.css";
import Image from "next/image";

export interface ChangeEvent<T = Element> extends SyntheticEvent<T> {
  target: EventTarget & T;
}

export const FileUpload = ({
  className,
  onChange,
}: {
  className?: string | undefined;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}) => {
  return (
    <div className={`${style.button} ${clickable.clickable}`}>
      <input
        className={`${className}`}
        type="file"
        accept=".jpeg, .jpg, .png"
        onChange={onChange}
      />
      <div className={style.buttonLabel}>
        <Image src="/camera.svg" height={20} width={20} alt="Upload icon." />
      </div>
    </div>
  );
};
