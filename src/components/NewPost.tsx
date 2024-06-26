import style from "./NewPost.module.css";
import { TagSelection } from "./TagSelection";
import { NewPostBody, emptyPost } from "../model/post";
import { useState, useEffect, useRef, useContext } from "react";
import { FileUpload, ChangeEvent } from "./FileUpload";
import { UrlImageUpload } from "./UrlImageUpload";
import { UrlVidUpload } from "./UrlVidUpload";
import { PollUpload } from "./PollUpload";
import { PollPreview } from "./PollPreview";
import { Button } from "./Button";
import { Captcha } from "./Captcha";
import { route } from "../util/http";
import { removeIdentity } from "../util/cookie";
import { MediaPreview } from "./MediaPreview";
import { ErrorLabel } from "./ErrorLabel";
import { AuthenticationContext } from "./AccountSelection";
import { Toggle } from "./Toggle";
import Compressor from "compressorjs";
import Image from "next/image";

/// A form for creating new posts.
export const NewPost = ({ onSubmitted }: { onSubmitted?: () => void }) => {
  const [{ activeUser, users }] = useContext(AuthenticationContext);
  const [postBody, setPostBody] = useState<NewPostBody>(emptyPost);
  const [formData, setFormData] = useState<FormData>(new FormData());
  const [captchaCallback, setCaptchaCallback] = useState<
    null | ((e: any) => void)
  >(null);
  const [previewSrc, setPreviewSrc] = useState<null | string>(null);
  const [errorMsg, setErrorMsg] = useState<null | string>(null);
  const [pollOptions, setPollOptions] = useState<null | string[]>(null);

  // Used for calculating preview window size
  const windowRef = useRef<HTMLDivElement | null>(null);
  const [[previewWidth, previewHeight], setPreviewDims] = useState<
    [number, number]
  >([0, 0]);

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

  const gotPoll = () => {
    setPollOptions([""]);
  };

  // Initiates a captcha and if succesful posts the post
  const post = () => {
    setCaptchaCallback(() => (e: string) => {
      setPostBody((body) => {
        return { ...body, captcha_response: e };
      });
    });
  };

  // Clears post info
  const clear = () => {
    setPostBody(emptyPost);
    setFormData(new FormData());
    setPreviewSrc(null);
    setCaptchaCallback(null);
    setErrorMsg(null);
    setPollOptions(null);
  };

  // Submit the post upon receiving a complete captcha
  useEffect(() => {
    if (!postBody.captcha_response || postBody.captcha_response == "") return;

    formData.append(
      "body",
      new Blob(
        [
          JSON.stringify({
            ...postBody,
            author: activeUser,
            poll_options: pollOptions ? pollOptions : undefined,
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
      const resp = await fetch(route("/posts"), {
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
        setPostBody((body) => {
          return { ...body, captcha_response: undefined };
        });
        setFormData((form) => {
          form.delete("body");
          return form;
        });
      } else {
        setErrorMsg(await resp.text());
        setCaptchaCallback(null);
        setPostBody((body) => {
          return { ...body, captcha_response: undefined };
        });
        setFormData((form) => {
          form.delete("body");
          return form;
        });
      }
    })();
  }, [postBody]);

  const updateTitle = (e: ChangeEvent<HTMLInputElement>) => {
    setPostBody((postBody) => {
      return {
        ...postBody,
        title: e.target.value,
      };
    });
  };

  const updateText = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setPostBody((postBody) => {
      return {
        ...postBody,
        text: e.target.value,
      };
    });
  };

  const updateLive = (state: boolean) => {
    setPostBody((postBody) => {
      return { ...postBody, live: state };
    });
  };

  const updateOptions = (index: number, state: string) => {
    setPollOptions(
      (pollOptions) =>
        pollOptions?.map((v, i) => (i == index ? state : v)) ?? null
    );
  };

  const removeOption = (index: number) => {
    if (!pollOptions) return;

    if (pollOptions.length == 1) {
      setPollOptions(null);

      return;
    }

    setPollOptions(
      (pollOptions) => pollOptions?.filter((_, i) => i != index) ?? null
    );
  };

  const addOption = () => {
    setPollOptions((pollOptions) =>
      pollOptions ? [...pollOptions, ""] : [""]
    );
  };

  const removeMedia = () => {
    formData.delete("src");
    formData.delete("data");
    setPreviewSrc(null);
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
      {pollOptions && (
        <PollPreview
          className={style.pollPreview}
          options={pollOptions}
          onChangeOption={updateOptions}
          onAddOption={addOption}
          onRemoveOption={removeOption}
        />
      )}
      <div className={style.fields}>
        <div className={style.titleLine}>
          <h1>New Post</h1>
        </div>
        <div className={style.metaLine}>
          <div className={style.tagSelection}>
            <div className={style.tagSelectionLabel}>
              <Image src="/tag.svg" height={15} width={15} alt="Tag icon." />
              <p>Tags</p>
            </div>
            <TagSelection
              onChange={(tags) =>
                setPostBody((post) => {
                  return { ...post, tags: tags };
                })
              }
              selected={postBody.tags ?? []}
            />
          </div>
          <div className={style.liveSelection}>
            <Image
              src="/broadcast.svg"
              height={15}
              width={15}
              alt="Broadcast icon."
            />
            <Toggle text="Live" onChange={updateLive} init={false} />
          </div>
        </div>
        <input
          className={style.underlined}
          placeholder="Post Title (max 100 chars)"
          onChange={updateTitle}
          value={postBody.title}
          maxLength={100}
        />
        <textarea
          className={style.underlined}
          placeholder="Post Text (max 1000 chars)"
          rows={5}
          onChange={updateText}
          value={postBody.text}
          maxLength={1000}
        />
        <div className={style.attachLine}>
          <div className={style.mediaButtons}>
            <UrlImageUpload onChange={gotVid} />
            <FileUpload onChange={gotFile} />
            <UrlVidUpload onChange={gotVid} />
            <PollUpload onClick={gotPoll} />
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
