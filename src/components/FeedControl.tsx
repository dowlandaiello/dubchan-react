import style from "./FeedControl.module.css";
import Image from "next/image";
import { useState } from "react";
import clickable from "./Clickable.module.css";

export const FeedControl = ({
  onGridToggled,
}: {
  onGridToggled: (stat: boolean) => void;
}) => {
  const [gridActive, setGridActive] = useState<Boolean>(true);

  const toggle = (stat: boolean) => {
    setGridActive(stat);
    onGridToggled(stat);
  };

  return (
    <div className={style.section}>
      <div className={style.gridToggle}>
        <div
          className={`${clickable.clickable} ${style.leftToggle} ${
            gridActive ? style.active : ""
          }`}
          onClick={() => toggle(true)}
        >
          <Image src="/grid.svg" height={20} width={20} alt="Grid icon." />
        </div>
        <div
          className={`${clickable.clickable} ${style.rightToggle} ${
            !gridActive ? style.active : ""
          }`}
          onClick={() => toggle(false)}
        >
          <Image src="/list.svg" height={20} width={20} alt="List icon." />
        </div>
      </div>
      <div className={style.searchBar}>
        <div className={style.contents}>
          <Image src="/search.svg" alt="Search bar" height={20} width={20} />
          <input placeholder="Search for something" />
        </div>
      </div>
    </div>
  );
};
