import style from "./Tag.module.css";

export const Tag = ({
  tag,
  onClick,
  className,
}: {
  className?: string | undefined;
  onClick?: () => void | undefined;
  tag: string;
}) => {
  return (
    <div className={`${style.tag} ${className}`} onClick={onClick}>
      {tag}
    </div>
  );
};
