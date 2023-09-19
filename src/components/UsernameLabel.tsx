import style from "./TimestampLabel.module.css";

/// A label displaying a username.
export const UsernameLabel = ({ username }: { username: string }) => {
  return <p className={style.label}>@{username}</p>;
};
