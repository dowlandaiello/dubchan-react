import { Post } from "../model/post";
import { useEffect, useState, useRef, useContext, useCallback } from "react";
import { useUiRoute, route } from "../util/http";
import { VoteContext } from "../util/cookie";
import { Tag } from "./Tag";
import style from "./PostThumbnail.module.css";
import { FeedContext } from "./Feed";
import { CopyLink } from "./CopyLink";
import { UsernameLabel } from "./UsernameLabel";
import { TimestampLabel } from "./TimestampLabel";
import timestampStyle from "./TimestampLabel.module.css";
import { MediaViewer } from "./MediaViewer";
import clickable from "./Clickable.module.css";
import Image from "next/image";
import { GreenText } from "./GreenText";
import { PollDisplay } from "./PollDisplay";
import { Disclaimer } from "./Disclaimer";
import { useKeypair } from "../model/key_pair";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Link from "next/link";

export const PostBody = ({
  className,
  mediaClassName,
  post,
  blurred: initBlurred,
  compact,
  expandedText,
  deletable,
  onClickDelete,
}: {
  className?: string;
  mediaClassName?: string;
  post?: Post;
  blurred: Boolean;
  compact?: Boolean;
  expandedText?: Boolean;
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
  const [, setLastUpdated] = useContext(FeedContext);
  const [[previewWidth, previewHeight], setPreviewDims] = useState<
    [number, number]
  >([0, 0]);
  const [startingBlurred, _] = useState<Boolean>(initBlurred);
  const [blurredLocal, setBlurred] = useState<Boolean>(initBlurred);
  const blurred = initBlurred !== startingBlurred ? initBlurred : blurredLocal;
  const keypair = useKeypair(post?.user_id ?? undefined);
  const postUrl = useUiRoute(`?post=${post?.id ?? 0}`);
  const [isLeftAligned, setIsLeftAligned] = useState<boolean>(false);

  const [votes, addVote, removeVote] = useContext(VoteContext);

  const reload = () => {
    setLastUpdated(Date.now());
  };

  const onVote = async (choice: number) => {
    if (!post) return;

    // Mark the vote on the server
    await fetch(route(`/posts/${post.id}/poll/${choice}/votes`), {
      method: "POST",
    });

    addVote(post.id, choice);
    reload();
  };

  const onUnvote = async (choice: number) => {
    if (!post) return;

    // Mark the vote on the server
    await fetch(route(`/posts/${post.id}/poll/${choice}/votes`), {
      method: "DELETE",
    });

    removeVote(post.id, choice);
    reload();
  };

  useEffect(() => {
    const resizeListener = () => {
      if (!thumbnailRef.current || thumbnailRef.current == null) return;

      const elem = thumbnailRef.current;
      let elementWidth = elem.clientWidth;
      let elementHeight = elem.clientHeight;

      setPreviewDims(
        compact ? [elementWidth * 1, 0] : [elementWidth * 0.5, elementHeight]
      );
    };

    window.addEventListener("resize", resizeListener);

    setTimeout(resizeListener, 100);

    return () => {
      window.removeEventListener("resize", resizeListener);
    };
  }, []);

  const renderedRef = useCallback((node: HTMLDivElement) => {
    if (!node) return;
    const resizeObserver = new ResizeObserver((entries) => {
      if (!thumbnailRef.current) return;
      if (expandedText) return;

      for (const entry of entries) {
        if (entry.contentBoxSize) {
          if (
            entry.target.clientHeight <
            0.4 * thumbnailRef.current.clientHeight
          ) {
            setPreviewDims([
              thumbnailRef.current.clientWidth * 0.3,
              thumbnailRef.current.clientHeight,
            ]);
            setIsLeftAligned(true);
          }
        } else {
          if (
            entry.target.clientHeight <
            0.4 * thumbnailRef.current.clientHeight
          ) {
            setPreviewDims([
              thumbnailRef.current.clientWidth * 0.3,
              thumbnailRef.current.clientHeight,
            ]);
            setIsLeftAligned(true);
          }
        }
      }
    });
    resizeObserver.observe(node);
  }, []);

  const formatViews = (views: number): string => {
    if (views == 1) return `${views} View`;
    else return `${views} Views`;
  };

  return (
    <div
      className={`${style.postBody} ${className} ${
        compact ? style.compact : ""
      } ${expandedText ? style.expandedText : ""}`}
      ref={thumbnailRef}
    >
      <div className={style.titleLine}>
        {post && post.live && (
          <Image
            className={style.liveIcon}
            src="/broadcast.svg"
            height={15}
            width={15}
            alt="Live icon."
          />
        )}
        {post ? (
          <h1>{post?.title}</h1>
        ) : (
          <Skeleton containerClassName={style.flex1} height="2em" />
        )}
        <div className={style.titleLineRight}>
          <div className={style.viewsLabel}>
            {post?.n_opened ?? 0}
            <Image src="/eye.svg" height={15} width={15} alt="Views icon." />
          </div>
          {keypair && post && post.user_id && (
            <Link href={`/?message_to=${post.user_id}`}>
              <Image
                className={`${clickable.clickable} ${style.replyIcon}`}
                src="/mail.svg"
                height={15}
                width={15}
                alt="Mail icon."
              />
            </Link>
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
      </div>
      <div className={style.tagList}>{tags}</div>
      <div className={style.authorLine}>
        {post ? (
          post.user_id && <UsernameLabel username={post.user_id} />
        ) : (
          <Skeleton containerClassName={`${style.authorSkeleton}`} />
        )}
        {post ? (
          <>
            <TimestampLabel timestamp={post.posted_at} />
            <p className={timestampStyle.label}>•</p>
            <TimestampLabel
              timestamp={post.last_updated}
              prefix="Updated "
              relative
            />
          </>
        ) : (
          <Skeleton containerClassName={`${style.dateSkeleton}`} />
        )}
      </div>
      {post &&
        post.user_id &&
        post.user_id.toLowerCase().includes("dev") &&
        post.user_id !== "dev" && (
          <Disclaimer text="This is not an official dev post." />
        )}
      {post && post.id === 258 && (
        <Disclaimer text="This post is not endorsed by or affiliated with DubChan in any way." />
      )}
      {isLeftAligned && post && post.src && (
        <div className={style.contentArea}>
          {post.src && (
            <div
              className={`${style.leftMedia} ${
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
          )}
          <div className={style.postText}>
            <GreenText>{post.text}</GreenText>
          </div>
        </div>
      )}
      {post ? (
        !isLeftAligned && <GreenText>{post.text}</GreenText>
      ) : (
        <Skeleton count={3} />
      )}
      {(post &&
        ((post.src && !isLeftAligned && (
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
            {!isLeftAligned && (
              <MediaViewer
                ref={renderedRef}
                expandable
                title={post.title}
                className={`${mediaClassName} ${style.media} ${
                  blurred ? style.blurred : ""
                }`}
                src={post.src}
                height={previewHeight == 0 ? undefined : previewHeight}
                width={previewWidth == 0 ? undefined : previewWidth}
              />
            )}
          </div>
        )) || <></>)) || (
        <Skeleton containerClassName={style.imageSkeleton} height="100%" />
      )}
      {post && post.poll && post.poll.length > 0 && (
        <PollDisplay
          polls={post.poll}
          className={style.pollDisplay}
          initSelected={votes[post.id] === undefined ? null : votes[post.id]}
          onSelectChoice={onVote}
          onUnselectChoice={onUnvote}
        />
      )}
    </div>
  );
};
