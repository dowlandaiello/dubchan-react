import style from "./AuthenticationModal.module.css";
import { useState, useEffect } from "react";
import { Button } from "./Button";
import { ErrorLabel } from "./ErrorLabel";
import { Captcha } from "./Captcha";

export interface AuthSubmission {
  username: string;
  password: string;
  captcha_response: string;
}

export const AuthenticationModal = ({
  onSubmit,
  errorMsg,
}: {
  onSubmit: (sub: AuthSubmission) => void;
  errorMsg?: string;
}) => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [submitting, setSubmitting] = useState<Boolean>(false);

  const submit = (token: string) => {
    onSubmit({
      username: username,
      password: password,
      captcha_response: token,
    });
  };

  useEffect(() => {
    if (errorMsg) setSubmitting(false);
  }, [errorMsg]);

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
      {errorMsg && <ErrorLabel className={style.errorLabel} text={errorMsg} />}
      {submitting ? (
        <Captcha onSuccess={submit} />
      ) : (
        <Button text="Submit" onClick={() => setSubmitting(true)} />
      )}
    </div>
  );
};
