import style from "./FileUpload.module.css";
import clickable from "./Clickable.module.css";
import Image from "next/image";

export const PollUpload = ({ onClick }: { onClick: () => void }) => {
  return (
    <div className={`${style.button} ${clickable.clickable}`}>
      <div className={style.buttonLabel} onClick={onClick}>
        <Image src="/poll.svg" height={20} width={20} alt="Poll icon." />
      </div>
    </div>
  );
};
