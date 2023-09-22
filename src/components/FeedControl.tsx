import style from "./FeedControl.module.css";
import Image from "next/image";
import { useState } from "react";
import clickable from "./Clickable.module.css";

export const FeedControl = ({
  onGridToggled,
  onSearch,
  onClear,
}: {
  onGridToggled: (stat: boolean) => void;
  onSearch: (term: string) => void;
  onClear: () => void;
}) => {
  const [gridActive, setGridActive] = useState<Boolean>(true);
  const [searchText, setSearchText] = useState<string>("");
  const [searchActive, setSearchActive] = useState<Boolean>(false);

  const toggle = (stat: boolean) => {
    setGridActive(stat);
    onGridToggled(stat);
  };

  const search = () => {
    onSearch(searchText);
    setSearchActive(true);
  };

  const clear = () => {
    onClear();
    setSearchText("");
    setSearchActive(false);
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
          <input
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Search for something"
          />
          {!searchActive ? (
            <Image
              className={`${clickable.clickable} ${style.returnButton}`}
              src="/return.svg"
              alt="Return"
              height={20}
              width={20}
              onClick={search}
            />
          ) : (
            <Image
              className={`${clickable.clickable} ${style.returnButton}`}
              src="/close.svg"
              height={20}
              width={20}
              alt="Clear button"
              onClick={clear}
            />
          )}
        </div>
      </div>
    </div>
  );
};
