import style from "./NewComment.module.css";
import { NewCommentBody, emptyComment } from "../model/comment";
import { useState, ChangeEvent, useEffect, useContext, useRef } from "react";
import { ErrorLabel } from "./ErrorLabel";
import { FileUpload } from "./FileUpload";
import { UrlVidUpload } from "./UrlVidUpload";
import { Captcha } from "./Captcha";
import { Button } from "./Button";
import { route } from "../util/http";
import { removeIdentity } from "../util/cookie";
import { AuthenticationContext } from "./AccountSelection";
import { MediaPreview } from "./MediaPreview";

export const NewComment = ({
  parentPost,
  parentComment,
  onSubmitted,
}: {
  parentPost: number;
  parentComment?: number;
  onSubmitted?: () => void;
}) => {
  const [{ activeUser, users }] = useContext(AuthenticationContext);
  const [commentBody, setCommentBody] = useState<NewCommentBody>(emptyComment);
  const [formData, setFormData] = useState<FormData>(new FormData());
  const [captchaCallback, setCaptchaCallback] = useState<
    null | ((e: any) => void)
  >(null);
  const [previewSrc, setPreviewSrc] = useState<null | string>(null);
  const [errorMsg, setErrorMsg] = useState<null | string>(null);

  // Used for calculating preview window size
  const windowRef = useRef<HTMLDivElement | null>(null);
  const [[previewWidth, previewHeight], setPreviewDims] = useState<
    [number, number]
  >([0, 0]);

  const updateText = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setCommentBody((comment) => {
      return { ...comment, text: e.target.value };
    });
  };

  const gotFile = (event: ChangeEvent<HTMLInputElement>) => {
    const e = event.target as HTMLInputElement;

    if (e.files && e.files.length) {
      const file = e.files[0];
      setFormData((formData) => {
        formData.delete("src");
        formData.append("data", file);
        return formData;
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

  const post = () => {
    setCaptchaCallback(() => (e: string) => {
      setCommentBody((body) => {
        return { ...body, captcha_response: e };
      });
    });
  };

  // Clears post info
  const clear = () => {
    setCommentBody(emptyComment);
    setFormData(new FormData());
    setPreviewSrc(null);
    setCaptchaCallback(null);
    setErrorMsg(null);
  };

  // Submit the post upon receiving a complete captcha
  useEffect(() => {
    if (!commentBody.captcha_response || commentBody.captcha_response == "")
      return;

    formData.append(
      "body",
      new Blob(
        [
          JSON.stringify({
            ...commentBody,
            author: activeUser,
            parent_comment: parentComment,
          }),
        ],
        {
          type: "application/json",
        }
      )
    );

    (async () => {
      const headers = activeUser
        ? {
            Authorization: users[activeUser]?.token ?? "",
          }
        : undefined;
      const resp = await fetch(route(`/posts/${parentPost}/comments`), {
        method: "POST",
        body: formData,
        headers: headers,
      });

      if (resp.status === 200) {
        clear();

        if (onSubmitted) onSubmitted();
      } else if (resp.status === 401) {
        setErrorMsg(await resp.text());
        setCaptchaCallback(null);
        removeIdentity(activeUser ?? "");
      } else {
        setErrorMsg(await resp.text());
        setCaptchaCallback(null);
      }
    })();
  }, [commentBody]);

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

  const removeMedia = () => {
    formData.delete("src");
    formData.delete("data");
    setPreviewSrc(null);
  };

  return (
    <div className={style.section} ref={windowRef}>
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
          placeholder="Post a reply"
          onChange={updateText}
          value={commentBody.text}
        />
        <div className={style.attachLine}>
          <div className={style.mediaButtons}>
            <FileUpload onChange={gotFile} />
            <UrlVidUpload onChange={gotVid} />
          </div>
          {errorMsg && (
            <ErrorLabel className={style.errorLabel} text={errorMsg} />
          )}
          {captchaCallback !== null ? (
            <Captcha onSuccess={captchaCallback} />
          ) : (
            <div className={style.authorDisplay}>
              <p>
                Posting as <b>{activeUser ? `@${activeUser}` : "Anonymous"}</b>
              </p>
              <Button className={style.postButton} text="Post" onClick={post} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
