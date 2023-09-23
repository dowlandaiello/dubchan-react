import { ReactElement, createContext, Dispatch, SetStateAction } from "react";
import style from "./ModalDisplay.module.css";
import Image from "next/image";
import clickable from "./Clickable.module.css";
import { ErrorLabel } from "./ErrorLabel";

export interface ModalProps {
  title?: string;
  children: ReactElement[];
  onClose: () => void;
  active: Boolean;
}

export const ModalContext = createContext<{
  modal: ModalProps;
  setModal: Dispatch<SetStateAction<ModalProps>>;
}>({
  modal: { children: [], onClose: () => {}, active: false },
  setModal: () => {},
});

// A general modal that displays child content.
export const ModalDisplay = ({
  title,
  children,
  onClose,
  active,
}: ModalProps) => {
  return (
    <div className={`${style.modal} ${active ? style.active : ""}`}>
      <div className={style.modalContainer}>
        <div className={style.titleLine}>
          {title && <h1>{title}</h1>}
          <Image
            className={clickable.clickable}
            onClick={onClose}
            src="close.svg"
            height={30}
            width={30}
            alt="Close button."
          />
        </div>
        {children}
      </div>
    </div>
  );
};
