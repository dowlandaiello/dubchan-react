import { Poll } from "../model/poll";
import style from "./PollPreview.module.css";
import clickable from "./Clickable.module.css";
import { useState } from "react";
import Image from "next/image";

export const PollDisplay = ({
  className,
  polls,
  onSelectChoice,
  onUnselectChoice,
  initSelected,
}: {
  className?: string;
  polls: Poll[];
  onSelectChoice: (choice: number) => void;
  onUnselectChoice: (choice: number) => void;
  initSelected: number | null;
}) => {
  const total = polls.reduce((accum, curr) => accum + curr.votes, 0);
  const [selected, setSelected] = useState<number | null>(initSelected);

  const select = (toSelect: number) => {
    if (toSelect === selected) return;

    setSelected(toSelect);

    polls.forEach((_, i) => {
      if (i !== selected || selected === null) {
        return;
      }

      onUnselectChoice(i);
    });

    onSelectChoice(toSelect);
  };

  const labels = polls.map((opt, i) => (
    <div
      className={`${style.optionContainer} ${clickable.clickable} ${
        selected == i ? style.selected : ""
      } `}
      onClick={() => select(i)}
      key={i}
    >
      <div className={style.leftArea}>
        <p>
          {opt.votes == 0 ? 0 : Math.trunc((opt.votes / total) * 1000) / 10}%
        </p>
        <p>{opt.votes.toLocaleString()}</p>
      </div>
      <div className={style.rightArea}>
        <p>{opt.option}</p>
        {selected === i && (
          <Image src="/check.svg" height={15} width={15} alt="Check." />
        )}
      </div>
    </div>
  ));

  return <div className={`${style.section} ${className}`}>{labels}</div>;
};
