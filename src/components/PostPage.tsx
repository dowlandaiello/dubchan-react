import style from "./PostPage.module.css";
import Image from "next/image";
import clickable from "./Clickable.module.css";
import { Post } from "../model/post";
import { useRouter } from "next/router";
import { route } from "../util/http";
import { PostBody } from "./PostBody";
import { useState, useEffect } from "react";
import { NewComment } from "./NewComment";

export const PostPage = ({
  className,
  postId,
}: {
  className?: string;
  postId?: number;
}) => {
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);

  useEffect(() => {
    if (!postId) return;

    (async () => {
      // Load the post
      const post = await (await fetch(route(`/posts/${postId}`))).json();

      setPost(post);
    })();
  }, [postId]);

  return (
    <div className={`${style.container} ${className}`}>
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
        <NewComment key={postId} parentPost={postId ?? 0} />
      </div>
    </div>
  );
};
