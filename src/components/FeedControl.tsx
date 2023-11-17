import style from "./FeedControl.module.css";
import Image from "next/image";
import { useState } from "react";
import clickable from "./Clickable.module.css";
import { TagSelection } from "./TagSelection";

export const FeedControl = ({
  onGridToggled,
  onSearch,
  onClear,
  onChangeTags,
  onBlurToggled,
  onClassicThreadingToggled,
  onRefresh,
}: {
  onGridToggled: (stat: boolean) => void;
  onSearch: (term: string) => void;
  onClear: () => void;
  onChangeTags: (tags: string[]) => void;
  onBlurToggled: (stat: boolean) => void;
  onClassicThreadingToggled: (stat: boolean) => void;
  onRefresh: () => void;
}) => {
  const [gridActive, setGridActive] = useState<Boolean>(true);
  const [searchText, setSearchText] = useState<string>("");
  const [searchActive, setSearchActive] = useState<Boolean>(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([
    "UW",
    "Fitness",
    "LGBT",
    "NSFW",
  ]);
  const [blurActive, setBlurActive] = useState<Boolean>(true);
  const [classicActive, setClassicActive] = useState<Boolean>(true);

  const toggle = (stat: boolean) => {
    setGridActive(stat);
    onGridToggled(stat);
  };

  const toggleBlur = (stat: boolean) => {
    setBlurActive(stat);
    onBlurToggled(stat);
  };

  const toggleSmartThreading = (stat: boolean) => {
    setClassicActive(stat);
    onClassicThreadingToggled(stat);
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

  const changeTags = (tags: string[]) => {
    setSelectedTags(tags);
    onChangeTags(tags);
  };

  return (
    <div className={style.section}>
      <div className={style.gridToggle}>
        <div
          className={`${clickable.clickable} ${style.leftToggle} ${
            blurActive ? style.active : ""
          }`}
          onClick={() => toggleSmartThreading(true)}
        >
          <Image
            src="/classic_threading.svg"
            height={20}
            width={20}
            alt="Classic threading icon."
          />
        </div>
        <div
          className={`${clickable.clickable} ${style.rightToggle} ${
            !blurActive ? style.active : ""
          }`}
          onClick={() => toggleSmartThreading(false)}
        >
          <Image
            src="/smart_threading.svg"
            height={20}
            width={20}
            alt="Smart threading icon."
          />
        </div>
      </div>
      <div className={style.gridToggle}>
        <div
          className={`${clickable.clickable} ${style.leftToggle} ${
            blurActive ? style.active : ""
          }`}
          onClick={() => toggleBlur(true)}
        >
          <Image
            src="/preview_off.svg"
            height={20}
            width={20}
            alt="Preview off icon."
          />
        </div>
        <div
          className={`${clickable.clickable} ${style.rightToggle} ${
            !blurActive ? style.active : ""
          }`}
          onClick={() => toggleBlur(false)}
        >
          <Image
            src="/preview.svg"
            height={20}
            width={20}
            alt="Preview on icon."
          />
        </div>
      </div>
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
      <TagSelection onChange={changeTags} selected={selectedTags} />
      <Image
        className={`${style.refreshIcon} ${clickable.clickable}`}
        src="/refresh.svg"
        height={20}
        width={20}
        alt="Refresh icon."
        onClick={onRefresh}
      />
    </div>
  );
};
