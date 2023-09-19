import { Post } from "../model/post";
import Image from "next/image";
import style from "./PostThumbnail.module.css";
import clickable from "./Clickable.module.css";
import { TimestampLabel } from "./TimestampLabel";
import { uiRoute } from "../util/http";
import { CopyLink } from "./CopyLink";
import { Tag } from "./Tag";
import { MediaViewer } from "./MediaViewer";
import { UsernameLabel } from "./UsernameLabel";
import { useState } from "react";

export const PostThumbnail = ({ post }: { post: Post }) => {
  const tags =
    post.tags
      ?.filter((tag) => tag !== null)
      .map((tag) => (tag === null ? <> </> : <Tag key={tag} tag={tag} />)) ??
    [];

  const [expanded, setExpanded] = useState<Boolean>(false);

  return (
    <div className={`${style.post} ${expanded ? style.expanded : ""}`}>
      <div className={style.titleLine}>
        <h1>{post.title}</h1>
        <TimestampLabel timestamp={post.posted_at} />
        <div className={style.titleLineRight}>
          <CopyLink link={uiRoute(`/posts/${post.id}`)} />
          <div className={style.tagList}>{tags}</div>
        </div>
      </div>
      {post.user_id && <UsernameLabel username={post.user_id} />}
      <p>{post.text} </p>
      {post.src && (
        <MediaViewer
          className={`${style.media} ${expanded ? style.expanded : ""}`}
          src={post.src}
          onClick={() => setExpanded(!expanded)}
        />
      )}
      <div className={`${style.commentViewButton} ${clickable.clickable}`}>
        <Image src="/forum.svg" alt="Forum icon" height={15} width={15} />
        Comments ({post.n_comments})
      </div>
    </div>
  );
};
