import style from "./Disclaimer.module.css";
import Image from "next/image";

export const Disclaimer = ({ text }: { text: string }) => {
  return (
    <div className={style.section}>
      <Image
        src="/disclaimer.svg"
        height={20}
        width={20}
        alt="Disclaimer icon."
      />
      <p>{text}</p>
    </div>
  );
};
