import style from "./AuthenticationModal.module.css";
import { useState, useEffect } from "react";
import { Button } from "./Button";
import { ErrorLabel } from "./ErrorLabel";
import { Captcha } from "./Captcha";
import { AuthSubmission } from "./AuthenticationModal";
import Skeleton from "react-loading-skeleton";

export const TripcodeModal = ({
  onSubmit,
  errorMsg,
}: {
  onSubmit: (sub: AuthSubmission) => void;
  errorMsg?: string;
}) => {
  const [username, setUsername] = useState<string | null>(null);
  const [password, setPassword] = useState<string>("");
  const [submitting, setSubmitting] = useState<Boolean>(false);

  const submit = (token: string) => {
    onSubmit({
      username: username ?? "",
      password: password,
      captcha_response: token,
    });
  };

  useEffect(() => {
    (async () => {
      const kp = await crypto.subtle.generateKey(
        {
          name: "RSA-OAEP",
          modulusLength: 4096,
          publicExponent: new Uint8Array([1, 0, 1]),
          hash: "SHA-256",
        },
        true,
        ["encrypt", "decrypt"]
      );
      const exported = await crypto.subtle.exportKey("pkcs8", kp.privateKey);
      const str = btoa(
        String.fromCharCode.apply(
          null,
          new Uint8Array(exported) as unknown as number[]
        )
      );
      setPassword(str.slice(0, 50));
      setUsername(str.slice(50, 58));
    })();
  }, []);

  useEffect(() => {
    if (errorMsg) setSubmitting(false);
  }, [errorMsg]);

  return (
    <div className={style.section}>
      {username !== null ? (
        <div className={style.aliasLine}>
          <p>Alias:</p>
          <input
            placeholder="Alias"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
      ) : (
        <Skeleton />
      )}
      {errorMsg && <ErrorLabel className={style.errorLabel} text={errorMsg} />}
      {submitting ? (
        <Captcha onSuccess={submit} />
      ) : (
        <Button text="Generate Tripcode" onClick={() => setSubmitting(true)} />
      )}
    </div>
  );
};
