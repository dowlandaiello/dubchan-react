import style from "./FeedControl.module.css";
import Image from "next/image";
import { useState } from "react";
import clickable from "./Clickable.module.css";

export const FeedControl = () => {
  const [gridActive, setGridActive] = useState<Boolean>(true);

  return (
    <div className={style.section}>
      <div className={style.gridToggle}>
        <div
          className={`${clickable.clickable} ${style.leftToggle} ${
            gridActive ? style.active : ""
          }`}
          onClick={() => setGridActive(true)}
        >
          <Image src="/grid.svg" height={20} width={20} alt="Grid icon." />
        </div>
        <div
          className={`${clickable.clickable} ${style.rightToggle} ${
            !gridActive ? style.active : ""
          }`}
          onClick={() => setGridActive(false)}
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
