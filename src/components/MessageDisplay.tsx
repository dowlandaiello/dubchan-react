import { ThreadNode } from "../model/comment";
import { useRef, useState, useEffect } from "react";
import { TimestampLabel } from "./TimestampLabel";
import { UsernameLabel } from "./UsernameLabel";
import { Disclaimer } from "./Disclaimer";
import { GreenText } from "./GreenText";
import { MediaViewer } from "./MediaViewer";
import Image from "next/image";
import style from "./MessageDisplay.module.css";
import clickable from "./Clickable.module.css";

export const MessageDisplay = ({
  comment,
  tree,
  onReply,
  deletable,
  onClickDelete,
}: {
  comment: ThreadNode;
  tree: { [id: number]: ThreadNode };
  onReply: (comment: number | null) => void;
  deletable?: Boolean;
  onClickDelete?: () => void;
}) => {
  const [[previewWidth, previewHeight], setPreviewDims] = useState<
    [number, number]
  >([0, 0]);
  const windowRef = useRef<HTMLDivElement | null>(null);

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
    <div className={style.section} ref={windowRef}>
      {comment?.comment.parent_comment &&
        tree[comment?.comment.parent_comment] && (
          <div className={style.replyLine}>
            <Image src="/spine.svg" height={15} width={15} alt="Reply icon." />
            <p>{tree[comment?.comment.parent_comment].comment.text}</p>
          </div>
        )}
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
  );
};
