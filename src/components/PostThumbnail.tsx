import { Post } from "../model/post";
import Image from "next/image";
import style from "./PostThumbnail.module.css";
import clickable from "./Clickable.module.css";
import { TimestampLabel } from "./TimestampLabel";
import { CopyLink } from "./CopyLink";
import { Tag } from "./Tag";
import { MediaViewer } from "./MediaViewer";
import { UsernameLabel } from "./UsernameLabel";
import { useState, useRef, useEffect } from "react";

export const PostThumbnail = ({ post }: { post: Post }) => {
  const tags =
    post.tags
      ?.filter((tag) => tag !== null)
      .map((tag) => (tag === null ? <> </> : <Tag key={tag} tag={tag} />)) ??
    [];

  const [expanded, setExpanded] = useState<Boolean>(false);
  const thumbnailRef = useRef<HTMLDivElement | null>(null);
  const [[previewWidth, previewHeight], setPreviewDims] = useState<
    [number, number]
  >([0, 0]);

  useEffect(() => {
    if (!thumbnailRef.current || thumbnailRef.current == null) return;

    const elem = thumbnailRef.current;
    let elementWidth = elem.clientWidth;

    setPreviewDims([expanded ? elementWidth * 0.6 : elementWidth * 0.3, 0]);
  }, [thumbnailRef.current, thumbnailRef.current?.clientHeight ?? 0]);

  return (
    <div
      className={`${style.post} ${expanded ? style.expanded : ""}`}
      ref={thumbnailRef}
    >
      <div className={style.titleLine}>
        <h1>{post.title}</h1>
        <TimestampLabel timestamp={post.posted_at} />
        <div className={style.titleLineRight}>
          <CopyLink link={`/posts/${post.id}`} />
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
          height={previewHeight == 0 ? undefined : previewHeight}
          width={previewWidth == 0 ? undefined : previewWidth}
        />
      )}
      <div className={`${style.commentViewButton} ${clickable.clickable}`}>
        <Image src="/forum.svg" alt="Forum icon" height={15} width={15} />
        Comments ({post.n_comments})
      </div>
    </div>
  );
};
