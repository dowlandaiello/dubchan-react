import style from "./AuthenticationModal.module.css";
import { useState } from "react";
import { Button } from "./Button";

export interface AuthSubmission {
  username: string;
  password: string;
}

export const AuthenticationModal = ({
  onSubmit,
}: {
  onSubmit: (sub: AuthSubmission) => void;
}) => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  return (
    <div className={style.section}>
      <input
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button
        text="Submit"
        onClick={() => onSubmit({ username: username, password: password })}
      />
    </div>
  );
};
