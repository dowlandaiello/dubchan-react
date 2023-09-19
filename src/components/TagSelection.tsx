import { Tag } from "./Tag";
import style from "./TagSelection.module.css";
import { useState } from "react";
import clickable from "./Clickable.module.css";

const AVAILABLE_TAGS = ["UW", "Fitness", "LGBT", "NSFW"];

/// A selection of tags which the user can select.
export const TagSelection = ({
  onChange,
  initSelected,
}: {
  onChange: (e: string[]) => void;
  initSelected: string[];
}) => {
  // Which tags are selected
  const [selected, setSelected] = useState<string[]>(initSelected);

  const toggleTag = (tag: string, selected: string[]) => {
    if (selected.includes(tag)) {
      let newSelected = selected.filter((t) => t !== tag);
      setSelected(newSelected);
      onChange(newSelected);
    } else {
      let newSelected = [tag, ...selected];
      setSelected(newSelected);
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
