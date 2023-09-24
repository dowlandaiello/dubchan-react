import style from "./PostPage.module.css";
import Image from "next/image";
import clickable from "./Clickable.module.css";
import { Post } from "../model/post";
import { useRouter } from "next/router";
import { route } from "../util/http";
import { PostBody } from "./PostBody";
import { useState, useEffect } from "react";

export const PostPage = ({ postId }: { postId: number }) => {
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);

  useEffect(() => {
    (async () => {
      // Load the post
      const post = await (await fetch(route(`/posts/${postId}`))).json();

      setPost(post);
    })();
  }, [postId]);

  return (
    <div className={style.container}>
      <div className={style.section}>
        <div className={style.navSection}>
          <Image
            className={clickable.clickable}
            src="/back.svg"
            height={30}
            width={30}
            alt="Back button."
            onClick={router.back}
          />
        </div>
        {post ? (
          <PostBody
            key="loaded"
            className={style.body}
            blurred={true}
            post={post}
          />
        ) : (
          <PostBody
            key="loading"
            className={style.loadingBody}
            blurred={false}
          />
        )}
      </div>
    </div>
  );
};
