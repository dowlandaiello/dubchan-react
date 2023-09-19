import clickable from "./Clickable.module.css";
import Image from "next/image";
import style from "./FileUpload.module.css";
import { useContext } from "react";
import { ModalContext } from "./ModalInput";

export const UrlVidUpload = ({
  onChange,
}: {
  onChange: (url: string) => void;
}) => {
  const { setModal } = useContext(ModalContext);

  const onSubmit = (s: string) => {
    onChange(s);
    setModal((props) => {
      return { ...props, active: false };
    });
  };

  const edit = () => {
    setModal({
      title: "Link a Video",
      description: "Attach YouTube links, or links ending with .mp4.",
      placeholder: "https://",
      active: true,
      onSubmit: onSubmit,
      onClose: () =>
        setModal((props) => {
          return { ...props, active: false };
        }),
    });
  };

  return (
    <div className={`${style.button} ${clickable.clickable}`}>
      <div className={style.buttonLabel} onClick={edit}>
        <Image src="/movie.svg" height={20} width={20} alt="Upload icon." />
      </div>
    </div>
  );
};
