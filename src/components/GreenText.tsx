import style from "./GreenText.module.css";
import clickable from "./Clickable.module.css";

export const GreenText = ({ children }: { children: string }) => {
  const lineParts = children.split("\n").map((line) => line.split("https"));

  const lines = lineParts.map((lineParts, i) => (
    <div className={style.line} key={i}>
      {lineParts.map((line, j) =>
        line.startsWith(">") ? (
          <p className={style.greenLine} key={`${i}_${j}`}>
            {line}
          </p>
        ) : line.startsWith("://") ? (
          <a
            href={`https${line}`}
            target="_blank"
            key={`${i}_${j}`}
            className={clickable.clickable}
          >
            https{line}
          </a>
        ) : (
          <p key={`${i}_${j}`}>{line}</p>
        )
      )}
    </div>
  ));
  return <>{lines}</>;
};
