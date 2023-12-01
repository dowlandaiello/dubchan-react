import style from "./PollPreview.module.css";
import Image from "next/image";
import clickable from "./Clickable.module.css";

export const PollPreview = ({
  className,
  options,
  onChangeOption,
  onAddOption,
  onRemoveOption,
}: {
  className?: string;
  options: string[];
  onChangeOption: (index: number, newVal: string) => void;
  onAddOption: () => void;
  onRemoveOption: (index: number) => void;
}) => {
  const labels = options.map((opt, i) => (
    <div className={style.optionContainer} key={i}>
      <input
        type="text"
        placeholder="Add an option here (max 100 chars)."
        maxLength={100}
        value={opt}
        onChange={(e) => onChangeOption(i, e.target.value)}
      />
      <Image
        className={clickable.clickable}
        src="/close.svg"
        height={15}
        width={15}
        alt="Remove option icon."
        onClick={() => onRemoveOption(i)}
      />
    </div>
  ));

  return (
    <div className={`${style.section} ${className}`}>
      {labels}
      <div
        className={`${style.optionContainer} ${style.newButton} ${clickable.clickable}`}
        onClick={onAddOption}
      >
        <Image src="/add.svg" height={20} width={20} alt="Plus icon." />{" "}
        <p>New Option</p>
      </div>{" "}
    </div>
  );
};
