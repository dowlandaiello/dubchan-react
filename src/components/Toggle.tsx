import style from "./Toggle.module.css";
import { useState } from "react";
import clickable from "./Clickable.module.css";

export const Toggle = ({
  text,
  onChange,
  init,
}: {
  text: string;
  onChange: (state: boolean) => void;
  init: boolean;
}) => {
  const [active, setActive] = useState(init);

  const toggle = () => {
    onChange(!active);
    setActive(!active);
  };

  return (
    <div className={style.section}>
      <div
        className={`${style.toggle} ${clickable.clickable} ${
          active && style.active
        }`}
        onClick={toggle}
      >
        <span className={style.toggleHead} />
      </div>
      <p className={style.label}>{text}</p>
    </div>
  );
};
