import style from "./Tag.module.css";

export const Tag = ({ tag }: { tag: string }) => {
  return <div className={style.tag}>{tag}</div>;
};
