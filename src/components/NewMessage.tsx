import style from "./NewComment.module.css";
import { NewMessageBody, emptyMessage } from "../model/message";
import { useKeypair } from "../model/key_pair";
import { useState, ChangeEvent, useEffect, useContext, useRef } from "react";
import { ErrorLabel } from "./ErrorLabel";
import { FileUpload } from "./FileUpload";
import { UrlVidUpload } from "./UrlVidUpload";
import { UrlImageUpload } from "./UrlImageUpload";
import { Button } from "./Button";
import { route } from "../util/http";
import { removeIdentity } from "../util/cookie";
import { AuthenticationContext } from "./AccountSelection";
import { MediaPreview } from "./MediaPreview";
import Image from "next/image";
import clickable from "./Clickable.module.css";
import Compressor from "compressorjs";
import { encrypt } from "../util/crypto";

export const NewMessage = ({
  user_id,
  onSubmitted,
  className,
  parentMessage,
  onClear,
}: {
  className?: string;
  user_id: string;
  onSubmitted?: () => void;
  parentMessage?: number;
  onClear?: () => void;
}) => {
  const [{ activeUser, users }] = useContext(AuthenticationContext);
  const activeKeypair = useKeypair(user_id);
  const selfKeypair = useKeypair(activeUser);
  const [messageBody, setMessageBody] = useState<NewMessageBody>(emptyMessage);
  const [formData, setFormData] = useState<FormData>(new FormData());
  const [previewSrc, setPreviewSrc] = useState<null | string>(null);
  const [errorMsg, setErrorMsg] = useState<null | string>(null);

  // Used for calculating preview window size
  const windowRef = useRef<HTMLDivElement | null>(null);
  const textInputRef = useRef<HTMLTextAreaElement | null>(null);
  const [[previewWidth, previewHeight], setPreviewDims] = useState<
    [number, number]
  >([0, 0]);

  const updateText = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setMessageBody((msg) => {
      return { ...msg, text: e.target.value, text_sender: e.target.value };
    });
  };

  const gotFile = (event: ChangeEvent<HTMLInputElement>) => {
    const e = event.target as HTMLInputElement;

    if (e.files && e.files.length) {
      const file = e.files[0];
      new Compressor(file, {
        quality: 0.6,
        success(result) {
          setFormData((formData) => {
            formData.delete("src");
            formData.append("data", result);
            return formData;
          });
        },
        error(err) {
          setErrorMsg(err.message);
        },
      });

      const reader = new FileReader();

      reader.readAsDataURL(file);
      reader.onload = () => {
        if (typeof reader.result == "string") setPreviewSrc(reader.result);
      };
    }
  };

  const gotVid = (url: string) => {
    setFormData((formData) => {
      formData.delete("data");
      formData.append("src", url);
      setPreviewSrc(url);
      return formData;
    });
  };

  const post = async () => {
    if (!activeKeypair || !selfKeypair) return;

    const nonce = await (await fetch(route("/nonce"))).json();

    const textUser = encrypt(
      messageBody.text,
      nonce + 1,
      selfKeypair,
      activeKeypair
    );
    const textSelf = encrypt(
      messageBody.text,
      nonce + 1,
      selfKeypair,
      selfKeypair
    );

    formData.append(
      "body",
      new Blob(
        [
          JSON.stringify({
            ...messageBody,
            text: textUser,
            text_sender: textSelf,
            sender: activeUser,
            user_id: user_id,
            parent_message: parentMessage,
          }),
        ],
        {
          type: "application/json",
        }
      )
    );

    const headers = activeUser
      ? {
          Authorization: users[activeUser]?.token ?? "",
        }
      : undefined;
    const resp = await fetch(route("/messages"), {
      method: "POST",
      body: formData,
      headers: headers,
    });

    if (resp.status === 200) {
      clear();

      if (onSubmitted) onSubmitted();
    } else if (resp.status === 401) {
      setErrorMsg(await resp.text());
      removeIdentity(activeUser ?? "");
      setFormData((form) => {
        form.delete("body");
        return form;
      });
    } else {
      setErrorMsg(await resp.text());
      setFormData((form) => {
        form.delete("body");
        return form;
      });
    }
  };

  // Clears post info
  const clear = () => {
    setMessageBody(emptyMessage);
    setFormData(new FormData());
    setPreviewSrc(null);
    setErrorMsg(null);
  };

  const deleteAll = () => {
    clear();

    if (onClear) onClear();
  };

  useEffect(() => {
    if (!windowRef.current || windowRef.current == null) return;

    const elem = windowRef.current;
    const computedStyle = getComputedStyle(elem);

    let elementHeight = elem.clientHeight;
    let elementWidth = elem.clientWidth;

    elementHeight -=
      parseFloat(computedStyle.paddingTop) +
      parseFloat(computedStyle.paddingBottom);
    elementWidth -=
      parseFloat(computedStyle.paddingLeft) +
      parseFloat(computedStyle.paddingRight);

    setPreviewDims([elementWidth * 0.3, elementHeight]);
  }, [windowRef.current, windowRef.current?.clientHeight ?? 0]);

  useEffect(() => {
    if (!textInputRef.current) return;

    const listener = (e: KeyboardEvent) => {
      if (e.key == "Enter") {
        e.preventDefault();
        post();
      }
    };

    textInputRef.current.addEventListener("keypress", listener);

    return () => {
      if (!textInputRef.current) return;

      textInputRef.current.removeEventListener("keypress", listener);
    };
  }, [textInputRef, textInputRef.current]);

  const removeMedia = () => {
    formData.delete("src");
    formData.delete("data");
    setPreviewSrc(null);
  };

  return (
    <div className={`${style.section} ${className}`} ref={windowRef}>
      {previewSrc && (
        <MediaPreview
          src={previewSrc}
          className={style.preview}
          onRemove={removeMedia}
          width={previewWidth == 0 ? undefined : previewWidth}
          height={previewHeight == 0 ? undefined : previewHeight}
        />
      )}
      <div className={style.fields}>
        <textarea
          className={style.underlined}
          rows={6}
          placeholder="Send a message"
          onChange={updateText}
          value={messageBody.text}
          ref={textInputRef}
        />
        <div className={style.attachLine}>
          <div className={style.mediaButtons}>
            <Image
              className={`${clickable.clickable} ${style.trashIcon}`}
              src="/trash.svg"
              height={15}
              width={15}
              alt="Trash icon."
              onClick={deleteAll}
            />
            <UrlImageUpload onChange={gotVid} />
            <FileUpload onChange={gotFile} />
            <UrlVidUpload onChange={gotVid} />
          </div>
          {errorMsg && (
            <ErrorLabel className={style.errorLabel} text={errorMsg} />
          )}
          <div className={style.authorDisplay}>
            <p>
              Messaging as <b>{activeUser ? `@${activeUser}` : "Anonymous"}</b>
            </p>
            <Button className={style.postButton} text="Post" onClick={post} />
          </div>
        </div>
      </div>
    </div>
  );
};
