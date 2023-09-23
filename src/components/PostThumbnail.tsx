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
import { uiRoute } from "../util/http";

export const PostThumbnail = ({
  post,
  blurred: initBlurred,
  compact,
}: {
  post: Post;
  blurred: Boolean;
  compact?: Boolean;
}) => {
  const tags =
    post.tags
      ?.filter((tag) => tag !== null)
      .map((tag) => (tag === null ? <> </> : <Tag key={tag} tag={tag} />)) ??
    [];

  const thumbnailRef = useRef<HTMLDivElement | null>(null);
  const [[previewWidth, previewHeight], setPreviewDims] = useState<
    [number, number]
  >([0, 0]);
  const [startingBlurred] = useState<Boolean>(initBlurred);
  const [blurredLocal, setBlurred] = useState<Boolean>(initBlurred);
  const blurred = initBlurred !== startingBlurred ? initBlurred : blurredLocal;

  useEffect(() => {
    if (!thumbnailRef.current || thumbnailRef.current == null) return;

    const elem = thumbnailRef.current;
    let elementWidth = elem.clientWidth;

    setPreviewDims(compact ? [elementWidth * 1, 0] : [elementWidth * 0.3, 0]);
  }, [thumbnailRef.current, thumbnailRef.current?.clientHeight ?? 0]);

  return (
    <div className={`${style.post}`} ref={thumbnailRef}>
      <div className={style.titleLine}>
        <h1>{post.title}</h1>
        <div className={style.titleLineRight}>
          <CopyLink link={uiRoute(`/posts/${post.id}`)} />
          <div className={style.tagList}>{tags}</div>
        </div>
      </div>
      <div className={style.authorLine}>
        {post.user_id && <UsernameLabel username={post.user_id} />}
        <TimestampLabel timestamp={post.posted_at} />
      </div>
      <p>{post.text} </p>
      {post.src && (
        <div
          className={`${style.media} ${
            compact ? style.bigMediaContainer : style.mediaContainer
          }`}
          onClick={() => setBlurred(!blurred)}
        >
          {blurred && (
            <div className={style.iconContainer}>
              <Image
                className={`${style.hideIcon} ${clickable.clickable}`}
                src="/hide.svg"
                height={30}
                width={30}
                alt="Hide icon."
              />
            </div>
          )}
          <MediaViewer
            title={post.title}
            className={`${style.media} ${blurred ? style.blurred : ""}`}
            src={post.src}
            height={previewHeight == 0 ? undefined : previewHeight}
            width={previewWidth == 0 ? undefined : previewWidth}
          />
        </div>
      )}
      <div className={`${style.commentViewButton} ${clickable.clickable}`}>
        <Image src="/forum.svg" alt="Forum icon" height={15} width={15} />
        Comments ({post.n_comments})
      </div>
    </div>
  );
};
