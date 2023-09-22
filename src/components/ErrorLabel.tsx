import style from "./ErrorLabel.module.css";

export const ErrorLabel = ({
  text,
  className,
}: {
  text: string;
  className?: string;
}) => {
  return <p className={`${style.label} ${className}`}>Error: {text}</p>;
};
