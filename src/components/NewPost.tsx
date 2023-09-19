import style from "./NewPost.module.css";
import { TagSelection } from "./TagSelection";
import { NewPostBody } from "../model/post";
import { useState } from "react";
import { FileUpload, ChangeEvent } from "./FileUpload";
import { UrlVidUpload } from "./UrlVidUpload";
import { Button } from "./Button";

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
  const post = () => {};

  return (
    <div className={style.section}>
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
      />
      <textarea
        className={style.underlined}
        placeholder="Post Text (max 1000 chars)"
      />
      <div className={style.attachLine}>
        <div className={style.mediaButtons}>
          <FileUpload onChange={gotFile} />
          <UrlVidUpload onChange={gotVid} />
        </div>
        <Button className={style.postButton} text="Post" onClick={post} />
      </div>
    </div>
  );
};
