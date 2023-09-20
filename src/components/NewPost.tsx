import style from "./NewPost.module.css";
import { TagSelection } from "./TagSelection";
import { NewPostBody } from "../model/post";
import { useState, useEffect, useRef } from "react";
import { FileUpload, ChangeEvent } from "./FileUpload";
import { UrlVidUpload } from "./UrlVidUpload";
import { Button } from "./Button";
import { Captcha } from "./Captcha";
import { route } from "../util/http";

/// A form for creating new posts.
export const NewPost = () => {
  const [postBody, setPostBody] = useState<NewPostBody>({
    title: "",
    text: "",
    author: undefined,
    tags: undefined,
    captcha_response: undefined,
  });
  const [formData, setFormData] = useState<FormData>(new FormData());
  const [captchaCallback, setCaptchaCallback] = useState<
    null | ((e: any) => void)
  >(null);

  const gotFile = (event: ChangeEvent<HTMLInputElement>) => {
    const e = event.target as HTMLInputElement;

    if (e.files && e.files.length) {
      const file = e.files[0];
      setFormData((formData) => {
        formData.delete("src");
        formData.append("data", file);
        return formData;
      });
    }
  };

  const gotVid = (url: string) => {
    setFormData((formData) => {
      formData.delete("data");
      formData.append("src", url);
      return formData;
    });
  };

  // Initiates a captcha and if succesful posts the post
  const post = () => {
    setCaptchaCallback(() => (e: string) => {
      setPostBody((body) => {
        return { ...body, captcha_response: e };
      });
    });
  };

  // Submit the post upon receiving a complete captcha
  useEffect(() => {
    if (!postBody.captcha_response || postBody.captcha_response == "") return;

    formData.append(
      "body",
      new Blob([JSON.stringify(postBody)], { type: "application/json" })
    );

    (async () => {
      await fetch(route("/posts"), { method: "POST", body: formData });
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

  return (
    <div className={style.section}>
      <div className={style.fields}>
        <div className={style.titleLine}>
          <h1>New Post</h1>
          <TagSelection
            onChange={(tags) =>
              setPostBody((post) => {
                return { ...post, tags: tags };
              })
            }
            initSelected={[]}
          />
        </div>
        <input
          className={style.underlined}
          placeholder="Post Title (max 100 chars)"
          onChange={updateTitle}
        />
        <textarea
          className={style.underlined}
          placeholder="Post Text (max 1000 chars)"
          onChange={updateText}
        />
        <div className={style.attachLine}>
          <div className={style.mediaButtons}>
            <FileUpload onChange={gotFile} />
            <UrlVidUpload onChange={gotVid} />
          </div>
          {captchaCallback !== null ? (
            <Captcha onSuccess={captchaCallback} />
          ) : (
            <Button className={style.postButton} text="Post" onClick={post} />
          )}
        </div>
      </div>
    </div>
  );
};
