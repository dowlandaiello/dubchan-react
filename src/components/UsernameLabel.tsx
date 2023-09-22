import style from "./TimestampLabel.module.css";
import style2 from "./AuthorLabel.module.css";

/// A label displaying a username.
export const UsernameLabel = ({ username }: { username: string }) => {
  return (
    <p
      className={`${username != "dev" ? style.label : ""} ${
        username == "dev" ? style2.godLabel : style2.authorLabel
      }`}
    >
      @{username}
    </p>
  );
};
