import style from "./ModalInput.module.css";
import Image from "next/image";
import { Button } from "./Button";
import { useState, createContext, Dispatch, SetStateAction } from "react";
import clickable from "./Clickable.module.css";

export interface ModalProps {
  title: string;
  description: string;
  placeholder: string;
  onSubmit: (s: string) => void;
  onClose: () => void;
  active: Boolean;
}

export const ModalContext = createContext<{
  modal: ModalProps;
  setModal: Dispatch<SetStateAction<ModalProps>>;
}>({
  modal: {
    title: "",
    description: "",
    placeholder: "",
    onSubmit: () => {},
    onClose: () => {},
    active: false,
  },
  setModal: () => {},
});

export const ModalInput = ({
  title,
  description,
  placeholder,
  onSubmit,
  onClose,
  active,
}: ModalProps) => {
  const [value, setValue] = useState<string>("");

  const close = () => {
    setValue("");
    onClose();
  };

  const submit = (s: string) => {
    setValue("");
    onSubmit(s);
  };

  return (
    <div className={`${style.modal} ${active ? style.active : ""}`}>
      <div className={style.modalContainer}>
        <div className={style.titleLine}>
          <h1>{title}</h1>
          <Image
            className={clickable.clickable}
            onClick={close}
            src="close.svg"
            height={30}
            width={30}
            alt="Close button."
          />
        </div>
        <p>{description}</p>
        <input
          placeholder={placeholder}
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <Button text="Submit" onClick={() => submit(value)} />
      </div>
    </div>
  );
};
