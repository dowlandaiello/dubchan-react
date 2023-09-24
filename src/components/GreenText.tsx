import style from "./GreenText.module.css";

export const GreenText = ({ children }: { children: string }) => {
  const lines = children.split("\n").map((line) =>
    line.startsWith(">") ? (
      <p className={style.greenLine} key={line}>
        {line}
      </p>
    ) : (
      <p className={style.line} key={line}>
        {line}
      </p>
    )
  );
  return <>{lines}</>;
};
