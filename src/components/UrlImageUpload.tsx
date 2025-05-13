import { useContext } from "react";
import { ModalContext } from "./ModalInput";
import clickable from "./Clickable.module.css";
import Image from "next/image";
import style from "./FileUpload.module.css";

export const UrlImageUpload = ({
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
      title: "Link an Image",
      description:
        "Attach a link ending with .webp, .png, .jpg, .jpeg, or .gif from files.catbox.moe, imgur.com, media.discordapp.net, or youtube.com.",
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
        <Image src="/picture.svg" height={20} width={20} alt="Image icon." />
      </div>
    </div>
  );
};
