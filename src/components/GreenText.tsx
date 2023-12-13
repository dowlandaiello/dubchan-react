import style from "./GreenText.module.css";

export const GreenText = ({ children }: { children: string }) => {
  const lines = children.split("\n").map((line, i) =>
    line.startsWith(">") ? (
      <p className={style.greenLine} key={i}>
        {line}
      </p>
    ) : (
      <p className={style.linef} key={i}>
        {line}
      </p>
    )
  );
  return <>{lines}</>;
};
