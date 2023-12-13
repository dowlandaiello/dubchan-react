import { ThreadNode } from "../model/comment";
import { useRef, useEffect } from "react";
import style from "./CommentDisplay.module.css";
import { TimestampLabel } from "./TimestampLabel";
import { UsernameLabel } from "./UsernameLabel";
import Image from "next/image";
import Link from "next/link";
import clickable from "./Clickable.module.css";
import { MediaViewer } from "./MediaViewer";
import { NewComment } from "./NewComment";
import { useContext, useState } from "react";
import { FeedContext } from "./Feed";
import { GreenText } from "./GreenText";
import { Disclaimer } from "./Disclaimer";
import { useKeypair } from "../model/key_pair";

export const CommentDisplay = ({
  comment,
  tree,
  currentlyReplying,
  onReply,
  deletable,
  onClickDelete,
  mostRecent,
  compact,
}: {
  comment: ThreadNode;
  tree: { [id: number]: ThreadNode };
  currentlyReplying: number | null;
  onReply: (comment: number | null) => void;
  deletable?: Boolean;
  onClickDelete?: () => void;
  mostRecent?: number;
  compact: Boolean;
}) => {
  const [, setLastUpdated] = useContext(FeedContext);
  const children = comment.children
    .sort((a, b) => b.posted.secs_since_epoch - a.posted.secs_since_epoch)
    .map((child) => (
      <CommentDisplay
        onReply={onReply}
        currentlyReplying={currentlyReplying}
        key={child.id}
        comment={tree[child.id]}
        tree={tree}
        deletable={deletable}
        onClickDelete={onClickDelete}
        mostRecent={mostRecent}
        compact={compact}
      />
    ));
  const [minimized, setMinimized] = useState<boolean>(false);
  const keypair = useKeypair(comment.comment.user_id);
  const [[previewWidth, previewHeight], setPreviewDims] = useState<
    [number, number]
  >([0, 0]);
  const windowRef = useRef<HTMLDivElement | null>(null);

  const reload = () => {
    setLastUpdated(Date.now());
  };

  useEffect(() => {
    if (!windowRef.current || windowRef.current == null) return;

    const resizeObserver = new ResizeObserver(() => {
      const elem = windowRef.current;
      if (!elem) return;

      let elementWidth = elem.clientWidth;

      const compact = (windowRef?.current?.clientWidth ?? 0) < 700;

      setPreviewDims(
        compact
          ? [elementWidth, elementWidth * 0.5625]
          : [elementWidth * 0.4, elementWidth * 0.4 * 0.5625]
      );
    });
    resizeObserver.observe(windowRef.current);
    return () => resizeObserver.disconnect();
  }, [windowRef.current]);

  return (
    <div
      className={`${style.section} ${
        compact && children.length == 1 && style.compact
      } ${mostRecent === comment.comment.id ? style.highlighted : ""}`}
      ref={windowRef}
    >
      <div className={style.parent}>
        <div className={style.parentBody}>
          <div className={style.timestampRow}>
            <TimestampLabel timestamp={comment.comment.posted} />
            {comment.comment.user_id && (
              <UsernameLabel username={comment.comment.user_id} />
            )}
            {comment.comment.user_id &&
              comment.comment.user_id.toLowerCase().includes("dev") &&
              comment.comment.user_id !== "dev" && (
                <Disclaimer text="This is not an official dev post." />
              )}
            {keypair && comment.comment.user_id && (
              <Link href={`/?message_to=${comment.comment.user_id}`}>
                <Image
                  className={`${clickable.clickable} ${style.replyIcon}`}
                  src="/mail.svg"
                  height={15}
                  width={15}
                  alt="Mail icon."
                />
              </Link>
            )}
            <Image
              className={`${clickable.clickable} ${style.replyIcon}`}
              src="/reply.svg"
              height={15}
              width={15}
              alt="Reply icon."
              onClick={() => onReply(comment.comment.id)}
            />
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
          <div className={style.commentText}>
            <GreenText>{comment.comment.text}</GreenText>
          </div>
          {comment.comment.src && (
            <MediaViewer
              width={previewWidth == 0 ? undefined : previewWidth}
              height={previewHeight == 0 ? undefined : previewHeight}
              style={{
                width: previewWidth == 0 ? undefined : previewWidth,
                height: previewHeight == 0 ? undefined : previewHeight,
              }}
              className={style.media}
              src={comment.comment.src}
              expandable
            />
          )}
        </div>
        {children.length == 1 && compact && (
          <span className={style.threadIcon} />
        )}
      </div>
      {currentlyReplying === comment.comment.id && (
        <NewComment
          className={style.replyArea}
          key={comment.comment.id}
          parentPost={comment.comment.post_id}
          parentComment={comment.comment.id}
          onSubmitted={() => {
            reload();
            onReply(null);
          }}
          onClear={() => onReply(null)}
        />
      )}
      {children.length > 0 && (
        <div
          className={`${style.children} ${minimized ? style.minimized : ""} ${
            children.length == 1 && compact && style.inline
          }`}
        >
          <span
            className={`${style.thread} ${
              compact && children.length == 1 && style.compact
            } ${clickable.clickable}`}
            onClick={() => setMinimized(!minimized)}
          />
          {!minimized && children}
        </div>
      )}
    </div>
  );
};
