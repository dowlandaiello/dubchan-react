import style from "./PostPage.module.css";
import Image from "next/image";
import clickable from "./Clickable.module.css";
import { Post } from "../model/post";
import { useRouter } from "next/router";
import { PostBody } from "./PostBody";
import { useState } from "react";

export const PostPage = ({ postId }: { postId: number }) => {
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);

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
          <PostBody blurred={true} post={post} />
        ) : (
          <PostBody className={style.loadingBody} blurred={false} />
        )}
      </div>
    </div>
  );
};
