import { Post } from "../model/post";
import { useEffect, useState, useRef } from "react";
import { useUiRoute } from "../util/http";
import { Tag } from "./Tag";
import style from "./PostThumbnail.module.css";
import { CopyLink } from "./CopyLink";
import { UsernameLabel } from "./UsernameLabel";
import { TimestampLabel } from "./TimestampLabel";
import { MediaViewer } from "./MediaViewer";
import clickable from "./Clickable.module.css";
import Image from "next/image";
import { GreenText } from "./GreenText";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export const PostBody = ({
  className,
  mediaClassName,
  post,
  blurred: initBlurred,
  compact,
  deletable,
  onClickDelete,
}: {
  className?: string;
  mediaClassName?: string;
  post?: Post;
  blurred: Boolean;
  compact?: Boolean;
  deletable?: Boolean;
  onClickDelete?: () => void;
}) => {
  const tags = post
    ? post.tags
        ?.filter((tag) => tag !== null)
        .map((tag) => (tag === null ? <> </> : <Tag key={tag} tag={tag} />)) ??
      []
    : [];

  const thumbnailRef = useRef<HTMLDivElement | null>(null);
  const [[previewWidth, previewHeight], setPreviewDims] = useState<
    [number, number]
  >([0, 0]);
  const [startingBlurred, _] = useState<Boolean>(initBlurred);
  const [blurredLocal, setBlurred] = useState<Boolean>(initBlurred);
  const blurred = initBlurred !== startingBlurred ? initBlurred : blurredLocal;
  const postUrl = useUiRoute(`?post=${post?.id ?? 0}`);

  useEffect(() => {
    if (!thumbnailRef.current || thumbnailRef.current == null) return;

    const elem = thumbnailRef.current;
    let elementWidth = elem.clientWidth;

    setPreviewDims(compact ? [elementWidth * 1, 0] : [elementWidth * 0.3, 0]);
  }, [thumbnailRef.current, thumbnailRef.current?.clientHeight ?? 0]);

  return (
    <div className={`${style.postBody} ${className}`} ref={thumbnailRef}>
      <div className={style.titleLine}>
        {post ? (
          <h1>{post?.title}</h1>
        ) : (
          <Skeleton containerClassName={style.flex1} height="2em" />
        )}
        <div className={style.titleLineRight}>
          {deletable && (
            <div className={style.viewsLabel}>
              {post?.views ?? 0}
              <Image src="/eye.svg" height={15} width={15} alt="Views icon." />
            </div>
          )}
          <CopyLink link={postUrl} />
          {deletable && (
            <Image
              src="/trash.svg"
              className={`${clickable.clickable} ${style.removeIcon}`}
              height={15}
              width={15}
              alt="Delete icon."
              onClick={onClickDelete}
            />
          )}
        </div>
        <div className={style.tagList}>{tags}</div>
      </div>
      <div className={style.authorLine}>
        {post ? (
          post.user_id && <UsernameLabel username={post.user_id} />
        ) : (
          <Skeleton containerClassName={`${style.authorSkeleton}`} />
        )}
        {post ? (
          <TimestampLabel timestamp={post.posted_at} />
        ) : (
          <Skeleton containerClassName={`${style.dateSkeleton}`} />
        )}
      </div>
      {post ? <GreenText>{post.text}</GreenText> : <Skeleton count={3} />}
      {(post &&
        ((post.src && (
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
              expandable
              title={post.title}
              className={`${mediaClassName} ${style.media} ${
                blurred ? style.blurred : ""
              }`}
              src={post.src}
              height={previewHeight == 0 ? undefined : previewHeight}
              width={previewWidth == 0 ? undefined : previewWidth}
            />
          </div>
        )) || <></>)) || (
        <Skeleton containerClassName={style.imageSkeleton} height="100%" />
      )}
    </div>
  );
};
