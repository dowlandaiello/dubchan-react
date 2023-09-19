import Image from "next/image";
import style from "./Clickable.module.css";

/// A button that copies a link to the clipboard upon clicking.
export const CopyLink = ({ link }: { link: string }) => {
  const copyLink = () => {
    window.navigator.clipboard.writeText(link);
  };

  return (
    <Image
      className={style.clickable}
      src="/link.svg"
      width={20}
      height={20}
      alt={`Copy link: ${link}`}
      onClick={copyLink}
    />
  );
};
