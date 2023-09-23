import { Post } from "../model/post";
import Image from "next/image";
import Link from "next/link";
import style from "./PostThumbnail.module.css";
import clickable from "./Clickable.module.css";
import { PostBody } from "./PostBody";

export const PostThumbnail = ({
  post,
  blurred: initBlurred,
  compact,
}: {
  post?: Post;
  blurred: Boolean;
  compact?: Boolean;
}) => {
  return (
    <div className={`${style.post}`}>
      <PostBody post={post} blurred={initBlurred} compact={compact} />
      <div className={`${style.commentViewButton} ${clickable.clickable}`}>
        <Link href={{ pathname: "/", query: { post: post?.id ?? 0 } }}>
          <Image src="/forum.svg" alt="Forum icon" height={15} width={15} />
          Comments ({post?.n_comments ?? 0})
        </Link>
      </div>
    </div>
  );
};
