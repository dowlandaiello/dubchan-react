import { Tag } from "./Tag";
import style from "./TagSelection.module.css";
import { useState } from "react";
import clickable from "./Clickable.module.css";

const AVAILABLE_TAGS = ["UW", "Fitness", "LGBT", "NSFW"];

/// A selection of tags which the user can select.
export const TagSelection = ({
  onChange,
  selected,
}: {
  onChange: (e: string[]) => void;
  selected: string[];
}) => {
  const toggleTag = (tag: string, selected: string[]) => {
    if (selected.includes(tag)) {
      let newSelected = selected.filter((t) => t !== tag);
      onChange(newSelected);
    } else {
      let newSelected = [tag, ...selected];
      onChange(newSelected);
    }
  };

  const tags = AVAILABLE_TAGS.map((tag) => (
    <Tag
      onClick={() => toggleTag(tag, selected)}
      className={`${selected.includes(tag) ? style.selected : ""} ${
        clickable.clickable
      }`}
      key={tag}
      tag={tag}
    />
  ));

  return <div className={style.row}>{tags}</div>;
};
