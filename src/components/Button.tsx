import style from "./Button.module.css";
import clickable from "./Clickable.module.css";

export const Button = ({
  text,
  onClick,
  className,
}: {
  text: string;
  onClick: () => void;
  className?: string;
}) => {
  return (
    <div
      className={`${clickable.clickable} ${style.button} ${className}`}
      onClick={onClick}
    >
      {text}
    </div>
  );
};
